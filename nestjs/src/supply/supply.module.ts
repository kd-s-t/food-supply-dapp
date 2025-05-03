import { Module } from '@nestjs/common';
import { SupplyService } from './supply.service';
import { SupplyController } from './supply.controller';
import { RedisModule } from '../redis.module';

@Module({
  imports: [RedisModule],
  controllers: [SupplyController],
  providers: [SupplyService],
  exports: [SupplyService],
})
export class SupplyModule {}
