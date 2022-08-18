/* eslint-disable @typescript-eslint/no-unused-vars */
import { Lungo, Request, Response, Router } from '../src/index'

describe('Router Class', () => {
  let app: Lungo
  let router: Router

  beforeEach(() => {
    app = new Lungo()
    router = new Router()
  })

  describe('use method', () => {
    test('should throw error if handler is not a function', () => {
      const use = (): void => app.use('test' as never)

      expect(use).toThrow()
    })

    test('should push the handler to the stack', () => {
      const handler = (req: Request, res: Response): [] => []

      app.use(handler)

      expect(app.stack[0]).toEqual(handler)
    })

    test('should push the router stack to the stack', () => {
      const handler = (req: Request, res: Response): [] => []

      router.use(handler)
      app.use(router)

      expect(router.stack[0]).toEqual(app.stack[0])
    })

    test('should push the route to the routes', () => {
      const path = '/test'
      const handler = (req: Request, res: Response): [] => []

      router.get(path, handler)
      app.use(router)

      expect(router.routes[0]).toEqual({ handler, path, method: 'GET' })
    })
  })
})
