import { ConflictException, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  createUser(createAdminDto: any) {
    throw new Error('Method not implemented.');
  }

  constructor(@InjectRepository(User) private repo: Repository<User>){}

  async create(createUserDto) { 
    console.log(createUserDto)

    const {id,username,email,password} = createUserDto
    const dublicateEmail = await this.repo.findOne({email});
    if(dublicateEmail){
      throw new ConflictException("dublicate email found")
    }


    const user = new User();
    user.id = id
    user.email = email;
    user.username = username;
    const salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, salt);

    try {
        await this.repo.save(user);
    } catch (error) {
      console.log(error);
    }
  }
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  changePassword(changepassword){
    
  }
  
  async updateForgotPassword(username: string, password: string){
    const user = await this.repo.findOne({username});

    const updateUserPassword = {
      password: password
    }
    Object.assign(user, updateUserPassword);
    const status = await this.repo.save(user);

    if (!status) {
          throw new NotAcceptableException("Data is not store in server");
      }
    return {
            success: 1,
            message: `user password update Successfully`
    }

  }
}
