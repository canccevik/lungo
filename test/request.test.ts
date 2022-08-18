import request from 'supertest'
import { Server } from 'http'
import { Lungo, Request, Response } from '../src/index'

describe('Response Class', () => {
  let app: Lungo
  let server: Server

  beforeEach(() => {
    app = new Lungo()
  })

  afterEach(() => {
    server.close()
  })

  describe('get method', () => {
    test('should get the value of header', async () => {
      // arrange
      app.get('/test', (req: Request, res: Response) => {
        const packageName = req.get('x-package-name')
        res.end(packageName)
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/test').set('x-package-name', 'lungo')

      // assert
      expect(res.text).toEqual('lungo')
    })
  })

  describe('ip property', () => {
    test('should be defined', async () => {
      // arrange
      app.get('/test', (req: Request, res: Response) => {
        const ipAddress = req.ip
        res.end(ipAddress)
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/test')

      // assert
      expect(res.text).toEqual('127.0.0.1')
    })
  })
})
