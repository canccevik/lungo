import { Request } from '../request'
import { isJSON } from './is-json.util'

export async function parseBody(req: Request): Promise<Request> {
  return new Promise((resolve, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      if (body.length > 0) {
        req.body = isJSON(body) ? JSON.parse(body) : body
      }
      resolve(req)
    })

    req.on('error', (error) => {
      reject(error)
    })
  })
}
