import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(messages: string[]) {
    super({
      statusCode: 400,
      error: 'Validation Error',
      message: messages.length === 1 ? messages[0] : messages,
    });
  }
}