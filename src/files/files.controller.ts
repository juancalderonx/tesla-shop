import { BadRequestException, Controller, Post } from '@nestjs/common';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter
  }) )
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File
    ){

      if(!file) throw new BadRequestException(`Make sure that file is an image, please.`);

    return {
      fileName : file.originalname,
    }
  }

}
