import { BaseException } from './base-exception'

export class PortIsNotProvidedException extends BaseException {
  constructor() {
    super('Port is not provided.')
  }
}
