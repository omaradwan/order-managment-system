import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {Prisma}from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class OrderService {
  constructor(private readonly databaseService:DatabaseService){}
 async create(data:any) {
     
      let cart=await this.databaseService.carts.findFirst({
          where:{
            userId:data.userId
          }
        })
    
     // Delete products from the user's cart
     const cartItems = await this.databaseService.productsCarts.findMany({
      where: {
         cartId:cart.cartId
      },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      throw new Error(`No items in the cart for user ${data.userId}`);
    }

    // Create a new order
    const newOrder = await this.databaseService.orders.create({
      data: {
        orderId: uuidv4(), // Generate a new UUID
        userId:data.userId,
        orderDate: new Date(),
        status: 'Pending',
      },
    });
   

    // Populate the ProductsOrders table
    const orderItemsData = cartItems.map((item) => ({
      productId: item.productId,
      orderId: newOrder.orderId,
      quantity: item.quantity,
    }));

    await this.databaseService.productsOrders.createMany({
      data: orderItemsData,
    });

    // Delete products from the user's cart
    await this.databaseService.productsCarts.deleteMany({
      where: {
        cartId:cart.cartId
      },
    });

    return newOrder;
  
  };
  
  async findOne(data: any) {
    console.log(data)
    return this.databaseService.orders.findFirst({
      where: {
        orderId: data.orderId,
      },
    });
  }
  update(data: any ) {
    console.log(data)
    return this.databaseService.orders.update({
      where:{orderId:data.orderId},
      data:{
        status:"shipped"
      }
    })
  }

}
