import request from 'supertest'
import { Server } from 'http'
import { Lungo, Request, Response } from '../src/index'

describe('Response Class', () => {
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
      app.get('/test', (req: Request, res: Response) => {
        const packageName = req.get('x-package-name')
        res.end(packageName)
      })

      server = app.listen(3001)
      const res = await request(server).get('/test').set('x-package-name', 'lungo')

      expect(res.text).toEqual('lungo')
    })
  })
})
