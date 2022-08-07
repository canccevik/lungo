import http from 'http'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { ILungo, IMiddleware, INextFunc, IRequest, IResponse } from './interfaces'

export class Lungo implements ILungo {
  stack: IMiddleware[] = []

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

  listen(port: string | number): void {
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
    http.createServer(handler).listen(port)
  }
}
