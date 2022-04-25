import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthConfig } from './auth.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }),UserModule,TypeOrmModule.forFeature([User])],
  providers: [AuthConfig, AuthService, JwtStrategy,UserService],
  controllers: [AuthController],
  exports:[JwtStrategy,AuthConfig]
})

export class AuthModule {}
