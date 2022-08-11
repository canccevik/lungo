import http, { Server } from 'http'
import { StatusCodes } from 'http-status-codes'
import { INextFunc, IRequest, IResponse } from './interfaces'
import { Router } from './router'

export class Lungo extends Router {
  listen(port: string | number): Server {
    if (!port) {
      throw new Error('Port is not provided.')
    }

    const handler = (req: IRequest, res: IResponse) => {
      this.handle(req, res, (err: Error) => {
        if (!err) return

        res.writeHead(StatusCodes.INTERNAL_SERVER_ERROR)
        res.end(err.stack)

        if (process.env.NODE_ENV === 'TEST') return
        console.error(err.stack)
      })
    }
    return http.createServer(handler).listen(port)
  }

  handle(req: IRequest, res: IResponse, callback: Function) {
    let index = 0

    const next: INextFunc = (error?: unknown) => {
      if (error) {
        return callback(error)
      }
      if (index >= this.stack.length) {
        return this.handleRoute(req, res, next, callback)
      }

      const middleware = this.stack[index++]

      try {
        middleware(req, res, next)
      } catch (err: unknown) {
        next(err)
      }
    }
    next()
  }

  private handleRoute(req: IRequest, res: IResponse, next: INextFunc, callback: Function) {
    const route = this.routes.find((route) => route.method === req.method && route.path === req.url)

    if (!route) {
      res.writeHead(StatusCodes.NOT_FOUND)
      res.end(`Cannot ${req.method} ${req.url}`)
      return
    }

    try {
      route.handler(req, res, next)
    } catch (err) {
      callback(err)
    }
  }
}
