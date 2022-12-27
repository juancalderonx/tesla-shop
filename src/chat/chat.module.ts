import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ ChatGateway, ChatService ],
  imports: [ AuthModule ]
})
export class ChatModule {}
