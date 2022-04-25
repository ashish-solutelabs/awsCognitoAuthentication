import { Injectable } from '@nestjs/common';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { AuthConfig } from 'src/auth/auth.config';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AdminService {
  private adminCognito:CognitoIdentityServiceProvider;

  constructor(private authConfig:AuthConfig,private userService:UserService){
    this.adminCognito = new CognitoIdentityServiceProvider({
      apiVersion: '2016-04-18',
      region: 'us-east-1',
      accessKeyId: 'AKIA3XICSQG7LDYX4WNA',
      secretAccessKey: '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',
      
    })
  }


  async create(createAdminDto) {
   const {name,email} = createAdminDto
  
   const id = await uuidv4();
    console.log(id)

   const adminAddUserValue = {
    UserPoolId: this.authConfig.userPoolId,
    Username: name,
    UserAttributes: [
      {
        Name: 'custom:id',
        Value: id
      },
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
      return reject(err)
     }
     else{
      resolve(data)
     }
   }))

   if(adminAddUser){
      const createUser= {
        "id": id,
        "username" :name,
        "email": email,
        "password" :adminAddUserValue.TemporaryPassword
      }
      console.log(createUser)
      await this.userService.create(createUser)
    }
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
        return reject(err);
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
        return reject(err);
      }
      else{
        resolve(result)
      }
    })) 
    
    console.log(adminChallenge)
    return adminChallenge
  }
}
