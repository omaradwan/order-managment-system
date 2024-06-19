import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import {Prisma}from '@prisma/client'

@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() data:any ) {
    return this.orderService.create(data);
  }
  @Get()
  findOne(@Body() data: any) {
    return this.orderService.findOne(data);
  }

  @Put()
  update(@Body() data:any ) {
    return this.orderService.update(data);
  }
}
