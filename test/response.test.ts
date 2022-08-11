import request from 'supertest'
import { Server } from 'http'
import { Lungo } from '../src/index'
import { IRequest, IResponse } from '../src/interfaces'
import { StatusCodes } from 'http-status-codes'

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

      expect(res.statusCode).toEqual(500)
    })
  })
})
