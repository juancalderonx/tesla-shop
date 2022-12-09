import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ErrorsService } from 'src/common/errors/errors.service';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { validate as isUUID } from 'uuid'
import { ProductImage, Product } from './entities';

@Injectable()
export class ProductsService {

  /** Inicializa el servicio.
   * @param productRepository Repositorio para manejar la tabla Products de la base de datos.
   * @param productImageRepository Repositorio para manejar la tabla ProductImage de la base de datos.
   * @param errorService Inyección del servicio de errores, para manejar logs de las operaciones en consola.
   * @param dataSource Inyección de DataSource, clase de TypeORM para darle acceso a la DB al queryRunner.
   */
  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly errorService: ErrorsService,

    private readonly dataSource: DataSource,

  ) {}

  // CRUD Operations --------------------------------------------------------------------------------------------------------------------------------

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
  async findAll( paginationDto : PaginationDto ) {
    
    const { limit = 10, offset = 0 } = paginationDto;
    
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    });

    return products.map( product => ({
      ...product,
      images: product.images.map( image => image.url )
    }));

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
      const queryBuilder = this.productRepository.createQueryBuilder('prod');

      product = await
        queryBuilder
          .where(`UPPER(title) =:title OR slug =:slug`, {
            title: term.toUpperCase(),
            slug: term.toLocaleLowerCase()
          })
          .leftJoinAndSelect('prod.images', 'images')
          .getOne();

    }

    if(!product) throw new NotFoundException(`Product with ${term} not found`);

    return product;
  }

  /** Service | Actualiza un producto.
   * @param id UUID del producto a actualizar.
   * @param updateProductDto DTO del producto actualizado.
   * @returns Producto actualizado.
   */
  async update(id: string, updateProductDto: UpdateProductDto) {

    // Separo las imágenes y el resto de información del producto. Esto con el fin de manejar la actualización del producto de una forma y la de las imágenes de otra.
    const { images, ...productToUpdate } = updateProductDto;

    /*
    Aquí lo que se hace es que con el ID que se buscó el producto, primero con el preload buscamos ese producto.
    Entonces, si encuentra algo con ese ID, le carga todas las propiedades que contenga el productToUpdate que es el DTO.
    */
    const product = await this.productRepository.preload({ id, ...productToUpdate });

    if(!product) throw new NotFoundException(`Product with id: ${id} not found`);

    // Si tenemos un producto, ahora evaluamos si hay imágenes.

    // Create QueryRunner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if(images?.length) {
        //Query 1 | Elimina las imágenes anteriores.
        await queryRunner.manager.delete( ProductImage, { product: { id } } );

        product.images = images.map(
          image => this.productImageRepository.create({ url: image })
        );
      }

      // Query 2 | Actualiza datos del producto.
      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      
      return this.findOnePlain(id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.errorService.DBHandleError(err);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    return this.productRepository.remove(product);
  }

  // Custom Operations --------------------------------------------------------------------------------------------------------------------------------
  
  /** Personaliza la forma en que se devuelve un producto al Frontend. En este caso, aplanamos las imágenes para retornarlas sin el ID propio de ellas.
   * @param term Puede ser ID, title o slug del producto.
   * @returns Producto encontrado y su relación con las imágenes ya aplanadas.
   */
  async findOnePlain( term: string ) {
    const { images = [], ...product } = await this.findOne(term);
    return {
      ...product,
      images: images.map( image => image.url )
    }
  }


}
