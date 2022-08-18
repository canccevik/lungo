import request from 'supertest'
import { Server } from 'http'
import { Lungo, Request, Response, Router } from '../src/index'
import { StatusCodes } from 'http-status-codes'

describe('Route Class', () => {
  let app: Lungo
  let server: Server
  let router: Router

  beforeEach(() => {
    app = new Lungo()
    router = new Router()
  })

  afterEach(() => {
    server.close()
  })

  test('should execute the "get" route handler', async () => {
    router.get('/test', (req: Request, res: Response) => {
      res.writeHead(StatusCodes.OK)
      res.end()
    })

    app.use('/', router)
    server = app.listen(3001)
    const res = await request(server).get('/test')

    expect(res.statusCode).toEqual(StatusCodes.OK)
  })

  test('should execute the "post" route handler', async () => {
    router.post('/test', (req: Request, res: Response) => {
      res.writeHead(StatusCodes.CREATED)
      res.end()
    })

    app.use('/', router)
    server = app.listen(3001)
    const res = await request(server).post('/test')

    expect(res.statusCode).toEqual(StatusCodes.CREATED)
  })

  test('should execute the "put" route handler', async () => {
    router.put('/test', (req: Request, res: Response) => {
      res.writeHead(StatusCodes.NO_CONTENT)
      res.end()
    })

    app.use('/', router)
    server = app.listen(3001)
    const res = await request(server).put('/test')

    expect(res.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  test('should execute the "delete" route handler', async () => {
    router.delete('/test', (req: Request, res: Response) => {
      res.writeHead(StatusCodes.NO_CONTENT)
      res.end()
    })

    app.use('/', router)
    server = app.listen(3001)
    const res = await request(server).delete('/test')

    expect(res.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  test('should execute the "patch" route handler', async () => {
    router.patch('/test', (req: Request, res: Response) => {
      res.writeHead(StatusCodes.NO_CONTENT)
      res.end()
    })

    app.use('/', router)
    server = app.listen(3001)
    const res = await request(server).patch('/test')

    expect(res.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })
})
