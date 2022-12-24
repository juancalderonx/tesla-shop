import { Product } from "../../products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    select: false
  })
  password: string;

  @Column('text')
  fullname: string;

  @Column('text', {
    default: 'active'
  })
  status: string;

  @Column('text', {
    array: true,
    default: ['user']
  })
  roles: string[];

  @OneToMany(
    () => Product,
    product => product.user
  )
  product: Product;

  @BeforeInsert()
  checkData() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkDataUpdate() {
    this.checkData();
  }

}
