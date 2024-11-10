import { AppFactory } from '~core';
import { AppModule } from '~modules/app.module';

const app = AppFactory.create(AppModule);
app.start();
