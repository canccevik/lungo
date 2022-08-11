import { ServerResponse } from 'http'

export interface IResponse extends ServerResponse {
  status(statusCode: number): this

  type(type: string): this
}
