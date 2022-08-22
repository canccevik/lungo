import request from 'supertest'
import { Server } from 'http'
import { Lungo, Request, Response } from '../src/index'
import { StatusCodes } from 'http-status-codes'

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

  describe('baseUrl property', () => {
    test('should be defined', async () => {
      // arrange
      app.get('/packages', (req: Request, res: Response) => {
        res.end(req.baseUrl)
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/packages?packageName=lungo')

      // assert
      expect(res.text).toEqual('/packages')
    })
  })

  describe('path property', () => {
    test('should be defined', async () => {
      // arrange
      app.get('/packages/:packageId/settings', (req: Request, res: Response) => {
        res.end(req.path)
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/packages/12/settings')

      // assert
      expect(res.text).toEqual('/settings')
    })
  })

  describe('body property', () => {
    test('should be defined', async () => {
      // arrange
      const newPackage = { packageName: 'lungo' }

      app.post('/packages', (req: Request, res: Response) => {
        res.send(req.body)
      })
      server = app.listen(3001)

      // act
      const res = await request(server).post('/packages').send(newPackage)

      // assert
      expect(res.body).toEqual(newPackage)
    })

    test('should response with error when json is not valid', async () => {
      // arrange
      const unvalidJSON = "{packageName: 'lungo'}"

      app.post('/packages', (req: Request, res: Response) => {
        res.send(req.body)
      })
      server = app.listen(3001)

      // act
      const res = await request(server).post('/packages').send(unvalidJSON)

      // assert
      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })

  describe('accepts method ', () => {
    test('should return the mime type for */*', async () => {
      // arrange
      app.post('/test', (req: Request, res: Response) => {
        const accepts = req.accepts('application/json')
        res.end(accepts)
      })
      server = app.listen(3001)

      // act
      const res = await request(server).post('/test').set('accept', '*/*')

      // assert
      expect(res.text).toEqual('application/json')
    })

    test('should return the mime type when its accepted', async () => {
      // arrange
      app.post('/test', (req: Request, res: Response) => {
        const accepts = req.accepts('text/html')
        res.end(accepts)
      })
      server = app.listen(3001)

      // act
      const res = await request(server).post('/test').set('accept', 'text/html')

      // assert
      expect(res.text).toEqual('text/html')
    })

    test('should return the mime type when one of them accepted', async () => {
      // arrange
      app.post('/test', (req: Request, res: Response) => {
        const accepts = req.accepts('application/json', 'text/html')
        res.end(accepts)
      })
      server = app.listen(3001)

      // act
      const res = await request(server).post('/test').set('accept', 'text/html')

      // assert
      expect(res.text).toEqual('text/html')
    })

    test('should return false when mime type is not accepted', async () => {
      // arrange
      app.post('/test', (req: Request, res: Response) => {
        const accepts = req.accepts('application/json')
        res.send(accepts)
      })
      server = app.listen(3001)

      // act
      const res = await request(server).post('/test').set('accept', 'text/html')

      // assert
      expect(res.text).toEqual('false')
    })
  })
})
