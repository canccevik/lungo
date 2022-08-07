import http, { Server } from 'http'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { ILungo, IMiddleware, INextFunc, IRequest, IResponse } from './interfaces'

export class Lungo implements ILungo {
  stack: IMiddleware[] = []

  use(...middlewares: IMiddleware[]): void {
    const isAllParamsFunction = middlewares.every((m) => typeof m === 'function')
    if (!isAllParamsFunction) {
      throw new Error('Middleware must be a function.')
    }

    this.stack.push(...middlewares)
  }

  listen(port: string | number): Server {
    if (!port) {
      throw new Error('Port is not provided.')
    }

    const handler = (req: IRequest, res: IResponse) => {
      this.handle(req, res, (err: Error) => {
        if (!err) return

        res.writeHead(StatusCodes.INTERNAL_SERVER_ERROR)
        res.end(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
      })
    }
    return http.createServer(handler).listen(port)
  }

  handle(req: IRequest, res: IResponse, callback: Function): void {
    let index = 0

    const next: INextFunc = (error?: unknown) => {
      if (error) {
        return callback(error)
      } else if (index >= this.stack.length) {
        return callback()
      }

      const layer = this.stack[index++]

      try {
        layer(req, res, next)
      } catch (err: unknown) {
        next(err)
      }
    }
    next()
  }
}
