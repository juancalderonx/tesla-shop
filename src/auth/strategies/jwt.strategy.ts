import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    configService: ConfigService,

  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  
  // Custom strategy

  /** 
   * Esta función básicamente funciona así: Siempre que un JWT pase sus dos validaciones respectivas que son: 1. Si el JWT no ha expirado y 2. Si la firma del JWT coincide con el payload. Entonces esta función lo que hace es validar el payload. Es decir, esto ya son validaciones personalizadas, como por ejemplo, validar si el usuario está activo o no.
   * @param payload 
   * @returns 
   */
  async validate( payload: JwtPayload): Promise<User> {

    // No necesito el password del usuario, ya que únicamente si el usuario se autentica correctamente, vamos a generar el JWT, de lo contrario no.
    
    const { id } = payload;

    const user = await this.userRepository.findOneBy({id: id});

    if(!user) throw new UnauthorizedException(`Token not valid`);

    if(user.status === 'inactive' || user.status === 'erased')
      throw new UnauthorizedException(`User inactive or erased, please talk with the administrator.`);
      
    return user;
  }

}