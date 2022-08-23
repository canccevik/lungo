import { IHandler } from './interfaces'
import { Route } from './route'

export class Router extends Route {
  public use(handler: IHandler): void
  public use(path: string, handler: IHandler): void
  public use(path: string, router: Router): void
  public use(pathOrHandler: string | IHandler, routerOrHandler?: Router | IHandler): void {
    if (typeof pathOrHandler === 'function') {
      this.stack.push({ path: '/', method: null, handler: pathOrHandler })
      return
    }
    if (typeof routerOrHandler === 'function') {
      this.stack.push({ path: pathOrHandler, method: 'GET', handler: routerOrHandler })
      return
    }

    const router = routerOrHandler as Route

    const modifiedRoutes = router.stack.map((route) => {
      const path = `${pathOrHandler}/${route.path}`.replace(/\/+/g, '/')
      route.path = path === '/' ? path : path.replace(/\/+$/, '')
      return route
    })
    this.stack.push(...modifiedRoutes)
  }
}
