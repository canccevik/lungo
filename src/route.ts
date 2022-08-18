import { IHandler, IRoute } from './interfaces'

export class Route {
  public stack: IRoute[] = []

  public get(path: string, handler: IHandler): void {
    this.stack.push({ path, handler, method: 'GET' })
  }

  public post(path: string, handler: IHandler): void {
    this.stack.push({ path, handler, method: 'POST' })
  }

  public put(path: string, handler: IHandler): void {
    this.stack.push({ path, handler, method: 'PUT' })
  }

  public delete(path: string, handler: IHandler): void {
    this.stack.push({ path, handler, method: 'DELETE' })
  }

  public patch(path: string, handler: IHandler): void {
    this.stack.push({ path, handler, method: 'PATCH' })
  }
}
