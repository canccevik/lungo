import { IHandler } from './interfaces'
import { Route } from './route'

export class Router extends Route {
  public stack: IHandler[] = []

  public use(...routers: Router[]): void
  public use(...handlers: IHandler[]): void
  public use(...handlers: IHandler[] | Router[]): void {
    handlers.forEach((handler) => {
      if (handler instanceof Router) {
        this.stack.push(...handler.stack)
        this.routes.push(...handler.routes)
        return
      }

      if (typeof handler !== 'function') {
        throw new Error('Handler must be a function.')
      }
      this.stack.push(...(handlers as IHandler[]))
    })
  }
}
