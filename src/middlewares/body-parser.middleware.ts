import { IHandler, INextFunc } from '../interfaces'
import { Request } from '../request'
import { Response } from '../response'

export function bodyParser(): IHandler {
  return (req: Request, res: Response, next: INextFunc) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      if (body.length === 0) return next()

      const contentType = req.get('content-type')

      if (contentType === 'application/json') {
        req.body = parseBodyFromJson(body)
      } else if (contentType === 'application/x-www-form-urlencoded') {
        req.body = parseBodyFromForm(body)
      } else {
        req.body = body
      }
      next()
    })

    req.on('error', (error) => {
      next(error)
    })
  }
}

function parseBodyFromJson(body: string): Record<string, object> {
  return JSON.parse(body)
}

function parseBodyFromForm(body: string): Record<string, string> {
  const parsedBody: Record<string, string> = {}

  body.split('&').forEach((formElement) => {
    const [key, value] = formElement.split('=')
    parsedBody[key] = value
  })
  return parsedBody
}
