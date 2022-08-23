import { IHandler } from './interfaces'
import { Route } from './route'

export class Router extends Route {
  public use(handler: IHandler): void
  public use(path: string, router: Router): void
  public use(pathOrHandler: string | IHandler, router?: Router): void {
    if (typeof pathOrHandler === 'function') {
      this.stack.push({ path: '/', method: null, handler: pathOrHandler })
      return
    }

    if (!router) return

    const modifiedRoutes = router.stack.map((route) => {
      const path = `${pathOrHandler}/${route.path}`.replace(/\/+/g, '/')
      route.path = path === '/' ? path : path.replace(/\/+$/, '')
      return route
    })
    this.stack.push(...modifiedRoutes)
  }
}
