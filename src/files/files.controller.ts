import { Response } from 'express';
import { diskStorage } from 'multer';

import { BadRequestException, Controller, Post } from '@nestjs/common';
import { Get, Param, Res, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers/index';

@ApiTags('Files')
@Controller('files')
export class FilesController {

  private hostAPI: string;

  constructor(
    private readonly filesService: FilesService,

    private readonly configService: ConfigService

  ) {
    this.hostAPI = configService.get('hostAPI');
  }

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getProductImage(imageName);
    
    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File
    ){

      if(!file) throw new BadRequestException(`Make sure that file is an image, please.`);

      const secureURL = `${this.hostAPI}files/product/${file.filename}`;

    return {
      secureURL
    }
  }

}
