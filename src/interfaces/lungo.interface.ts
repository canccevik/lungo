import { IMiddleware, IRequest, IResponse } from './index'

export interface ILungo {
  stack: IMiddleware[]
  handle(req: IRequest, res: IResponse, callback: Function): void
  listen(port: string | number): void
}
