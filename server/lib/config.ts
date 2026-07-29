const REQUIRED_MULTI_USER_ENV = [
  'DATABASE_URL',
  'S3_ENDPOINT',
  'S3_REGION',
  'S3_BUCKET',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
  'S3_PREFIX',
] as const

interface SingleUserConfig {
  multiUserEnabled: false
  registrationEnabled: false
  secureCookies: false
}

interface MultiUserConfig {
  multiUserEnabled: true
  registrationEnabled: boolean
  secureCookies: boolean
  databaseUrl: string
  s3: {
    endpoint: string
    region: string
    bucket: string
    accessKeyId: string
    secretAccessKey: string
    prefix: string
    forcePathStyle: boolean
  }
}

export type AppConfig = SingleUserConfig | MultiUserConfig

const appConfig = loadAppConfig()

export function getAppConfig(): AppConfig {
  return appConfig
}

function loadAppConfig(): AppConfig {
  const multiUserMode = process.env.MULTI_USER_MODE?.trim().toLowerCase()
  if (multiUserMode && multiUserMode !== 'true' && multiUserMode !== 'false')
    throw new Error('MULTI_USER_MODE must be either true or false')

  if (multiUserMode !== 'true')
    return {
      multiUserEnabled: false,
      registrationEnabled: false,
      secureCookies: false,
    }

  const missing = REQUIRED_MULTI_USER_ENV.filter(name => !process.env[name])
  if (missing.length)
    throw new Error(
      `Multi-user mode requires environment variables: ${missing.join(', ')}`
    )

  const prefix = process.env.S3_PREFIX!.replace(/^\/+|\/+$/g, '')
  if (!prefix) throw new Error('S3_PREFIX must contain a non-empty path')

  return {
    multiUserEnabled: true,
    registrationEnabled: parseBooleanEnv('REGISTRATION_ENABLED', true),
    secureCookies: parseBooleanEnv(
      'SESSION_COOKIE_SECURE',
      process.env.NODE_ENV === 'production'
    ),
    databaseUrl: process.env.DATABASE_URL!,
    s3: {
      endpoint: process.env.S3_ENDPOINT!,
      region: process.env.S3_REGION!,
      bucket: process.env.S3_BUCKET!,
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      prefix,
      forcePathStyle: parseBooleanEnv('S3_FORCE_PATH_STYLE', false),
    },
  }
}

function parseBooleanEnv(name: string, defaultValue: boolean) {
  const value = process.env[name]?.trim().toLowerCase()
  if (!value) return defaultValue
  if (value === 'true') return true
  if (value === 'false') return false
  throw new Error(`${name} must be either true or false`)
}
