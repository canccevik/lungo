import { IMiddleware, IRequest, IResponse } from './index'

export interface ILungo {
  stack: IMiddleware[]
  use(middleware: IMiddleware): void
  listen(port: string | number): void
  handle(req: IRequest, res: IResponse, callback: Function): void
}
