import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorsModule } from 'src/common/errors/errors.module';
import { Product, ProductImage } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ErrorsModule],
  imports: [
    TypeOrmModule.forFeature([ Product, ProductImage ]),

    ErrorsModule,
    AuthModule,

  ],
  exports: [
    ProductsService,
    TypeOrmModule
  ]
})
export class ProductsModule {}
