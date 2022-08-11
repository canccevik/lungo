import { ServerResponse } from 'http'
import { IResponse } from './interfaces'
import mimeTypes from 'mime-types'

export class Response extends ServerResponse implements IResponse {
  status(statusCode: number): this {
    return this.writeHead(statusCode)
  }

  type(type: string): this {
    const mimeType =
      mimeTypes.lookup(type) === false ? mimeTypes.contentType(type) : mimeTypes.lookup(type)

    if (!mimeType) {
      throw new Error('Mime type is not valid.')
    }
    return this.setHeader('Content-Type', mimeType)
  }
}
