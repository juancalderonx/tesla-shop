import { Repository } from 'typeorm';

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';

import { ErrorsService } from 'src/common/errors/errors.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly errorService: ErrorsService,

    private readonly jwtService: JwtService,
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

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      }
    } catch (err) {
      this.errorService.DBHandleError(err);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, fullname: true }
    });

    if(!user) throw new UnauthorizedException(`Credentials aren't not valid`);

    if(!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException(`Credentials aren't not valid`);

    delete user.password;

    return {
      status: "success",
      message: "Login successful",
      dataUser: user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  /**
   * Generamos y firmamos el JWT.
   * @param payload 
   * @returns JWT firmado.
   */
  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({id: user.id}),
    }
  }

}
