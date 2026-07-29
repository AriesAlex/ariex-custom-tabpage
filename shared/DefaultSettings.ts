import type Settings from '~/interfaces/Settings'

const defaultSettings: Settings = {
  wallpaperType: 'video',
  wallpaperSrc: '/api/static/video',
  mobileWallpaperType: 'video',
  mobileWallpaperSrc: '/api/static/video_mobile',
  wallpaperDarkening: true,
  dockPanelColor: 'rgba(255, 255, 255, 0.8)',
  dockPanelTextColor: '#000',
  pageBackgroundColor: '#fff',
}
const getDefaultSettings = (): Settings => ({ ...defaultSettings })
export default getDefaultSettings
