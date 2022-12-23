import { IncomingHttpHeaders } from 'http';
import { Controller, Post, Body, Get, UseGuards, Req, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RawHeaders, GetUser } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testPrivateRoute(
    @Req() req: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    // @Headers() headers: IncomingHttpHeaders, || Esto es una forma de devolver los headers sin Custom Decorators
  ) {
    return {
      status: "success",
      message: "Bien vro",
      user,
      userEmail,
      rawHeaders,
      // headers,
    }
  }

}
