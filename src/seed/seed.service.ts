import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-products';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
  ) {}

  async runSeed() {
    const test = this.insertNewProducts();
    
    if(test) return 'Seed executed successfully';
    else return 'Seed failed';

  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();

    const seedProducts = initialData.products;
    const insertPromises = [];

    seedProducts.forEach( product => {
      insertPromises.push(this.productsService.create(product));
    });

    await Promise.all(insertPromises);

    return true;
  }

}
