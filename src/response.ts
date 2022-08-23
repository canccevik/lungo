import { ServerResponse } from 'http'
import mimeTypes from 'mime-types'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import cookie, { CookieSerializeOptions } from 'cookie'
import path from 'path'
import pug from 'pug'
import fs from 'fs'

export class Response extends ServerResponse {
  public status(statusCode: number): this {
    this.statusCode = statusCode
    return this
  }

  public type(type: string): this {
    const mimeType = mimeTypes.contentType(type)

    if (!mimeType) {
      throw new Error('Mime type is not valid.')
    }
    return this.setHeader('Content-Type', mimeType)
  }

  public json(body: unknown): void {
    this.type('application/json')
    this.end(JSON.stringify(body))
  }

  public send(body: unknown): void {
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
    this.type('text/plain').status(statusCode).end(reasonPhrase)
  }

  public get(field: string): string | string[] | number | undefined {
    return this.getHeader(field)
  }

  public set(object: object): this
  public set(field: string, value: string | number): this
  public set(fieldOrObject: string | object, value?: string | number): this {
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

  public redirect(url: string): void {
    this.status(StatusCodes.MOVED_PERMANENTLY).set('Location', url).end()
  }

  public sendFile(filePath: string): void {
    const fileExtension = path.extname(filePath)
    const fileBasename = path.basename(filePath)
    const isFileExits = fs.existsSync(filePath)

    if (!isFileExits) {
      const message = `File ${fileBasename} cannot found!`
      this.status(StatusCodes.NOT_FOUND).send(message)
      return
    }

    const fileStats = fs.statSync(filePath)
    const contentType = mimeTypes.lookup(fileExtension)

    if (!contentType) {
      const message = `File extension is not valid for ${fileBasename}`
      this.status(StatusCodes.BAD_REQUEST).send(message)
      return
    }

    this.set({
      'Content-Type': contentType,
      'Content-Length': fileStats.size
    })

    const stream = fs.createReadStream(filePath)
    stream.pipe(this)
  }

  public download(filePath: string): void {
    const fileBasename = path.basename(filePath)
    this.set('Content-Disposition', `attachment; filename=${fileBasename}`)
    this.sendFile(filePath)
  }

  public render(filePath: string, locals: object = {}): void {
    const fileExtension = path.extname(filePath)
    const fileBasename = path.basename(filePath)
    const isFileExits = fs.existsSync(filePath)

    if (!isFileExits) {
      const message = `File ${fileBasename} cannot found!`
      this.status(StatusCodes.NOT_FOUND).send(message)
      return
    }

    if (fileExtension !== '.pug') {
      const message = `Extension ${fileExtension} is not suitable for rendering!`
      this.status(StatusCodes.BAD_REQUEST).send(message)
      return
    }

    const html = pug.compileFile(filePath)(locals)
    this.type('text/html').send(html)
  }
}
