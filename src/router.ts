import { IMiddleware } from './interfaces'

export class Router {
  stack: IMiddleware[] = []

  use(...routers: Router[]): void
  use(...middlewares: IMiddleware[]): void
  use(...handlers: IMiddleware[] | Router[]): void {
    handlers.forEach((handler) => {
      if (handler instanceof Router) {
        this.stack.push(...handler.stack)
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
