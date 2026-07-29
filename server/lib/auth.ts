import {
  createHash,
  randomBytes,
  randomUUID,
  scrypt,
  timingSafeEqual,
} from 'node:crypto'
import { createError, deleteCookie, getCookie, setCookie } from 'h3'
import type { H3Event } from 'h3'
import type { AuthUser } from '~/interfaces/Auth'
import getDefaultSettings from '~/shared/DefaultSettings'
import { getAppConfig } from './config'
import { getDatabase } from './database'

const SESSION_COOKIE = 'tabpage_session'
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,32}$/

interface Credentials {
  username?: unknown
  password?: unknown
}

interface UserRow extends AuthUser {
  password_salt: Buffer
  password_hash: Buffer
}

export async function getAuthUser(event: H3Event): Promise<AuthUser | null> {
  if (!getAppConfig().multiUserEnabled) return null

  const token = getCookie(event, SESSION_COOKIE)
  if (!token) return null

  const sql = getDatabase()
  const [user] = await sql<AuthUser[]>`
    SELECT users.id, users.username
    FROM tabpage_sessions sessions
    JOIN tabpage_users users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ${hashSessionToken(token)}
      AND sessions.expires_at > NOW()
  `
  return user ?? null
}

export async function requireUser(event: H3Event): Promise<AuthUser> {
  const user = await getAuthUser(event)
  if (user) return user

  throw createError({
    statusCode: 401,
    message: event.context.$t('authenticationRequired'),
  })
}

export async function getDataOwnerId(event: H3Event): Promise<string | null> {
  return getAppConfig().multiUserEnabled
    ? (await requireUser(event)).id
    : null
}

export async function register(
  event: H3Event,
  credentials: Credentials
): Promise<AuthUser> {
  const config = ensureMultiUserMode()
  if (!config.registrationEnabled)
    throw createError({
      statusCode: 403,
      message: event.context.$t('registrationDisabled'),
    })
  const { username, normalizedUsername, password } = parseCredentials(
    event,
    credentials
  )
  const salt = randomBytes(16)
  const passwordHash = await derivePasswordHash(password, salt)
  const id = randomUUID()
  const settings = getDefaultSettings()
  const sql = getDatabase()

  try {
    await sql.begin(async transaction => {
      await transaction`
        INSERT INTO tabpage_users (
          id,
          username,
          username_normalized,
          password_salt,
          password_hash
        )
        VALUES (
          ${id},
          ${username},
          ${normalizedUsername},
          ${salt},
          ${passwordHash}
        )
      `
      await transaction`
        INSERT INTO tabpage_settings (
          user_id,
          wallpaper_type,
          wallpaper_src,
          mobile_wallpaper_type,
          mobile_wallpaper_src,
          wallpaper_darkening,
          dock_panel_color,
          dock_panel_text_color,
          page_background_color
        )
        VALUES (
          ${id},
          ${settings.wallpaperType},
          ${settings.wallpaperSrc},
          ${settings.mobileWallpaperType},
          ${settings.mobileWallpaperSrc},
          ${settings.wallpaperDarkening},
          ${settings.dockPanelColor},
          ${settings.dockPanelTextColor},
          ${settings.pageBackgroundColor}
        )
      `
    })
  } catch (error: unknown) {
    if (hasErrorCode(error, '23505'))
      throw createError({
        statusCode: 409,
        message: event.context.$t('usernameTaken'),
      })
    throw error
  }

  const user = { id, username }
  await createSession(event, user.id)
  return user
}

export async function login(
  event: H3Event,
  credentials: Credentials
): Promise<AuthUser> {
  ensureMultiUserMode()
  const { normalizedUsername, password } = parseCredentials(event, credentials)
  const sql = getDatabase()
  const [user] = await sql<UserRow[]>`
    SELECT id, username, password_salt, password_hash
    FROM tabpage_users
    WHERE username_normalized = ${normalizedUsername}
  `

  const passwordHash = user
    ? await derivePasswordHash(password, Buffer.from(user.password_salt))
    : await derivePasswordHash(password, Buffer.alloc(16))

  if (
    !user ||
    !timingSafeEqual(passwordHash, Buffer.from(user.password_hash))
  )
    throw createError({
      statusCode: 401,
      message: event.context.$t('invalidCredentials'),
    })

  await createSession(event, user.id)
  return { id: user.id, username: user.username }
}

export async function logout(event: H3Event) {
  ensureMultiUserMode()
  const token = getCookie(event, SESSION_COOKIE)
  if (token)
    await getDatabase()`
      DELETE FROM tabpage_sessions
      WHERE token_hash = ${hashSessionToken(token)}
    `
  clearSessionCookie(event)
}

export async function deleteAccount(event: H3Event, userId: string) {
  ensureMultiUserMode()
  await getDatabase()`
    DELETE FROM tabpage_users
    WHERE id = ${userId}
  `
  clearSessionCookie(event)
}

function ensureMultiUserMode() {
  const config = getAppConfig()
  if (!config.multiUserEnabled)
    throw createError({ statusCode: 404, message: 'Not found' })
  return config
}

function parseCredentials(event: H3Event, credentials: Credentials) {
  const username =
    typeof credentials.username === 'string' ? credentials.username.trim() : ''
  const password =
    typeof credentials.password === 'string' ? credentials.password : ''

  if (!USERNAME_PATTERN.test(username))
    throw createError({
      statusCode: 400,
      message: event.context.$t('invalidUsername'),
    })
  if (password.length < 8 || password.length > 200)
    throw createError({
      statusCode: 400,
      message: event.context.$t('invalidPassword'),
    })

  return {
    username,
    normalizedUsername: username.toLowerCase(),
    password,
  }
}

function derivePasswordHash(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (error, key) => {
      if (error) reject(error)
      else resolve(key)
    })
  })
}

async function createSession(event: H3Event, userId: string) {
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_SECONDS * 1000
  ).toISOString()
  const sql = getDatabase()

  await sql.begin(async transaction => {
    await transaction`
      DELETE FROM tabpage_sessions
      WHERE expires_at <= NOW()
    `
    await transaction`
      INSERT INTO tabpage_sessions (token_hash, user_id, expires_at)
      VALUES (${hashSessionToken(token)}, ${userId}, ${expiresAt})
    `
  })

  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: getAppConfig().secureCookies,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  })
}

function clearSessionCookie(event: H3Event) {
  deleteCookie(event, SESSION_COOKIE, {
    httpOnly: true,
    secure: getAppConfig().secureCookies,
    sameSite: 'lax',
    path: '/',
  })
}

function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

function hasErrorCode(error: unknown, code: string) {
  return (
    error != null &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === code
  )
}
