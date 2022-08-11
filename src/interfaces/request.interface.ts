import { IncomingMessage } from 'http'

export interface IRequest extends IncomingMessage {
  get(field: string): string | undefined
}
