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
      server = app.listen(3001)

      expect(server).toBeInstanceOf(Server)
    })
  })

  describe('handle method', () => {
    test('should execute handlers', async () => {
      app.use((req: Request, res: Response) => {
        res.end()
      })

      server = app.listen(3001)
      const res = await request(server).get('/')

      expect(res.statusCode).toEqual(StatusCodes.OK)
    })

    test('should response with internal server error when handler throws error', async () => {
      app.use((req: Request, res: Response) => {
        throw new Error()
      })

      server = app.listen(3001)
      const res = await request(server).get('/')

      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })

  describe('handleRoute method', () => {
    test('should handle the route', async () => {
      app.get('/test', (req: Request, res: Response) => res.end())

      server = app.listen(3001)
      const res = await request(server).get('/test')

      expect(res.statusCode).toEqual(StatusCodes.OK)
    })

    test('should response with internal server error when route throws error', async () => {
      app.get('/test', (req: Request, res: Response) => {
        throw new Error()
      })

      server = app.listen(3001)
      const res = await request(server).get('/test')

      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })
})
