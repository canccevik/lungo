import { Request } from '../request'

export async function parseBody(req: Request): Promise<Request> {
  return new Promise((resolve, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      if (body.length === 0) return resolve(req)

      const contentType = req.get('content-type')

      if (contentType === 'application/json') {
        req.body = parseBodyFromJson(body)
      } else if (contentType === 'application/x-www-form-urlencoded') {
        req.body = parseBodyFromForm(body)
      } else {
        req.body = body
      }
      resolve(req)
    })

    req.on('error', (error) => {
      reject(error)
    })
  })
}

function parseBodyFromJson(body: string): Record<string, unknown> {
  return JSON.parse(body)
}

function parseBodyFromForm(body: string): Record<string, unknown> {
  const parsedBody: Record<string, unknown> = {}

  body.split('&').forEach((formElement) => {
    const [key, value] = formElement.split('=')
    parsedBody[key] = value
  })
  return parsedBody
}
