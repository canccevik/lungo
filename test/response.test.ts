import request from 'supertest'
import { Server } from 'http'
import { Lungo } from '../src/index'
import { IRequest, IResponse } from '../src/interfaces'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import cookie from 'cookie'

describe('Response Class', () => {
  let app: Lungo
  let server: Server

  beforeEach(() => {
    app = new Lungo()
  })

  afterEach(() => {
    server.close()
  })

  describe('status method', () => {
    test('should set the status code', async () => {
      app.post('/test', (req: IRequest, res: IResponse) => {
        res.status(201).end()
      })

      server = app.listen(3001)
      const res = await request(server).post('/test')

      expect(res.statusCode).toEqual(StatusCodes.CREATED)
    })
  })

  describe('type method', () => {
    test('should set the type of header', async () => {
      app.get('/test', (req: IRequest, res: IResponse) => {
        res.type('json').end()
      })

      server = app.listen(3001)
      const res = await request(server).get('/test')

      expect(res.get('Content-Type')).toEqual('application/json')
    })

    test('should throw error for unknown mime type', async () => {
      app.get('/test', (req: IRequest, res: IResponse) => {
        res.type('unknown-type').end()
      })

      server = app.listen(3001)
      const res = await request(server).get('/test')

      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })

  describe('json method', () => {
    test('should response with json', async () => {
      const payload = { packageName: 'lungo' }
      app.get('/test', (req: IRequest, res: IResponse) => {
        res.json(payload)
      })

      server = app.listen(3001)
      const res = await request(server).get('/test')

      expect(res.body).toEqual(payload)
    })
  })

  describe('send method', () => {
    test('should change the content type and send the response', async () => {
      const html = '<html><body>lungo</body></html>'
      app.get('/html', (req: IRequest, res: IResponse) => {
        res.send(html)
      })

      const payload = { packageName: 'lungo' }
      app.get('/json', (req: IRequest, res: IResponse) => {
        res.send(payload)
      })

      server = app.listen(3001)
      const htmlRes = await request(server).get('/html')
      const jsonRes = await request(server).get('/json')

      expect(htmlRes.get('Content-Type')).toEqual('text/html; charset=utf-8')
      expect(htmlRes.text).toEqual(html)
      expect(jsonRes.get('Content-Type')).toEqual('application/json; charset=utf-8')
      expect(jsonRes.body).toEqual(payload)
    })

    test('should throw error for disallowed type', async () => {
      app.get('/test', (req: IRequest, res: IResponse) => {
        res.send(Symbol('symbol') as never)
      })

      server = app.listen(3001)
      const res = await request(server).get('/test')

      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })

  describe('sendStatus method', () => {
    test('should response with status code reason phrase', async () => {
      const statusCode = StatusCodes.CREATED
      const reasonPhrase = getReasonPhrase(statusCode)

      app.get('/test', (req: IRequest, res: IResponse) => {
        res.sendStatus(statusCode)
      })

      server = app.listen(3001)
      const res = await request(server).get('/test')

      expect(res.statusCode).toEqual(statusCode)
      expect(res.text).toEqual(reasonPhrase)
    })
  })

  describe('get method', () => {
    test('should get the value of header', async () => {
      const mimeType = 'application/json; charset=utf-8'
      app.get('/test', (req: IRequest, res: IResponse) => {
        res.type(mimeType)
        const contentType = res.get('content-type')
        res.send(contentType as string)
      })

      server = app.listen(3001)
      const res = await request(server).get('/test')

      expect(res.text).toEqual(mimeType)
    })
  })

  describe('set method', () => {
    test('should set the header by key and value', async () => {
      app.get('/test', (req: IRequest, res: IResponse) => {
        res.set('content-type', 'application/json')
        res.end()
      })

      server = app.listen(3001)
      const res = await request(server).get('/test')

      const contentType = res.get('content-type')
      expect(contentType).toEqual('application/json')
    })

    test('should set the headers with object', async () => {
      app.get('/test', (req: IRequest, res: IResponse) => {
        res.set({
          'content-type': 'application/json',
          'x-package-name': 'lungo'
        })
        res.end()
      })

      server = app.listen(3001)
      const res = await request(server).get('/test')
      const contentType = res.get('content-type')
      const packageName = res.get('x-package-name')

      expect(contentType).toEqual('application/json')
      expect(packageName).toEqual('lungo')
    })
  })

  describe('cookie method', () => {
    test('should set the cookie of the header', async () => {
      app.get('/test', (req: IRequest, res: IResponse) => {
        res.cookie('package-name', 'lungo').end()
      })

      server = app.listen(3001)
      const res = await request(server).get('/test')
      const packageName = cookie.parse(res.headers['set-cookie'][0])['package-name']

      expect(packageName).toEqual('lungo')
    })
  })
})
