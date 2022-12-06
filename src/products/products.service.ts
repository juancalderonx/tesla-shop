import { Injectable, Logger } from '@nestjs/common';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ErrorsService } from 'src/common/errors/errors.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { validate as isUUID } from 'uuid'

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

  findAll( paginationDto : PaginationDto ) {
    
    const { limit = 10, offset = 0 } = paginationDto;
    
    return this.productRepository.find({
      take: limit,
      skip: offset,

      // TO-DO: Relations in Database

    });
  }

  async findOne(term: string) {

    let product: Product;

    if(isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    }
    else {
      product = await this.productRepository.findOneBy({ slug: term });
    }

    if(!product) throw new NotFoundException(`Product with ${term} not found`);

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
