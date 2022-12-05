import { IsInt, IsPositive, IsString, MinLength, IsOptional, IsArray, IsNumber, IsIn } from "class-validator";

export class CreateProductDto {

    @IsString() @MinLength(1)
    readonly title: string;

    @IsNumber() @IsPositive() @IsOptional()
    readonly price?: number;

    @IsString() @IsOptional()
    readonly description?: string;

    @IsString() @IsOptional()
    slug?: string;

    @IsInt() @IsPositive() @IsOptional()
    readonly stock?: number;

    @IsString({ each: true }) @IsArray()
    readonly sizes: string[];

    @IsIn(['men', 'women', 'kid', 'unisex'])
    readonly gender: string;

}
