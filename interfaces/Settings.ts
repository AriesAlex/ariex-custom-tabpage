export type WallpaperType = 'video' | 'image' | 'color'

export default interface Settings {
  wallpaperType: WallpaperType
  wallpaperSrc: string
  mobileWallpaperType: WallpaperType
  mobileWallpaperSrc: string
  wallpaperDarkening: boolean
  dockPanelColor: string
  dockPanelTextColor: string
  pageBackgroundColor: string
}
