import { IMiddleware, IRoute } from './interfaces'

export class Route {
  routes: IRoute[] = []

  get(path: string, handler: IMiddleware) {
    this.routes.push({ path, handler, method: 'GET' })
  }

  post(path: string, handler: IMiddleware) {
    this.routes.push({ path, handler, method: 'POST' })
  }

  put(path: string, handler: IMiddleware) {
    this.routes.push({ path, handler, method: 'PUT' })
  }

  delete(path: string, handler: IMiddleware) {
    this.routes.push({ path, handler, method: 'DELETE' })
  }

  patch(path: string, handler: IMiddleware) {
    this.routes.push({ path, handler, method: 'PATCH' })
  }
}
