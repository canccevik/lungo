import { IHandler, IRoute } from './interfaces'

export class Route {
  public stack: IRoute[] = []

  private addRouteToStack(
    path: string,
    handlerOrMiddlewares: IHandler | IHandler[],
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    handler?: IHandler
  ): void {
    if (Array.isArray(handlerOrMiddlewares) && handler) {
      handlerOrMiddlewares.forEach((handler) => {
        this.stack.push({ path, handler, method: null })
      })
      this.stack.push({ path, method, handler })
    }
    this.stack.push({ path, method, handler: handlerOrMiddlewares as IHandler })
  }

  public get(path: string, handler: IHandler): void
  public get(path: string, middlewares: IHandler[], handler: IHandler): void
  public get(path: string, handlerOrMiddlewares: IHandler | IHandler[], handler?: IHandler): void {
    this.addRouteToStack(path, handlerOrMiddlewares, 'GET', handler)
  }

  public post(path: string, handler: IHandler): void
  public post(path: string, middlewares: IHandler[], handler: IHandler): void
  public post(path: string, handlerOrMiddlewares: IHandler | IHandler[], handler?: IHandler): void {
    this.addRouteToStack(path, handlerOrMiddlewares, 'POST', handler)
  }

  public put(path: string, handler: IHandler): void
  public put(path: string, middlewares: IHandler[], handler: IHandler): void
  public put(path: string, handlerOrMiddlewares: IHandler | IHandler[], handler?: IHandler): void {
    this.addRouteToStack(path, handlerOrMiddlewares, 'PUT', handler)
  }

  public delete(path: string, handler: IHandler): void
  public delete(path: string, middlewares: IHandler[], handler: IHandler): void
  public delete(
    path: string,
    handlerOrMiddlewares: IHandler | IHandler[],
    handler?: IHandler
  ): void {
    this.addRouteToStack(path, handlerOrMiddlewares, 'DELETE', handler)
  }

  public patch(path: string, handler: IHandler): void
  public patch(path: string, middlewares: IHandler[], handler: IHandler): void
  public patch(
    path: string,
    handlerOrMiddlewares: IHandler | IHandler[],
    handler?: IHandler
  ): void {
    this.addRouteToStack(path, handlerOrMiddlewares, 'PATCH', handler)
  }
}
