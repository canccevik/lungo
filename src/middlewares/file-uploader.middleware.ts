import { Files, Options } from 'formidable'
import { IHandler, INextFunc } from '../interfaces'
import { Request } from '../request'
import { Response } from '../response'
import formidable from 'formidable'

const defaultOptions: Options = {
  keepExtensions: true,
  uploadDir: process.cwd()
}

export function fileUploader(options: Options = defaultOptions): IHandler {
  return function (req: Request, res: Response, next: INextFunc): void {
    const form = formidable(options)

    form.parse(req, (error, fields, files) => {
      if (error) {
        return next(error)
      }
      req.body = fields
      req.files = serializeFiles(files)
      next()
    })
  }
}

function serializeFiles(files: Files): Record<string, Record<string, unknown>> {
  const serializedFiles: Record<string, Record<string, unknown>> = {}

  Object.keys(files).forEach((fieldName) => {
    const fileObject: Record<string, unknown> = {}

    Object.keys(files[fieldName]).forEach((key) => {
      if (key.startsWith('_')) return
      fileObject[key] = (files[fieldName] as any)[key]
    })
    serializedFiles[fieldName] = fileObject
  })
  return serializedFiles
}
