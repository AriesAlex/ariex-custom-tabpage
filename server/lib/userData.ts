import fs from 'fs-extra'
import { randomUUID } from 'node:crypto'
import type Link from '~/interfaces/Link'
import type Settings from '~/interfaces/Settings'
import getDefaultSettings from '~/shared/DefaultSettings'
import { getDatabase } from './database'

const SETTINGS_FILE = 'settings.json'
const LINKS_FILE = 'links.json'

interface SettingsRow {
  wallpaper_type: Settings['wallpaperType']
  wallpaper_src: string
  mobile_wallpaper_type: Settings['mobileWallpaperType']
  mobile_wallpaper_src: string
  wallpaper_darkening: boolean
  dock_panel_color: string
  dock_panel_text_color: string
  page_background_color: string
}

interface StoredLink extends Link {
  id: string
  url: string
}

export async function getSettings(ownerId: string | null): Promise<Settings> {
  if (!ownerId)
    return {
      ...getDefaultSettings(),
      ...readJson<Partial<Settings>>(SETTINGS_FILE, {}),
    }

  const [settings] = await getDatabase()<SettingsRow[]>`
    SELECT
      wallpaper_type,
      wallpaper_src,
      mobile_wallpaper_type,
      mobile_wallpaper_src,
      wallpaper_darkening,
      dock_panel_color,
      dock_panel_text_color,
      page_background_color
    FROM tabpage_settings
    WHERE user_id = ${ownerId}
  `
  if (!settings) throw new Error(`Settings are missing for user ${ownerId}`)

  return {
    wallpaperType: settings.wallpaper_type,
    wallpaperSrc: settings.wallpaper_src,
    mobileWallpaperType: settings.mobile_wallpaper_type,
    mobileWallpaperSrc: settings.mobile_wallpaper_src,
    wallpaperDarkening: settings.wallpaper_darkening,
    dockPanelColor: settings.dock_panel_color,
    dockPanelTextColor: settings.dock_panel_text_color,
    pageBackgroundColor: settings.page_background_color,
  }
}

export async function saveSettings(
  ownerId: string | null,
  settings: Settings
) {
  if (!ownerId) {
    writeJson(SETTINGS_FILE, settings)
    return
  }

  await getDatabase()`
    UPDATE tabpage_settings
    SET
      wallpaper_type = ${settings.wallpaperType},
      wallpaper_src = ${settings.wallpaperSrc},
      mobile_wallpaper_type = ${settings.mobileWallpaperType},
      mobile_wallpaper_src = ${settings.mobileWallpaperSrc},
      wallpaper_darkening = ${settings.wallpaperDarkening},
      dock_panel_color = ${settings.dockPanelColor},
      dock_panel_text_color = ${settings.dockPanelTextColor},
      page_background_color = ${settings.pageBackgroundColor}
    WHERE user_id = ${ownerId}
  `
}

export async function getLinks(ownerId: string | null): Promise<Link[]> {
  if (!ownerId) {
    const links = readJson<Link[]>(LINKS_FILE, [])
    let changed = false
    for (const link of links)
      if (!link.id) {
        link.id = randomUUID()
        changed = true
      }
    if (changed) writeJson(LINKS_FILE, links)
    return links
  }

  return getDatabase()<StoredLink[]>`
    SELECT id, title, url, icon
    FROM tabpage_links
    WHERE user_id = ${ownerId}
    ORDER BY position, id
  `
}

export async function saveLink(
  ownerId: string | null,
  link: Omit<StoredLink, 'id'> & { id?: string | null }
) {
  if (!ownerId) {
    const links = await getLinks(null)
    if (link.id) {
      const index = links.findIndex(candidate => candidate.id === link.id)
      if (index === -1) return false
      links[index] = { ...link, id: link.id }
    } else links.push({ ...link, id: randomUUID() })
    writeJson(LINKS_FILE, links)
    return true
  }

  const sql = getDatabase()
  if (link.id) {
    const result = await sql`
      UPDATE tabpage_links
      SET title = ${link.title}, url = ${link.url}, icon = ${link.icon ?? null}
      WHERE id = ${link.id} AND user_id = ${ownerId}
      RETURNING id
    `
    return result.length === 1
  }

  await sql.begin(async transaction => {
    const [last] = await transaction<{ position: number | null }[]>`
      SELECT MAX(position) AS position
      FROM tabpage_links
      WHERE user_id = ${ownerId}
    `
    await transaction`
      INSERT INTO tabpage_links (id, user_id, position, title, url, icon)
      VALUES (
        ${randomUUID()},
        ${ownerId},
        ${(last.position ?? -1) + 1},
        ${link.title},
        ${link.url},
        ${link.icon ?? null}
      )
    `
  })
  return true
}

export async function deleteLink(ownerId: string | null, id: string) {
  if (!ownerId) {
    const links = await getLinks(null)
    const remaining = links.filter(link => link.id !== id)
    if (remaining.length === links.length) return false
    writeJson(LINKS_FILE, remaining)
    return true
  }

  const deleted = await getDatabase()`
    DELETE FROM tabpage_links
    WHERE id = ${id} AND user_id = ${ownerId}
    RETURNING id
  `
  return deleted.length === 1
}

export async function moveLink(
  ownerId: string | null,
  id: string,
  offset: number
) {
  if (!ownerId) {
    const links = await getLinks(null)
    const index = links.findIndex(link => link.id === id)
    if (index === -1) return false
    moveItem(links, index, index + offset)
    writeJson(LINKS_FILE, links)
    return true
  }

  const sql = getDatabase()
  return sql.begin(async transaction => {
    const links = await transaction<{ id: string }[]>`
      SELECT id
      FROM tabpage_links
      WHERE user_id = ${ownerId}
      ORDER BY position, id
      FOR UPDATE
    `
    const index = links.findIndex(link => link.id === id)
    if (index === -1) return false

    moveItem(links, index, index + offset)
    for (const [position, link] of links.entries())
      await transaction`
        UPDATE tabpage_links
        SET position = ${position}
        WHERE id = ${link.id} AND user_id = ${ownerId}
      `
    return true
  })
}

function moveItem<T>(items: T[], from: number, requestedTo: number) {
  const to = Math.max(0, Math.min(items.length - 1, requestedTo))
  const [item] = items.splice(from, 1)
  items.splice(to, 0, item)
}

function readJson<T>(filename: string, defaultValue: T): T {
  if (!fs.existsSync(filename)) {
    writeJson(filename, defaultValue)
    return defaultValue
  }
  return fs.readJSONSync(filename)
}

function writeJson<T>(filename: string, value: T) {
  const json = `${JSON.stringify(value, null, 2)}\n`
  fs.ensureFileSync(filename)

  const descriptor = fs.openSync(filename, 'r+')
  try {
    fs.writeFileSync(descriptor, json)
    fs.ftruncateSync(descriptor, Buffer.byteLength(json))
    fs.fsyncSync(descriptor)
  } finally {
    fs.closeSync(descriptor)
  }
}
