import { IHandler } from './handler.interface'

export interface IRoute {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  handler: IHandler
}
