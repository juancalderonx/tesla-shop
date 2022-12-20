import { IsEmail, IsIn, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

  @IsString() @IsEmail()
  readonly email: string;

  @IsString() @MinLength(6) @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  readonly password: string;

  @IsString() @MinLength(1)
  readonly fullname: string;

  @IsIn(['active', 'inactive', 'erased']) @IsOptional()
  readonly status?: string;

}