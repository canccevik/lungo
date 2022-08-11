import { ServerResponse } from 'http'

export interface IResponse extends ServerResponse {
  status(statusCode: number): this
}
