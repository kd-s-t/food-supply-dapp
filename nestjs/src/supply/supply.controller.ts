/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { SupplyService } from './supply.service';

@Controller('supply')
export class SupplyController {
  constructor(private readonly supplyService: SupplyService) {}

  @Get('all')
  async getAllSupplies() {
    return await this.supplyService.getAllSupplies();
  }

  @Post('add')
  addSupply(
    @Body()
    body: {
      name: string;
      description: string;
      quantity: number;
      provider: string;
      addedBy: string;
    },
  ) {
    return this.supplyService.addSupply(
      body.name,
      body.description,
      body.quantity,
      body.provider,
      body.addedBy,
    );
  }
}
