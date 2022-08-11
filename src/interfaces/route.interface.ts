import { IMiddleware } from './middleware.interface'

export interface IRoute {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  handler: IMiddleware
}
