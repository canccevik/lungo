import { ServerResponse } from 'http'

export interface IResponse extends ServerResponse {
  status(statusCode: number): this

  type(type: string): this

  json(body: unknown): void

  send(body: string | object | Buffer | boolean): void

  sendStatus(statusCode: number): void
}
