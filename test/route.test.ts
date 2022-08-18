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
    // arrange
    router.get('/test', (req: Request, res: Response) => {
      res.writeHead(StatusCodes.OK).end()
    })
    app.use('/', router)
    server = app.listen(3001)

    // act
    const res = await request(server).get('/test')

    // assert
    expect(res.statusCode).toEqual(StatusCodes.OK)
  })

  test('should execute the "post" route handler', async () => {
    // arrange
    router.post('/test', (req: Request, res: Response) => {
      res.writeHead(StatusCodes.CREATED).end()
    })
    app.use('/', router)
    server = app.listen(3001)

    // act
    const res = await request(server).post('/test')

    // assert
    expect(res.statusCode).toEqual(StatusCodes.CREATED)
  })

  test('should execute the "put" route handler', async () => {
    // arrange
    router.put('/test', (req: Request, res: Response) => {
      res.writeHead(StatusCodes.NO_CONTENT).end()
    })
    app.use('/', router)
    server = app.listen(3001)

    // act
    const res = await request(server).put('/test')

    // assert
    expect(res.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  test('should execute the "delete" route handler', async () => {
    // arrange
    router.delete('/test', (req: Request, res: Response) => {
      res.writeHead(StatusCodes.NO_CONTENT).end()
    })
    app.use('/', router)
    server = app.listen(3001)

    // act
    const res = await request(server).delete('/test')

    // assert
    expect(res.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  test('should execute the "patch" route handler', async () => {
    // arrange
    router.patch('/test', (req: Request, res: Response) => {
      res.writeHead(StatusCodes.NO_CONTENT).end()
    })
    app.use('/', router)
    server = app.listen(3001)

    // act
    const res = await request(server).patch('/test')

    // assert
    expect(res.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })
})
