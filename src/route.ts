import { IMiddleware, IRoute } from './interfaces'

export class Route {
  public routes: IRoute[] = []

  public get(path: string, handler: IMiddleware): void {
    this.routes.push({ path, handler, method: 'GET' })
  }

  public post(path: string, handler: IMiddleware): void {
    this.routes.push({ path, handler, method: 'POST' })
  }

  public put(path: string, handler: IMiddleware): void {
    this.routes.push({ path, handler, method: 'PUT' })
  }

  public delete(path: string, handler: IMiddleware): void {
    this.routes.push({ path, handler, method: 'DELETE' })
  }

  public patch(path: string, handler: IMiddleware): void {
    this.routes.push({ path, handler, method: 'PATCH' })
  }
}
