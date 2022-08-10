import http, { Server } from 'http'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
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
