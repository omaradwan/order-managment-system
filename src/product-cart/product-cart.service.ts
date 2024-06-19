import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {Prisma}from '@prisma/client'

@Injectable()
export class ProductCartService {
  constructor(private readonly databaseService:DatabaseService){}
  async addToCart(createProductCartDto: Prisma.ProductsCartsUncheckedCreateInput) {
    const { cartId, productId, quantity } = createProductCartDto;

    // Check if the product is already in the cart
    const existingCartItem = await this.databaseService.productsCarts.findUnique({
      where: {
        productId_cartId:{
          cartId: cartId,
          productId: productId,
        }
      },
    });

    if (existingCartItem) {
      // If the product is already in the cart, update the quantity
      return  this.databaseService.productsCarts.update({
        where: {
          productId_cartId:{
            cartId: cartId,
            productId: productId,
          }
        },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      });
    } else {
      // If the product is not in the cart, create a new entry
      return  this.databaseService.productsCarts.create({
        data: {
          cartId: cartId,
          productId: productId,
          quantity: quantity,
        },
      });
    }
  }
  async viewCart(id: number) {
      let cart=await this.databaseService.carts.findFirst({
        where:{
          userId:id
        }
      })
      if(!cart){
        throw new Error("there is no Cart for this user")
      }
      let cartId=cart.cartId;
      return this.databaseService.productsCarts.findFirst({
        where:{
          cartId:cartId
        }
      })
  } 

  async update(updateProductCartDto: Prisma.ProductsCartsUncheckedUpdateInput) {
    const { cartId, productId, quantity } = updateProductCartDto;

    return  this.databaseService.productsCarts.update({
      where: {
        productId_cartId:{
          cartId: +cartId,
          productId: +productId,
        }
      },
      data: {
        quantity: {
          increment: +quantity,
        },
      },
    });
  }
  async remove( data:any) {
    
    const existingCartItem = await this.databaseService.productsCarts.findUnique({
      where: {
        productId_cartId:{
          productId:data.productId,
          cartId:data.cartId
        }
      },
    });

    if (!existingCartItem) {
      throw new Error(`Product with productId ${data.productId} not found in cart with cartId ${data.cartId}`);
    }
    if (existingCartItem.quantity > 0) {
      await this.databaseService.productsCarts.update({
        where: {
          productId_cartId: {
            productId:data.productId,
            cartId:data.cartId,
          },
        },
        data: {
          quantity: {
            decrement: 1,
          },
        },
      });
     }
    return {success:true}
  }
}
