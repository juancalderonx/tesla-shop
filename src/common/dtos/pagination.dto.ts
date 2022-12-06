import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

  @IsOptional() @IsPositive() @Min(1) @IsNumber() @Type( () => Number )
  limit?: number;

  @IsOptional() @IsPositive() @Min(0) @IsNumber() @Type( () => Number )
  offset?: number;

  // @Type( () => Number ) Lo que hace es convertir los números del url a número, ya que viene como string.

}