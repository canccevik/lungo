import request from 'supertest'
import { Server } from 'http'
import { Lungo, Request, Response } from '../src/index'
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
      // arrange
      app.post('/test', (req: Request, res: Response) => {
        res.status(201).end()
      })
      server = app.listen(3001)

      // act
      const res = await request(server).post('/test')

      // assert
      expect(res.statusCode).toEqual(StatusCodes.CREATED)
    })
  })

  describe('type method', () => {
    test('should set the type of header', async () => {
      // arrange
      app.get('/test', (req: Request, res: Response) => {
        res.type('json').end()
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/test')

      // assert
      expect(res.get('Content-Type')).toEqual('application/json')
    })

    test('should throw error for unknown mime type', async () => {
      // arrange
      app.get('/test', (req: Request, res: Response) => {
        res.type('unknown-type').end()
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/test')

      // assert
      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })

  describe('json method', () => {
    test('should response with json', async () => {
      // arrange
      const payload = { packageName: 'lungo' }
      app.get('/test', (req: Request, res: Response) => {
        res.json(payload)
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/test')

      // assert
      expect(res.body).toEqual(payload)
    })
  })

  describe('send method', () => {
    test('should change the content type and send the response', async () => {
      // arrange
      const html = '<html><body>lungo</body></html>'
      app.get('/html', (req: Request, res: Response) => {
        res.send(html)
      })

      const payload = { packageName: 'lungo' }
      app.get('/json', (req: Request, res: Response) => {
        res.send(payload)
      })

      server = app.listen(3001)

      // act
      const htmlRes = await request(server).get('/html')
      const jsonRes = await request(server).get('/json')

      // assert
      expect(htmlRes.get('Content-Type')).toEqual('text/html; charset=utf-8')
      expect(htmlRes.text).toEqual(html)
      expect(jsonRes.get('Content-Type')).toEqual('application/json; charset=utf-8')
      expect(jsonRes.body).toEqual(payload)
    })

    test('should throw error for disallowed type', async () => {
      // arrange
      app.get('/test', (req: Request, res: Response) => {
        res.send(Symbol('symbol') as never)
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/test')

      // assert
      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })

  describe('sendStatus method', () => {
    test('should response with status code reason phrase', async () => {
      // arrange
      const statusCode = StatusCodes.CREATED
      const reasonPhrase = getReasonPhrase(statusCode)

      app.get('/test', (req: Request, res: Response) => {
        res.sendStatus(statusCode)
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/test')

      // assert
      expect(res.statusCode).toEqual(statusCode)
      expect(res.text).toEqual(reasonPhrase)
    })
  })

  describe('get method', () => {
    test('should get the value of header', async () => {
      // arrange
      const mimeType = 'application/json; charset=utf-8'

      app.get('/test', (req: Request, res: Response) => {
        res.type(mimeType)
        const contentType = res.get('content-type')
        res.send(contentType as string)
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/test')

      // assert
      expect(res.text).toEqual(mimeType)
    })
  })

  describe('set method', () => {
    test('should set the header by key and value', async () => {
      // arrange
      app.get('/test', (req: Request, res: Response) => {
        res.set('content-type', 'application/json').end()
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/test')

      // assert
      const contentType = res.get('content-type')
      expect(contentType).toEqual('application/json')
    })

    test('should set the headers with object', async () => {
      // arrange
      app.get('/test', (req: Request, res: Response) => {
        res
          .set({
            'content-type': 'application/json',
            'x-package-name': 'lungo'
          })
          .end()
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/test')
      const contentType = res.get('content-type')
      const packageName = res.get('x-package-name')

      // assert
      expect(contentType).toEqual('application/json')
      expect(packageName).toEqual('lungo')
    })
  })

  describe('cookie method', () => {
    test('should set the cookie of the header', async () => {
      // arrange
      app.get('/test', (req: Request, res: Response) => {
        res.cookie('package-name', 'lungo').end()
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/test')
      const packageName = cookie.parse(res.headers['set-cookie'][0])['package-name']

      // assert
      expect(packageName).toEqual('lungo')
    })
  })
})
