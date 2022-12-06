import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ErrorsService } from 'src/common/errors/errors.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { validate as isUUID } from 'uuid'
import { ProductImage, Product } from './entities';

@Injectable()
export class ProductsService {

  /** Inicializa el servicio.
   * @param productRepository Repositorio para manejar la tabla Products de la base de datos.  
   * @param errorService Inyección del servicio de errores, para manejar logs de las operaciones en consola.
   */
  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly errorService: ErrorsService

  ) {}

  /** Service | Crea un nuevo producto.
   * @param createProductDto Recibe el DTO del producto a crear.
   * @returns El producto creado.
   */
  async create(createProductDto: CreateProductDto) {
    
    try {

      const { images = [], ...productDetails } = createProductDto;

      // Creo el producto en base a los datos que llegaron del Frontend.
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map( image => this.productImageRepository.create({ url: image }) )
      });

      // Guardo el producto en DB.
      await this.productRepository.save(product);

      return { ...product, images };

    } catch (err) {
      this.errorService.DBHandleError(err);
    }

  }

  /** Service | Trae todos los productos de la base de datos.
   * @param paginationDto DTO de paginación.
   * @returns Lista de productos encontrados en formato JSON.
   */
  findAll( paginationDto : PaginationDto ) {
    
    const { limit = 10, offset = 0 } = paginationDto;
    
    return this.productRepository.find({
      take: limit,
      skip: offset,

      // TO-DO: Relations in Database

    });
  }

  /** Service | Busca un producto por término.
   * @param term Término de búsqueda. Puede ser UUID, title or slug.
   * @returns Producto encontrado.
   */
  async findOne(term: string) {

    let product: Product;

    if(isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    }
    else {
      const queryBuilder = this.productRepository.createQueryBuilder();

      product = await
        queryBuilder
          .where(`UPPER(title) =:title OR slug =:slug`, {
            title: term.toUpperCase(),
            slug: term.toLocaleLowerCase()
          }).getOne();

    }

    if(!product) throw new NotFoundException(`Product with ${term} not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    /*
    Aquí lo que se hace es que con el ID que se buscó el producto, primero con el preload buscamos ese producto.
    Entonces, si encuentra algo con ese ID, le carga todas las propiedades que contenga el DTO.
    */
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      images: []
    });

    if(!product) throw new NotFoundException(`Product with id: ${id} not found`);

    try {
      await this.productRepository.save(product);
      
      return product;
    } catch (err) {
      this.errorService.DBHandleError(err);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    return this.productRepository.remove(product);

  }
  
}
