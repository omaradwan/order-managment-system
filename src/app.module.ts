import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { OrderModule } from './order/order.module';
import {ProductCartModule}from './product-cart/product-cart.module'



@Module({
  imports: [DatabaseModule,ProductCartModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
