import http, { IncomingMessage, Server, ServerResponse } from 'http'
import { StatusCodes } from 'http-status-codes'
import { ErrorHandler, INextFunc } from './interfaces'
import { Request } from './request'
import { Response } from './response'
import { Router } from './router'
import { match } from 'path-to-regexp'
import url from 'url'

export class Lungo extends Router {
  private errorHandler?: ErrorHandler

  public listen(port: string | number): Server {
    if (!port) {
      throw new Error('Port is not provided!')
    }

    const handler = (req: IncomingMessage, res: ServerResponse): void => {
      const request = req as Request
      const response = res as Response

      request.onMounted()
      this.handleRequest(request, response)
    }

    return http
      .createServer({ IncomingMessage: Request, ServerResponse: Response }, handler)
      .listen(port)
  }

  private handleRequest(req: Request, res: Response): void {
    if (!req.url) return

    const url = req.url.includes('?') ? req.url.split('?')[0] : req.url
    const routePaths = url.split('/').map((path) => path.replace(/^/, '/'))
    const fullRoutePaths = routePaths.map((routeName, i) =>
      i < 2 ? routeName : routePaths[i - 1] + routeName
    )

    const middlewareRoutes = this.stack.filter(
      (route) => !route.method && fullRoutePaths.includes(route.path)
    )

    let index = 0

    const next: INextFunc = (error?: unknown) => {
      if (error) {
        return this.handleError(req, res, error)
      }
      if (index >= middlewareRoutes.length) {
        return this.handleRoute(req, res, next)
      }

      const handler = middlewareRoutes[index++].handler

      try {
        handler(req, res, next)
      } catch (err) {
        next(err)
      }
    }
    next()
  }

  private handleRoute(req: Request, res: Response, next: INextFunc): void {
    const pathName = req.url && url.parse(req.url).pathname

    const route =
      pathName &&
      this.stack
        .filter((route) => route.method === req.method)
        .find((route) => {
          const matcher = match(route.path)
          const matchedRoute = matcher(pathName)

          if (!matchedRoute) return

          req.params = Object.assign(req.params, matchedRoute.params)
          return route
        })

    if (!route) {
      res.status(StatusCodes.NOT_FOUND)
      res.end(`Cannot ${req.method} ${pathName}`)
      return
    }

    try {
      route.handler(req, res, next)
    } catch (err) {
      next(err)
    }
  }

  private handleError(req: Request, res: Response, error: unknown): void {
    if (this.errorHandler) {
      return this.errorHandler(req, res, error)
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR)

    if (!(error instanceof Error)) {
      res.end()
      return
    }

    if (process.env.NODE_ENV !== 'test') {
      console.error(error.stack)
    }
    res.end(error.stack)
  }

  public onError(handler: ErrorHandler): void {
    this.errorHandler = handler
  }
}
