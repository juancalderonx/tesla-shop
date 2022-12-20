import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class ErrorsService {

  private readonly logger = new Logger('ErrorsService');

  public DBHandleError( error : any ): never {
    this.logger.error(error.detail);

    if( error.code === '23505') throw new BadRequestException(`Error 23505: ${error.detail}`);

    throw new InternalServerErrorException(`Unexpected error, check server logs, please.`);
  }

}
