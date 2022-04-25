import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('adduser')
  create(@Body() createAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Post('initiateauth')
  adminInitiateAuth(@Body() initiateAuth) {
    return this.adminService.InitiateAuth(initiateAuth);
  }

  @Post('adminchallenge')
  adminResponseChallenge(@Body() responseChallange) {
    return this.adminService.adminResponseChallange(responseChallange);
  }
}
