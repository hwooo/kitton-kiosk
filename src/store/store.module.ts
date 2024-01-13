import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@common/typeorm-ex.module';
import { UserRepository } from '@user/repository/user.repository';
import { StoreRepository } from './repository/store.repository';
import { StorePurchaseHistoryRepository } from './repository/store-purchase-history.repository';
import { StoreSellerController, StoreCustomerController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      StoreRepository,
      StorePurchaseHistoryRepository,
    ]),
  ],
  controllers: [StoreSellerController, StoreCustomerController],
  providers: [StoreService],
})
export class StoreModule {}
