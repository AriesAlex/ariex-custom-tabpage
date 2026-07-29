import { createError } from 'h3'
import type { H3Event } from 'h3'
import type Settings from '~/interfaces/Settings'
import type { WallpaperType } from '~/interfaces/Settings'

const WALLPAPER_TYPES: WallpaperType[] = ['video', 'image', 'color']
const STRING_FIELDS = [
  'wallpaperSrc',
  'mobileWallpaperSrc',
  'dockPanelColor',
  'dockPanelTextColor',
  'pageBackgroundColor',
] as const

export function parseSettings(event: H3Event, value: unknown): Settings {
  if (!value || typeof value !== 'object') return invalidSettings(event)
  const settings = value as Record<string, unknown>

  if (
    !WALLPAPER_TYPES.includes(settings.wallpaperType as WallpaperType) ||
    !WALLPAPER_TYPES.includes(settings.mobileWallpaperType as WallpaperType) ||
    typeof settings.wallpaperDarkening !== 'boolean' ||
    STRING_FIELDS.some(
      field =>
        typeof settings[field] !== 'string' ||
        (settings[field] as string).length > 2048
    )
  )
    return invalidSettings(event)

  return {
    wallpaperType: settings.wallpaperType as WallpaperType,
    wallpaperSrc: settings.wallpaperSrc as string,
    mobileWallpaperType: settings.mobileWallpaperType as WallpaperType,
    mobileWallpaperSrc: settings.mobileWallpaperSrc as string,
    wallpaperDarkening: settings.wallpaperDarkening,
    dockPanelColor: settings.dockPanelColor as string,
    dockPanelTextColor: settings.dockPanelTextColor as string,
    pageBackgroundColor: settings.pageBackgroundColor as string,
  }
}

function invalidSettings(event: H3Event): never {
  throw createError({
    statusCode: 400,
    message: event.context.$t('invalidSettings'),
  })
}
