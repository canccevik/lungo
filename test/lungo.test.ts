/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest'
import { Server } from 'http'
import { Lungo } from '../src/index'
import { IRequest, IResponse } from '../src/interfaces'
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
    test('should execute middlewares', async () => {
      app.use((req: IRequest, res: IResponse) => {
        res.end()
      })

      server = app.listen(3001)
      const res = await request(server).get('/')

      expect(res.statusCode).toEqual(StatusCodes.OK)
    })

    test('should response with internal server error when middleware throws error', async () => {
      app.use((req: IRequest, res: IResponse) => {
        throw new Error()
      })

      server = app.listen(3001)
      const res = await request(server).get('/')

      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })

  describe('handleRoute Method', () => {
    test('should handle the route', async () => {
      app.get('/test', (req: IRequest, res: IResponse) => res.end())

      server = app.listen(3001)
      const res = await request(server).get('/test')

      expect(res.statusCode).toEqual(StatusCodes.OK)
    })

    test('should response with internal server error when route throws error', async () => {
      app.get('/test', (req: IRequest, res: IResponse) => {
        throw new Error()
      })

      server = app.listen(3001)
      const res = await request(server).get('/test')

      expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })
})
