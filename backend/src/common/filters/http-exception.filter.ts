import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string | object;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = exceptionResponse;
      } else {
        message = 'Bir hata oluştu';
      }
    } else {
      // Log internal server errors but don't expose details
      this.logger.error('Unexpected error:', exception);
      
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      
      // In production, don't expose internal error details
      if (process.env.NODE_ENV === 'production') {
        message = 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
      } else {
        // In development, show more details for debugging
        message = exception instanceof Error ? exception.message : 'Bilinmeyen hata';
      }
    }

    // Log security-related errors
    if (status === HttpStatus.UNAUTHORIZED || status === HttpStatus.FORBIDDEN) {
      this.logger.warn(`Security error: ${request.method} ${request.url} - ${JSON.stringify(message)}`);
    }

    // Don't log successful client errors (4xx except security)
    if (status >= 500) {
      this.logger.error(`Server error: ${request.method} ${request.url} - ${JSON.stringify(message)}`);
    }

    const errorResponse: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message,
    };

    // Add debug information in development
    if (process.env.NODE_ENV !== 'production') {
      errorResponse.path = request.url;
      errorResponse.method = request.method;
    }

    response.status(status).json(errorResponse);
  }
}