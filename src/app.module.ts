import { join } from 'path';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { ErrorsModule } from './common/errors/errors.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { EnvConfiguration } from './config/env.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { LoggerModule } from 'nestjs-pino';
import { CorrelationIdMiddleware, CORRELATION_ID_HEADER } from './common/middlewares/correlation-id.middleware';
import { Request } from 'express';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration]
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT, // El + es porque debe ser un número.
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    ProductsModule,
    ErrorsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    AuthModule,
    ChatModule,

    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            messageKey: 'message'
          }
        },
        messageKey: 'message',
        customProps: (req: Request) => {
          return {
            correlationId: req[CORRELATION_ID_HEADER],
          };
        },
        autoLogging: false,
        serializers: {
          req: () => {
            return undefined;
          },
          res: () => {
            return undefined;
          }
        }
      }
    }),

  ],
  controllers: [ ],
  providers: [ ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
