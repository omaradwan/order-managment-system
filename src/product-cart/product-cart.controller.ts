import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ProductCartService } from './product-cart.service';
import {Prisma}from '@prisma/client'


@Controller('api/cart')
export class ProductCartController {
  constructor(private readonly productCartService: ProductCartService) {}

  @Post('add')
  create(@Body() createProductCartDto: Prisma.ProductsCartsUncheckedCreateInput) {
    return this.productCartService.addToCart(createProductCartDto);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCartService.viewCart(+id);
  }

  @Put('update')
  update(@Body() updateProductCartDto:Prisma.ProductsCartsUncheckedUpdateInput) {
    return this.productCartService.update(updateProductCartDto);
  }

  @Delete('remove')
  remove(@Body() data:any) {
    return this.productCartService.remove(data);
  }
}
