import { Request } from '../request'
import { Response } from '../response'
import { INextFunc } from './index'

export interface IMiddleware {
  (req: Request, res: Response, next: INextFunc): void
}
