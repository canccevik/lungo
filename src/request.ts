import { IncomingMessage } from 'http'
import { IRequest } from './interfaces'

export class Request extends IncomingMessage implements IRequest {}
