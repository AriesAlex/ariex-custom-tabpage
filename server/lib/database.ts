import postgres from 'postgres'
import { getAppConfig } from './config'

let database: ReturnType<typeof postgres> | undefined
let initialization: Promise<void> | undefined

export function getDatabase() {
  const config = getAppConfig()
  if (!config.multiUserEnabled)
    throw new Error('PostgreSQL is unavailable in single-user mode')

  if (!database)
    database = postgres(config.databaseUrl, {
      max: 10,
      connect_timeout: 10,
      idle_timeout: 20,
      onnotice: () => {},
    })

  return database
}

export function initializeDatabase() {
  if (initialization) return initialization

  initialization = (async () => {
    const sql = getDatabase()

    await sql`
      CREATE TABLE IF NOT EXISTS tabpage_users (
        id UUID PRIMARY KEY,
        username VARCHAR(32) NOT NULL,
        username_normalized VARCHAR(32) NOT NULL UNIQUE,
        password_salt BYTEA NOT NULL,
        password_hash BYTEA NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS tabpage_sessions (
        token_hash CHAR(64) PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES tabpage_users(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `
    await sql`
      CREATE INDEX IF NOT EXISTS tabpage_sessions_user_id_idx
      ON tabpage_sessions(user_id)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS tabpage_sessions_expires_at_idx
      ON tabpage_sessions(expires_at)
    `
    await sql`
      CREATE TABLE IF NOT EXISTS tabpage_settings (
        user_id UUID PRIMARY KEY REFERENCES tabpage_users(id) ON DELETE CASCADE,
        wallpaper_type VARCHAR(16) NOT NULL,
        wallpaper_src TEXT NOT NULL,
        mobile_wallpaper_type VARCHAR(16) NOT NULL,
        mobile_wallpaper_src TEXT NOT NULL,
        wallpaper_darkening BOOLEAN NOT NULL,
        dock_panel_color TEXT NOT NULL,
        dock_panel_text_color TEXT NOT NULL,
        page_background_color TEXT NOT NULL
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS tabpage_links (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES tabpage_users(id) ON DELETE CASCADE,
        position INTEGER NOT NULL,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        icon TEXT
      )
    `
    await sql`
      CREATE INDEX IF NOT EXISTS tabpage_links_user_position_idx
      ON tabpage_links(user_id, position)
    `
  })()

  return initialization
}

export async function closeDatabase() {
  await database?.end()
  database = undefined
  initialization = undefined
}
