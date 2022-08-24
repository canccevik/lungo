import { Request } from '../request'
import { Response } from '../response'
import { INextFunc } from './index'

export interface IHandler {
  (req: Request, res: Response, next: INextFunc): void
}
