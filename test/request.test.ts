import request from 'supertest'
import { Server } from 'http'
import { Lungo } from '../src/index'
import { IRequest, IResponse } from '../src/interfaces'

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
      app.get('/test', (req: IRequest, res: IResponse) => {
        const packageName = req.get('x-package-name')
        res.end(packageName)
      })

      server = app.listen(3001)
      const res = await request(server).get('/test').set('x-package-name', 'lungo')

      expect(res.text).toEqual('lungo')
    })
  })
})
