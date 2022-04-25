import { ConflictException, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

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
            message: `user password update successfully`
        }

  }

//   findAll() {
//     return `This action returns all user`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} user`;
//   }

//   update(id: number, updateUserDto: UpdateUserDto) {
//     return `This action updates a #${id} user`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} user`;
//   }
}
