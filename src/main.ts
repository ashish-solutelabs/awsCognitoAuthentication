import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

global['fetch'] = require('node-fetch');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();



// COGNITO_USER_POOL_ID=us-east-1_nPCKsR8zH
// COGNITO_CLIENT_ID=5sbu7jjaridsnj8pkknsbm4a84
// COGNITO_REGION=us-east-1

// COGNITO_USER_POOL_ID=us-east-1_CItcoXklZ
// COGNITO_CLIENT_ID=6eliu83qghrm344lm141cnbgl8
// COGNITO_REGION=us-east-1

