import { BaseException } from './base-exception'

export class InvalidMimeException extends BaseException {
  constructor() {
    super('Mime type is not valid.')
  }
}
