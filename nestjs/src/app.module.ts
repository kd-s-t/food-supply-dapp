import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SupplyModule } from './supply/supply.module';

@Module({
  imports: [AuthModule, UsersModule, SupplyModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: 'localhost',
          port: 6379,
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class AppModule {}
