import { ServerResponse } from 'http'
import { IResponse } from './interfaces'
import mimeTypes from 'mime-types'
import { getReasonPhrase } from 'http-status-codes'
import cookie, { CookieSerializeOptions } from 'cookie'

export class Response extends ServerResponse implements IResponse {
  public status(statusCode: number): this {
    return this.writeHead(statusCode)
  }

  public type(type: string): this {
    const mimeType =
      mimeTypes.lookup(type) === false ? mimeTypes.contentType(type) : mimeTypes.lookup(type)

    if (!mimeType) {
      throw new Error('Mime type is not valid.')
    }
    return this.setHeader('Content-Type', mimeType)
  }

  public json(body: unknown): void {
    this.type('application/json')
    this.end(JSON.stringify(body))
  }

  public send(body: string | object | Buffer | boolean): void {
    if (typeof body === 'string') {
      this.type('text/html')
    } else if (typeof body === 'object' || typeof body === 'boolean') {
      this.type('application/json')
    } else if ((body as Buffer) instanceof Buffer) {
      this.type('application/octet-stream')
    } else {
      throw new Error('Type of body is not valid.')
    }

    const response = typeof body === 'string' ? body : JSON.stringify(body)
    this.end(response)
  }

  public sendStatus(statusCode: number): void {
    const reasonPhrase = getReasonPhrase(statusCode)

    this.type('text/plain')
    this.status(statusCode)
    this.end(reasonPhrase)
  }

  public get(field: string): string | string[] | number | undefined {
    return this.getHeader(field)
  }

  public set(object: object): this
  public set(field: string, value: string): this
  public set(fieldOrObject: string | object, value?: string): this {
    if (typeof fieldOrObject === 'string' && value) {
      this.setHeader(fieldOrObject, value)
      return this
    }

    Object.keys(fieldOrObject).forEach((key) => {
      this.setHeader(key, fieldOrObject[key as keyof typeof fieldOrObject])
    })
    return this
  }

  public cookie(name: string, value: string, options?: CookieSerializeOptions): this {
    this.set('set-cookie', cookie.serialize(name, value, options))
    return this
  }
}
