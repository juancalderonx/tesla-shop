import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ErrorsModule } from 'src/utils/errors/errors.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ErrorsModule],
  imports: [
    TypeOrmModule.forFeature([ Product ]),

    ErrorsModule,

  ]
})
export class ProductsModule {}
