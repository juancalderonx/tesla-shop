import { Controller, Get, Logger } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {

  private readonly logger = new Logger(SeedController.name);

  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth(ValidRoles.admin, ValidRoles.superUser)
  runSeed() {
    this.logger.log('Seed executing');
    return this.seedService.runSeed();
  }

}
