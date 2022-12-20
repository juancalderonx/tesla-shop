import { Repository } from 'typeorm';

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';

import { ErrorsService } from 'src/common/errors/errors.service';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly errorService: ErrorsService,

  ) {}
  
  async create(createUserDto: CreateUserDto) {
    
    try {

      const { password, ...userDetails } = createUserDto;

      const user = this.userRepository.create({
        ...userDetails,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);
      
      this.logger.log(`User with email ${createUserDto.email} saved successfully.`);

      delete user.password;

      // TODO: Return JWT

      return user;
    } catch (err) {
      this.errorService.DBHandleError(err);
    }

  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true }
    });

    if(!user) throw new UnauthorizedException(`Credentials aren't not valid`);

    if(!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException(`Credentials aren't not valid`);

    return user;
    // TODO: Return JWT
  }

}
