/* eslint-disable @typescript-eslint/no-unused-vars */
import { Lungo, Router } from '../src/index'
import { IRequest, IResponse } from '../src/interfaces'

describe('Router Class', () => {
  let app: Lungo
  let router: Router

  beforeEach(() => {
    app = new Lungo()
    router = new Router()
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

    test('should push the router to the stack', () => {
      const middleware = (req: IRequest, res: IResponse) => []

      router.use(middleware)
      app.use(router)

      expect(app.stack[0]).toEqual(router.stack[0])
    })
  })
})
