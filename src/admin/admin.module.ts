import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AuthConfig } from 'src/auth/auth.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [AuthModule,AuthConfig,UserModule,TypeOrmModule.forFeature([User])],
  controllers: [AdminController],
  providers: [AdminService,AuthConfig]
})
export class AdminModule {}
