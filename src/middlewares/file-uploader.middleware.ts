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
      req.body = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value[0]]))
      req.files = serializeFiles(files)
      next()
    })
  }
}

function serializeFiles(files: Files): Record<string, Record<string, unknown>> {
  return Object.assign(
    {},
    ...Object.keys(files).map((fileName) => {
      return {
        [fileName]: Object.fromEntries(
          Object.entries(files[fileName][0]).filter(([key]) => !key.startsWith('_'))
        )
      }
    })
  )
}
