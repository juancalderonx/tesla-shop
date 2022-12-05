import { Injectable, Logger } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorsService } from 'src/utils/errors/errors.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly errorService: ErrorsService

  ) {}

  async create(createProductDto: CreateProductDto) {
    
    try {

      // Creo el producto en base a los datos que llegaron del Frontend.
      const product = this.productRepository.create(createProductDto);

      // Guardo el producto en DB.
      await this.productRepository.save(product);

      return product;

    } catch (err) {
      this.errorService.DBHandleError(err);
    }

  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
