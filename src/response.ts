import { ServerResponse } from 'http'
import { IResponse } from './interfaces'

export class Response extends ServerResponse implements IResponse {
  status(statusCode: number): this {
    return this.writeHead(statusCode)
  }
}
