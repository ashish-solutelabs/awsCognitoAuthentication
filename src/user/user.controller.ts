import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Post('changepassword')
  changePasword(@Body() changepassword){
    return this.userService.changePassword(changepassword);
  }

  
}
