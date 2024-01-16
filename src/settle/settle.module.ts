import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@common/typeorm-ex.module';
import { UserRepository } from '@user/repository/user.repository';
import {
  ProductPurchaseHistoryRepository,
} from '@product/repository/product-purchase-history.repository';
import { SettleController } from './settle.controller';
import { SettleService } from './settle.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      ProductPurchaseHistoryRepository,
    ]),
  ],
  controllers: [SettleController],
  providers: [SettleService],
})
export class SettleModule {}
