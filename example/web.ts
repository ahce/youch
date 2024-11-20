import cookie from 'cookie'
import { createServer } from 'node:http'
import { createError } from '@poppinss/exception'

import { run as pg } from './pg.js'
import { Youch } from '../src/youch.js'
import { run as axios } from './axios.js'
import { run as drive } from './flydrive.js'
import { HTTP_STATUSES } from './http_statuses.js'

const E_ROUTE_NOT_FOUND = createError('Route not found', 'E_ROUTE_NOT_FOUND', 404)
const AVAILABLE_ROUTES = ['/axios', '/drive', '/pg']

createServer(async (req, res) => {
  try {
    switch (req.url) {
      case '/axios':
        await axios()
        break
      case '/drive':
        await drive()
        break
      case '/pg':
        await pg()
        break
      default:
        throw new E_ROUTE_NOT_FOUND()
    }
  } catch (error) {
    const statusCode = error.status ?? 500
    const status = HTTP_STATUSES.find((httpStatus) => httpStatus.code === statusCode)
    const headers = Object.keys(req.headers).map((key) => {
      const value = req.headers[key]
      return {
        key,
        value: key === 'cookie' ? { ...cookie.parse(value as string) } : value,
      }
    })

    const youch = new Youch({ title: status?.pharse, cspNonce: 'fooooo' })

    if (error instanceof E_ROUTE_NOT_FOUND) {
      youch.metadata.group('Application', {
        routes: AVAILABLE_ROUTES.map((route) => {
          return {
            key: 'GET',
            value: `<a href="${route}">${route}</a>`,
          }
        }),
      })
    }

    youch.metadata.group('Request', {
      headers,
    })

    const html = await youch.render(error)
    res.writeHead(statusCode, { 'content-type': 'text/html' })
    res.write(html)
    res.end()
  }
}).listen(3000)