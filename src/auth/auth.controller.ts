import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() createUser) {
    return await this.authService.signup(createUser);
  }

  @Post('login')
  async login(@Body() loginUser) {
    try {
      return await this.authService.loginCognito(loginUser)
      // return await this.authService.authenticateUser(loginUser);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('forgotpassword')
  async forgotpassword(@Body() forgotpassword){
    console.log(forgotpassword)
    return await this.authService.resetForgotPassword(forgotpassword)
  }

  @Post('setpassword')
  async setpassword(@Body() setpassword){
    return await this.authService.setPasswordUsingVerficationCode(setpassword);
  }
  


}
