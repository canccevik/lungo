import { IMiddleware } from './interfaces'
import { Route } from './route'

export class Router extends Route {
  stack: IMiddleware[] = []

  use(...routers: Router[]): void
  use(...middlewares: IMiddleware[]): void
  use(...handlers: IMiddleware[] | Router[]) {
    handlers.forEach((handler) => {
      if (handler instanceof Router) {
        this.stack.push(...handler.stack)
        this.routes.push(...handler.routes)
        return
      }

      const isAllParamsFunction = (handlers as IMiddleware[]).every((h) => typeof h === 'function')

      if (!isAllParamsFunction) {
        throw new Error('Middleware must be a function.')
      }
      this.stack.push(...(handlers as IMiddleware[]))
    })
  }
}