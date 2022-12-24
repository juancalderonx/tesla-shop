import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-products';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  
    ) {}

  async runSeed() {
    await this.deleteTables();
    const admin = await this.insertUsers();
    const test = this.insertNewProducts(admin);
    
    if(test) return 'Seed executed successfully';
    else return 'Seed failed';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();

  }

  private async insertUsers() {

    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach(user => {
      user.password = bcrypt.hashSync(user.password, 10);
      users.push(this.userRepository.create(user));
    });

    const usersDb = await this.userRepository.save(seedUsers);

    return usersDb[0];

  }

  private async insertNewProducts(admin: User) {
    await this.productsService.deleteAllProducts();

    const seedProducts = initialData.products;
    const insertPromises = [];

    seedProducts.forEach( product => {
      insertPromises.push(this.productsService.create(product, admin));
    });

    await Promise.all(insertPromises);

    return true;
  }

}
