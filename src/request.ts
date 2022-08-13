import { IncomingMessage } from 'http'
import { IRequest } from './interfaces'

export class Request extends IncomingMessage implements IRequest {
  public get(field: string): string | undefined {
    return this.headers[field] as string
  }
}
