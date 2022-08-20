import request from 'supertest'
import { Server } from 'http'
import { Lungo, Request, Response } from '../src/index'

describe('Request Class', () => {
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

  describe('params property', () => {
    test('should be defined as empty object if params not provided', async () => {
      // arrange
      app.get('/test', (req: Request, res: Response) => {
        res.send(req.params)
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/test')

      // assert
      expect(res.body).toEqual({})
    })

    test('should params be accessible ', async () => {
      // arrange
      app.get('/:version/packages/:packageName', (req: Request, res: Response) => {
        res.send({
          version: req.params.version,
          packageName: req.params.packageName
        })
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/v1/packages/lungo')

      // assert
      expect(res.body.version).toEqual('v1')
      expect(res.body.packageName).toEqual('lungo')
    })
  })

  describe('query property', () => {
    test('should be defined as empty object if queries not provided', async () => {
      // arrange
      app.get('/test', (req: Request, res: Response) => {
        res.send(req.query)
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/test')

      // assert
      expect(res.body).toEqual({})
    })

    test('should queries be accessible ', async () => {
      // arrange
      app.get('/packages', (req: Request, res: Response) => {
        res.send({
          packageName: req.query.packageName
        })
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/packages?packageName=lungo')

      // assert
      expect(res.body.packageName).toEqual('lungo')
    })
  })

  describe('originalUrl property', () => {
    test('should be defined', async () => {
      // arrange
      app.get('/packages', (req: Request, res: Response) => {
        res.end(req.originalUrl)
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/packages?packageName=lungo')

      // assert
      expect(res.text).toEqual('/packages?packageName=lungo')
    })
  })
})
