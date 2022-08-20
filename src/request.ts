import { IncomingMessage } from 'http'
import { Socket } from 'net'

export class Request extends IncomingMessage {
  public ip?: string
  public params: { [key: string]: unknown } = {}

  constructor(socket: Socket) {
    super(socket)

    this.ip = this.getIpAddress()
  }

  public get(field: string): string | undefined {
    return this.headers[field] as string
  }

  private getIpAddress(): string | undefined {
    const forwardedAddress = this.get('x-forwarded-for')?.toString().split(',').shift()
    const remoteAddress = this.socket.remoteAddress?.toString().replace('::ffff:', '')
    return forwardedAddress ?? remoteAddress
  }
}
