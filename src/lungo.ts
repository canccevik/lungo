import http, { IncomingMessage, Server, ServerResponse } from 'http'
import { StatusCodes } from 'http-status-codes'
import { EventEmitter } from 'stream'
import { INextFunc } from './interfaces'
import { Request } from './request'
import { Response } from './response'
import { Router } from './router'
import { parseBody } from './utils'

export class Lungo extends Router {
  private eventEmitter = new EventEmitter()

  public listen(port: string | number): Server {
    if (!port) {
      throw new Error('Port is not provided.')
    }

    const handler = (req: IncomingMessage, res: ServerResponse): void => {
      const request = req as Request
      const response = res as Response

      parseBody(request)
        .then((request) => this.handleRequest(request, response))
        .catch((error) => this.handleError(request, response, error))
    }

    return http
      .createServer({ IncomingMessage: Request, ServerResponse: Response }, handler)
      .listen(port)
  }

  public handleRequest(req: Request, res: Response): void {
    if (!req.url) return

    req.onMounted()

    const url = req.url.includes('?') ? req.url.split('?')[0] : req.url

    const routePaths = url.split('/').map((route) => route.replace(/^/, '/'))
    const fullRoutes = routePaths.map((routeName, i) =>
      i < 2 ? routeName : routePaths[i - 1] + routeName
    )

    const middlewareRoutes = this.stack.filter(
      (route) => !route.method && fullRoutes.includes(route.path)
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
    if (!req.url) return

    const url = req.url.includes('?') ? req.url.split('?')[0] : req.url

    const route = this.stack.find((route) => {
      if (route.method !== req.method) return

      const routeParams = route.path.split('/').filter((x) => x !== '')
      const urlParams = url.split('/').filter((x) => x !== '')

      if (routeParams.length !== urlParams?.length) return

      const routeParamIndexes = routeParams
        .filter((param) => param.startsWith(':'))
        .map((param) => routeParams.indexOf(param))

      if (!routeParamIndexes.length && route.path === url) return route

      const urlReplacedWithRouteParams = urlParams
        .map((param, i) => (routeParamIndexes.includes(i) ? routeParams.at(i) : param))
        .join('/')
        .replace(/^/, '/')

      if (route.path !== urlReplacedWithRouteParams) return

      routeParamIndexes.forEach((i) => {
        req.params[routeParams[i].replace(/^./, '')] = urlParams[i]
      })
      return route
    })

    if (!route) {
      res.writeHead(StatusCodes.NOT_FOUND)
      res.end(`Cannot ${req.method} ${url}`)
      return
    }

    try {
      route.handler(req, res, next)
    } catch (err) {
      next(err)
    }
  }

  private handleError(req: Request, res: Response, error?: unknown): void {
    if (!error) return

    if (this.eventEmitter.eventNames().includes('error')) {
      this.eventEmitter.emit('error', req, res, error)
      return
    }

    res.writeHead(StatusCodes.INTERNAL_SERVER_ERROR)

    if (!(error instanceof Error)) {
      res.end()
      return
    }

    res.end(error.stack)

    if (process.env.NODE_ENV === 'TEST') return
    console.error(error.stack)
  }

  public on(eventName: string, callback: (...args: any[]) => void): void {
    this.eventEmitter.on(eventName, callback)
  }
}
