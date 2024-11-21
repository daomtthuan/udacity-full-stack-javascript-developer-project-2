import { AppFactory } from '~core';
import { AppModule } from '~modules/app.module';

(async function main() {
  const app = await AppFactory.create(AppModule);
  app.start();
})();
