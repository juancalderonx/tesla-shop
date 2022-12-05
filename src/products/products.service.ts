import { Injectable, Logger } from '@nestjs/common';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorsService } from 'src/utils/errors/errors.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {

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

  //TODO: Paginar
  findAll() {
    return this.productRepository.find();
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });

    if(!product) throw new NotFoundException(`Product with id ${id} not found`);

    return product;

  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    return this.productRepository.remove(product);

  }
}
