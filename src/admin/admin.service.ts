import { Injectable } from '@nestjs/common';
import { rejects } from 'assert';
import { CognitoIdentityServiceProvider, config } from 'aws-sdk';
import { AuthConfig } from 'src/auth/auth.config';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  private adminCognito:CognitoIdentityServiceProvider;

  constructor(private authConfig:AuthConfig){
    this.adminCognito = new CognitoIdentityServiceProvider({
      apiVersion: '2016-04-18',
      region: 'us-east-1',
      accessKeyId: 'AKIA3XICSQG7LDYX4WNA',
      secretAccessKey: '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',
      
    })
  }


  async create(createAdminDto) {
   const {name,email} = createAdminDto

   const userpoolid = process.env.COGNITO_USER_POOL_ID;

   const adminAddUserValue = {
    UserPoolId: this.authConfig.userPoolId,
    Username: name,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
    ],
    ForceAliasCreation:  true,
    TemporaryPassword: 'Ashish@123',
    MessageAction: 'SUPPRESS',
   }
   const adminAddUser = new Promise((resolve, reject) => this.adminCognito.adminCreateUser(adminAddUserValue,(err,data)=>{
     if(err){
      reject(err)
     }
     else{
      resolve(data)
     }
   }))
   console.log(await adminAddUser)

   return adminAddUser
  }

  async InitiateAuth(createAdminDto){
    const {name,password,email} = createAdminDto
    const initiateData = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      ClientId: this.authConfig.clientId,
      UserPoolId: this.authConfig.userPoolId,
      AuthParameters: {
        USERNAME: name,
        EMAIL: email,
        PASSWORD: password,
      }
    }

    const adminInitiate =new Promise((resolve, reject) => this.adminCognito.adminInitiateAuth(initiateData,(err,result) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      else{
        console.log(result);
        resolve(result)
      }
    })) 

    return await adminInitiate
  }

  async adminResponseChallange(responseData){
    const { session, password, name } = responseData;

    const authData = {
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ClientId:this.authConfig.clientId,
      ChallengeResponses: {
        NEW_PASSWORD: password,
        USERNAME: name,
      },
      Session: session,
    }

    const adminChallenge = new Promise((resolve, reject) =>this.adminCognito.respondToAuthChallenge(authData,(err, result) =>{
      if(err){
        reject(err);
      }
      else{
        resolve(result)
      }
    })) 
    console.log(adminChallenge)
    return adminChallenge
  }

  // findAll() {
  //   return `This action returns all admin`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} admin`;
  // }

  // update(id: number, updateAdminDto: UpdateAdminDto) {
  //   return `This action updates a #${id} admin`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} admin`;
  // }
}
