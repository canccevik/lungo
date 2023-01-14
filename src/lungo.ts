import http, { IncomingMessage, Server, ServerResponse } from 'http'
import { StatusCodes } from 'http-status-codes'
import { EventEmitter } from 'stream'
import { INextFunc } from './interfaces'
import { Request } from './request'
import { Response } from './response'
import { Router } from './router'
import { parseBody } from './utils'
import { PortIsNotProvidedException } from './exceptions/not-provided-port-exception'

export class Lungo extends Router {
  private eventEmitter = new EventEmitter()

  public listen(port: string | number): Server {
    if (!port) {
      throw new PortIsNotProvidedException()
    }

    const handler = (req: IncomingMessage, res: ServerResponse): void => {
      const request = req as Request
      const response = res as Response

      const initRequest = (parsedRequest?: Request): void => {
        request.onMounted()
        this.handleRequest(parsedRequest || request, response)
      }

      const contentType = request.get('content-type')?.split(';')[0]

      if (contentType === 'multipart/form-data') {
        initRequest()
        return
      }

      parseBody(request)
        .then((parsedRequest) => initRequest(parsedRequest))
        .catch((error) => this.handleError(request, response, error))
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
    if (!req.url) return

    const url = req.url.includes('?') ? req.url.split('?')[0] : req.url

    const route = this.stack.find((route) => {
      if (route.method !== req.method) return

      const urlParams = url.split('/').slice(1)
      const routeParams = route.path.split('/').slice(1)
      const dynamicRouteParams = routeParams.filter((param) => param.startsWith(':'))

      if (!dynamicRouteParams && route.path === url) return route

      const routePathConvertedToUrl = routeParams
        .map((param, i) => (param.startsWith(':') ? urlParams.at(i) : param))
        .join('/')
        .replace(/^/, '/')

      if (routePathConvertedToUrl !== url) return

      dynamicRouteParams.forEach((param) => {
        const paramName = param.slice(1)
        req.params[paramName] = urlParams.at(routeParams.indexOf(param))
      })
      return route
    })

    if (!route) {
      res.status(StatusCodes.NOT_FOUND)
      res.end(`Cannot ${req.method} ${url}`)
      return
    }

    try {
      route.handler(req, res, next)
    } catch (err) {
      next(err)
    }
  }

  private handleError(req: Request, res: Response, error: unknown): void {
    if (this.eventEmitter.eventNames().includes('error')) {
      this.eventEmitter.emit('error', req, res, error)
      return
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR)

    if (!(error instanceof Error)) {
      res.end()
      return
    }

    res.end(error.stack)

    if (process.env.NODE_ENV !== 'TEST') {
      console.error(error.stack)
    }
  }

  public on(eventName: string, callback: (...args: any[]) => void): void {
    this.eventEmitter.on(eventName, callback)
  }
}
