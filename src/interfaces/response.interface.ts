import { ServerResponse } from 'http'
import { CookieSerializeOptions } from 'cookie'

export interface IResponse extends ServerResponse {
  status(statusCode: number): this

  type(type: string): this

  json(body: unknown): void

  send(body: string | object | Buffer | boolean): void

  sendStatus(statusCode: number): void

  get(field: string): string | string[] | number | undefined

  set(object: object): this
  set(field: string, value: string): this

  cookie(name: string, value: string, options?: CookieSerializeOptions): this
}
