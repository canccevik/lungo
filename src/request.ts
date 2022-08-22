import { IncomingMessage } from 'http'
import mimeTypes from 'mime-types'
import qs from 'qs'

export class Request extends IncomingMessage {
  public cookies?: object
  public ip?: string
  public originalUrl = ''
  public baseUrl = ''
  public path = ''
  public params: { [key: string]: unknown } = {}
  public query: { [key: string]: unknown } = {}
  public body: any

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

  public accepts(...types: string[]): string | boolean {
    const acceptHeader = this.get('accept')

    if (!acceptHeader) return false

    const acceptedTypes = acceptHeader.includes(',')
      ? acceptHeader.replace(/\s/g, '').split(',')
      : [acceptHeader]

    if (acceptedTypes.includes('*/*')) return types[0]

    const type = types.find((type) => {
      const mimeType = mimeTypes.contentType(type).toString().split(';')[0]

      if (!mimeType) return

      return acceptedTypes.includes(mimeType) ? mimeType : null
    })
    return type ?? false
  }
}
