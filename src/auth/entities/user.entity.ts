import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

}
