/* eslint-disable @typescript-eslint/no-unused-vars */
import { Lungo, Request, Response, Router } from '../src/index'
import request from 'supertest'
import { Server } from 'http'
import { StatusCodes } from 'http-status-codes'

describe('Router Class', () => {
  let app: Lungo
  let router: Router
  let server: Server

  beforeEach(() => {
    app = new Lungo()
    router = new Router()
  })

  afterEach(() => {
    server.close()
  })

  describe('use method', () => {
    test('should push the handler to the stack', async () => {
      const handler = (req: Request, res: Response): void => {
        res.status(201).end()
      }
      router.use(handler)

      app.use('/', router)
      server = app.listen(3001)
      const res = await request(server).get('/')

      expect(app.stack[0]).toEqual({ path: '/', method: null, handler })
      expect(res.statusCode).toEqual(StatusCodes.CREATED)
    })

    test('should handle as a get route when path is given', async () => {
      const handler = (req: Request, res: Response): void => {
        res.status(201).end()
      }
      router.use('/test', handler)

      app.use('/', router)
      server = app.listen(3001)
      const res = await request(server).get('/test')

      expect(app.stack[0]).toEqual({ path: '/test', method: 'GET', handler })
      expect(res.statusCode).toEqual(StatusCodes.CREATED)
    })

    test('should serialize all of the routers', async () => {
      const userRouter = new Router()
      const handler = (req: Request, res: Response): void => {
        res.end()
      }
      userRouter.get('/users', handler)
      router.use('/v1', userRouter)

      app.use('/', router)
      server = app.listen(3001)
      const res = await request(server).get('/v1/users')

      expect(app.stack[0]).toEqual({ path: '/v1/users', method: 'GET', handler })
      expect(res.statusCode).toEqual(StatusCodes.OK)
    })
  })
})
