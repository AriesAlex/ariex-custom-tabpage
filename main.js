;(async () => {
  const { arrayMoveMutable } = await import('array-move')
  const { v4 } = require('uuid')
  const fs = require('fs-extra')
  const express = require('express')
  const app = express()

  if (!fs.existsSync('links.json')) fs.writeFileSync('links.json', '[]')
  else {
    const links = fs.readJSONSync('links.json')
    let changed = 0
    links
      .filter(l => !l.id)
      .forEach(l => {
        l.id = v4()
        changed++
      })
    if (changed > 0) fs.writeJsonSync('links.json', links, { spaces: 2 })
  }

  app.use(express.static('static/dist'))
  app.use(express.static('data'))
  const limit = '500kb'
  app.use(express.json({ limit }))
  app.use(express.urlencoded({ extended: true, limit }))

  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'content-type')
    res.setHeader('X-Powered-By', 'ArieX')
    next()
  })

  app.get('/api/get', (req, res) => {
    res.send(fs.readJSONSync('links.json'))
  })

  app.post('/api/add', async (req, res) => {
    const link = req.body
    const links = fs.readJSONSync('links.json')

    if (!link.title || !link.url)
      return res.status(400).send('Укажите заголовок и ссылку')

    if (!link.url.startsWith('http')) link.url = 'https://' + link.url
    if (!link.icon) link.icon = null

    if (link.id) {
      const existLinkIndex = links.findIndex(l => l.id == link.id)
      if (!existLinkIndex)
        return res.status(400).send('Ссылки с таким id не существует')
      links[existLinkIndex] = link
    } else links.push({ ...link, id: v4() })

    fs.writeJsonSync('links.json', links, { spaces: 2 })
    res.status(200).send('ok')
  })

  app.post('/api/delete', async (req, res) => {
    const id = req.body.id
    if (!id) return res.status(400).send('Укажите id ссылки')

    let links = fs.readJSONSync('links.json')

    links = links.filter(l => l.id != id)

    fs.writeJSONSync('links.json', links, { spaces: 2 })
    res.status(200).send('ok')
  })

  app.post('/api/move', async (req, res) => {
    const { id, offset } = req.body
    if (!id) return res.status(400).send('Укажите id ссылки')
    if (!offset) return res.status(400).send('Укажите смещение')

    let links = fs.readJSONSync('links.json')

    const index = links.findIndex(l => l.id == id)
    arrayMoveMutable(links, index, index + offset)

    fs.writeJSONSync('links.json', links, { spaces: 2 })
    res.status(200).send('ok')
  })

  app.listen(4554)
  console.log('Server started')
})()
