import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationException } from './common/exceptions/validation.exception';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // API Versioning
  app.setGlobalPrefix('api/v1');

  // HTTPS enforcement in production
  if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
      } else {
        next();
      }
    });
  }

  // Security middleware - Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: "same-origin" },
    crossOriginEmbedderPolicy: false, // Disable for file uploads
  }));

  // Rate limiting - configurable via environment variables
  const rateLimitWindow = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') || 15 * 60 * 1000;
  const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100') || 100;
  
  const limiter = rateLimit({
    windowMs: rateLimitWindow,
    max: rateLimitMax,
    message: {
      error: 'Çok fazla istek',
      message: 'Lütfen daha sonra tekrar deneyin.',
      statusCode: 429
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Stricter rate limiting for auth endpoints
  const authLimiter = rateLimit({
    windowMs: rateLimitWindow,
    max: 5, // maksimum 5 auth request per IP
    message: {
      error: 'Çok fazla giriş denemesi',
      message: 'Lütfen 15 dakika sonra tekrar deneyin.',
      statusCode: 429
    },
  });
  app.use('/auth/login', authLimiter);
  app.use('/auth/register', authLimiter);

  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Global exception filter for secure error handling
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        // Custom validation error messages to avoid exposing internal structure
        const messages = errors.map(error => {
          const constraints = error.constraints;
          return constraints ? Object.values(constraints).join(', ') : 'Geçersiz veri';
        });
        return new ValidationException(messages);
      },
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3002',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3002',
      process.env.CORS_ORIGIN || 'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  // Use proper logging in production
  if (process.env.NODE_ENV === 'development') {
    console.log(`Application is running on: http://localhost:${port}`);
  }
}

void bootstrap();
