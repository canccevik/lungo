import { IncomingMessage } from 'http'
import qs from 'qs'

export class Request extends IncomingMessage {
  public ip?: string
  public originalUrl = ''
  public baseUrl = ''
  public path = ''
  public params: { [key: string]: unknown } = {}
  public query: { [key: string]: unknown } = {}

  public onMounted(): void {
    this.ip = this.getIpAddress()
    this.query = this.getQuery()
    this.originalUrl = this.getOriginalUrl()
    this.baseUrl = this.getBaseUrl()
    this.path = this.getPath()
  }

  public get(field: string): string | undefined {
    return this.headers[field] as string
  }

  private getIpAddress(): string | undefined {
    const forwardedAddress = this.get('x-forwarded-for')?.toString().split(',').shift()
    const remoteAddress = this.socket.remoteAddress?.toString().replace('::ffff:', '')
    return forwardedAddress ?? remoteAddress
  }

  private getQuery(): { [key: string]: unknown } {
    if (!this.url) return {}

    const queryString = this.url.split('?')[1]
    const queries = qs.parse(queryString)

    return queries
  }

  private getOriginalUrl(): string {
    return this.url ?? ''
  }

  private getBaseUrl(): string {
    if (!this.url) return ''

    if (this.url.includes('?')) {
      return '/' + this.url.split('?')[0].split('/')[1]
    }
    return '/' + this.url.split('/')[1]
  }

  private getPath(): string {
    if (!this.url) return ''

    let routes = this.url.split('/')

    if (this.url.includes('?')) {
      routes = this.url.split('?')[0].split('/')
    }
    return '/' + routes[routes.length - 1]
  }
}
