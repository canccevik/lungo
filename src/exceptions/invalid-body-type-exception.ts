import { BaseException } from './base-exception'

export class InvalidBodyTypeException extends BaseException {
  constructor() {
    super('Type of body is not valid.')
  }
}
