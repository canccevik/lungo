import { IMiddleware } from './interfaces'

export class Router {
  stack: IMiddleware[] = []

  use(...middlewares: IMiddleware[]): void {
    const isAllParamsFunction = middlewares.every((m) => typeof m === 'function')
    if (!isAllParamsFunction) {
      throw new Error('Middleware must be a function.')
    }

    this.stack.push(...middlewares)
  }
}
