import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

  @IsOptional() @IsPositive() @Min(1) @IsNumber() @Type( () => Number )
  @ApiProperty({
    example: 10,
    description: 'Number of items per page'
  })
  limit?: number;

  @IsOptional() @IsPositive() @Min(0) @IsNumber() @Type( () => Number )
  @ApiProperty({
    example: 2,
    description: 'Number of rows do you want to skip.'
  })
  offset?: number;

  // @Type( () => Number ) Lo que hace es convertir los números del url a número, ya que viene como string.

}