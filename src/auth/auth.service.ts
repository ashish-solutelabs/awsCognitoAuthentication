import { AuthConfig } from './auth.config';
import { Inject, Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
  ICognitoUserPoolData,
} from 'amazon-cognito-identity-js';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  private sessionUserAttributes: {};
  constructor(private userService:UserService,private authConfig: AuthConfig) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  async signup(createUser) {
    const { name,email, password } = await createUser;
    console.log(name);
    const id = await uuidv4();
    console.log(id)

    const emailAttribute = new CognitoUserAttribute({ Name: 'email', Value: email });
    const idAttribute  = new CognitoUserAttribute({Name:'custom:id',Value:id });

    console.log(idAttribute)
    
    const signupCognito = new Promise((resolve, reject) =>  this.userPool.signUp(name,password,[idAttribute,emailAttribute],null,(err,data)=>{
      if(err){
        return reject(err)
      }else {
        resolve(data)
      }})
    )
    console.log(await signupCognito)
    
    if(await signupCognito){
      const userData = {
        id: id,
        username: name,
        email:email,
        password: password
      }
      await this.userService.create(userData)
    }
    return signupCognito

  }

  async loginCognito(loginUser){
    const {name,password} = loginUser
    const authenticationData = { Username: name, Password: password };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const user = new CognitoUser({ Username: name, Pool: this.userPool });  

    const login =new Promise((resolve, reject) => user.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log(result)
        // console.log(result.getIdToken().getJwtToken());
        resolve({
          "success": 1,
          "message": result.getAccessToken()//result.getIdToken().getJwtToken()
        }) 
      },
      onFailure: (err) => {
      return reject( {
          'success': 0,
          'message': err
        })
      }
      })
    )
    return login
  }

  async resetForgotPassword(forgotpassword:any){
    const {name} = forgotpassword
    const user = new CognitoUser({ Username:name, Pool: this.userPool });

    const resetpassworddata =  new Promise((resolve, reject) => user.forgotPassword({
      onSuccess: (result)=> {
        console.log(result);
        resolve({
          "success": 1,
          "message": "sent verification code on device"
        });
      },
      onFailure: (err)=> {
        return reject({
          "success": 0,
          "message": err
        });
      }
    }))
    console.log(await resetpassworddata)
    return await resetpassworddata
  }

  async setPasswordUsingVerficationCode(setpassword:any){
    const {name,verificationCode,newPassword} = setpassword
    const user = new CognitoUser({ Username: name, Pool: this.userPool });

    const confirmSetPassword = new Promise((resolve, reject) =>user.confirmPassword(verificationCode,newPassword,{
          onFailure: (err) => {
            return reject({
              "success": 0,
              "message": err
            });
          },
          onSuccess: (data) =>  {
            console.log(data);
            resolve({
              "success": 1,
              "message": "change password please signin"
            });
          }})
        )
    if(await confirmSetPassword){
      await this.userService.updateForgotPassword(name, newPassword)
    }
    return confirmSetPassword
  }

  
}


