import { Request } from '../request'

export async function parseBody(req: Request): Promise<Request> {
  return new Promise((resolve, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      try {
        if (body.length > 0) {
          req.body = JSON.parse(body)
        }
      } catch (error) {
        reject(new Error("Request's body is not a valid JSON."))
      }
      resolve(req)
    })

    req.on('error', (error) => {
      reject(error)
    })
  })
}
