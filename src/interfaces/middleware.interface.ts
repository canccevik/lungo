import { IRequest, IResponse, INextFunc } from './index'

export interface IMiddleware {
  (req: IRequest, res: IResponse, next: INextFunc): void
}
