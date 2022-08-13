import { IMiddleware } from './interfaces'
import { Route } from './route'

export class Router extends Route {
  public stack: IMiddleware[] = []

  public use(...routers: Router[]): void
  public use(...middlewares: IMiddleware[]): void
  public use(...handlers: IMiddleware[] | Router[]): void {
    handlers.forEach((handler) => {
      if (handler instanceof Router) {
        this.stack.push(...handler.stack)
        this.routes.push(...handler.routes)
        return
      }

      if (typeof handler !== 'function') {
        throw new Error('Middleware must be a function.')
      }
      this.stack.push(...(handlers as IMiddleware[]))
    })
  }
}
