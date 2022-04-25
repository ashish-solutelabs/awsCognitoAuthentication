import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AuthConfig } from 'src/auth/auth.config';

@Module({
  imports: [AuthModule,AuthConfig],
  controllers: [AdminController],
  providers: [AdminService,AuthConfig]
})
export class AdminModule {}
