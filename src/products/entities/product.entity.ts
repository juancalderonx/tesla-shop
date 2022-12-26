import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./index";
import { User } from "../../auth/entities/user.entity";

@Entity({ name: 'products' })
export class Product {

  // Columns ------------------------------------------------------------------------------------------------

  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '1a934647-2291-4f7c-a552-aaf888c090b6',
    description: 'Product UUID',
    uniqueItems: true,
  })
  id: string;

  @Column('text', {
    unique: true
  })
  @ApiProperty({
    example: 'T-Shirt Example',
    description: 'Title of product',
    uniqueItems: true,
  })
  title: string;

  @Column('float', {
    default: 0
  })
  @ApiProperty({
    example: '0',
    description: 'Price of product',
  })
  price: number;

  @Column({
    type: "text",
    nullable: true
  })
  @ApiProperty({
    example: 'Eiusmod aute proident minim sunt esse dolor nostrud.',
    default: null,
    description: 'Short description of product'
  })
  description: string;

  @Column({
    unique: true
  })
  @ApiProperty({
    example: 'title_of_product',
    uniqueItems: true,
    description: 'Slug of product for SEO.'
  })
  slug: string;

  @Column('int', {
    default: 0
  })
  @ApiProperty({
    example: '20',
    description: 'Number of products available. Stock.'
  })
  stock: number;

  @Column('text', {
    array: true
  })
  @ApiProperty({
    example: ['M', 'L', 'XL'],
    description: 'Sizes of product.'
  })
  sizes: string[];

  @Column('text')
  @ApiProperty({
    example: 'male',
    description: 'Gender of product',
  })
  gender: string;

  @Column('text', {
    array: true,
    default: []
  })
  @ApiProperty()
  tags: string[];

  @OneToMany(
    () => ProductImage,
    productImage => productImage.product,
    { cascade: true, eager: true }
  )
  @ApiProperty()
  images?: ProductImage[];

  @ManyToOne(
    () => User,
    user => user.product,
    { eager: true }
  )
  user: User;

  // Procceses ------------------------------------------------------------------------------------------------

  @BeforeInsert()
  checkSlugInsert() {
    if(!this.slug) {
      this.slug = this.title
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
    .toLowerCase()
    .replaceAll(' ', '_')
    .replaceAll("'", '');
  }

}
