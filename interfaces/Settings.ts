export type WallpaperType = 'video' | 'image' | 'color'

export default interface Settings {
  wallpaperType: WallpaperType,
  wallpaperSrc: string,
  mobileWallpaperType: WallpaperType,
  mobileWallpaperSrc: string,
}
