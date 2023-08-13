import { IncomingMessage } from 'http'
import mimeTypes from 'mime-types'
import qs from 'qs'
import accepts from 'accepts'
import url from 'url'

export class Request extends IncomingMessage {
  public body: any = null
  public ip?: string
  public originalUrl!: string
  public baseUrl!: string
  public path!: string
  public cookies?: Record<string, string>
  public params: Record<string, unknown> = {}
  public query: Record<string, unknown> = {}
  public files?: Record<string, Record<string, unknown>>

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

  private getQuery(): Record<string, unknown> {
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
    const pathName = this.url && url.parse(this.url).pathname
    return pathName ?? ''
  }

  public accepts(...types: string[]): string | string[] | boolean {
    return accepts(this).type(types)
  }

  public is(type: string): string | boolean | null {
    const contentType = this.get('content-type')
    const mimeType = mimeTypes.contentType(type).toString().split(';')[0]

    if (!contentType) return false

    return mimeType === contentType ? mimeType : false
  }
}
