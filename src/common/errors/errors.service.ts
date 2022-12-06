import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class ErrorsService {

  private readonly logger = new Logger('ErrorsService');

  public DBHandleError( error : any ) {

    if( error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(`Unexpected error, check server logs, please.`);
  }

}
