import { Request } from '../request'
import { Response } from '../response'
import { INextFunc } from './index'

export interface IHandler {
  (req: Request | any, res: Response | any, next: INextFunc | any): void
}
