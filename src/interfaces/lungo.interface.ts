import { Server } from 'http'
import { IMiddleware, IRequest, IResponse } from './index'

export interface ILungo {
  stack: IMiddleware[]
  use(middleware: IMiddleware): void
  listen(port: string | number): Server
  handle(req: IRequest, res: IResponse, callback: Function): void
}
