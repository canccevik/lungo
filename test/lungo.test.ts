/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest'
import { Server } from 'http'
import { Lungo, Request, Response } from '../src/index'
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

  describe('handle method', () => {
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

  describe('error event', () => {
    test('should handle the error', async () => {
      // arrange
      app.get('/test', (req: Request, res: Response) => {
        throw new Error()
      })

      const errorResponse = 'error handled'

      app.on('error', (req: Request, res: Response, err: Error) => {
        res.send(errorResponse)
      })

      server = app.listen(3001)

      // act
      const res = await request(server).get('/test')

      // assert
      expect(res.statusCode).toEqual(StatusCodes.OK)
      expect(res.text).toEqual(errorResponse)
    })

    test('should throw internal server error when error event not used', async () => {
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
