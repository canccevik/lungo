/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest'
import { Server } from 'http'
import { Lungo, Request, Response, Router } from '../src/index'
import { StatusCodes } from 'http-status-codes'

describe('Lungo Class', () => {
  let app: Lungo
  let server: Server

  beforeEach(() => {
    app = new Lungo()
  })

  afterEach(() => {
    server.close()
  })

  describe('listen method', () => {
    test('should create and return the server', () => {
      // act
      server = app.listen(3001)

      // assert
      expect(server).toBeInstanceOf(Server)
    })
  })

  describe('handleRequest method', () => {
    test('should execute handlers', async () => {
      // arrange
      app.use((req: Request, res: Response) => {
        res.end()
      })
      server = app.listen(3001)

      // act
      const res = await request(server).get('/')

      // assert
      expect(res.statusCode).toEqual(StatusCodes.OK)
    })

    test('should execute handlers for routes', async () => {
      // arrange
      const packageRouter = new Router()

      packageRouter.use((req, res, next) => {
        req.params.version = 1
        next()
      })

      packageRouter.get('/:packageName', (req, res) => {
        res.send({
          version: req.params.version,
          packageName: req.params.packageName
        })
      })

      app.use('/packages', packageRouter)
      server = app.listen(3001)

      // act
      const res = await request(server).get('/packages/lungo')

      // assert
      expect(res.body.version).toEqual(1)
      expect(res.body.packageName).toEqual('lungo')
    })
  })

  describe('handleRoute method', () => {
    test('should handle the route', async () => {
      // arrange
      app.get('/test', (req: Request, res: Response) => res.end())
      server = app.listen(3001)

      // act
      const res = await request(server).get('/test')

      // assert
      expect(res.statusCode).toEqual(StatusCodes.OK)
    })
  })

  describe('onError method', () => {
    test('should handle the error', async () => {
      // arrange
      app.get('/test', (req: Request, res: Response) => {
        throw new Error()
      })

      const errorResponse = 'error handled'

      app.onError((req: Request, res: Response, error: unknown) => {
        res.send(errorResponse)
      })

      server = app.listen(3001)

      // act
      const res = await request(server).get('/test')

      // assert
      expect(res.statusCode).toEqual(StatusCodes.OK)
      expect(res.text).toEqual(errorResponse)
    })

    test('should throw internal server error when error handler not used', async () => {
      // arrange
      app.get('/test', (req: Request, res: Response) => {
        throw new Error()
      })

      server = app.listen(3001)

      // act
      const res = await request(server).get('/test')

      // assert
      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })
})
