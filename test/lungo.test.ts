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

  describe('Listen Method', () => {
    test('should create and return the server', () => {
      server = app.listen(3001)

      expect(server).toBeInstanceOf(Server)
    })
  })

  describe('Use Method', () => {
    test('should throw error if middleware is not a function', () => {
      const use = () => app.use('test' as never)

      expect(use).toThrow()
    })

    test('should push the middleware to the stack', () => {
      const middleware = (req: IRequest, res: IResponse) => []

      app.use(middleware)

      expect(app.stack[0]).toEqual(middleware)
    })
  })

  describe('Handle Method', () => {
    test('should execute middlewares', async () => {
      app.use((req: IRequest, res: IResponse) => {
        res.end()
      })

      server = app.listen(3001)
      const res = await request(server).get('/')

      expect(StatusCodes.OK).toEqual(res.statusCode)
    })

    test('should response with internal server error when middleware throws error', async () => {
      app.use((req: IRequest, res: IResponse) => {
        throw new Error()
      })

      server = app.listen(3001)
      const res = await request(server).get('/')

      expect(StatusCodes.INTERNAL_SERVER_ERROR).toEqual(res.statusCode)
    })
  })
})
