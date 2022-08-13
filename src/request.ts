import { IncomingMessage } from 'http'

export class Request extends IncomingMessage {
  public get(field: string): string | undefined {
    return this.headers[field] as string
  }
}
