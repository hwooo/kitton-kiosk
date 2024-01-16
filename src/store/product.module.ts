import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '@common/typeorm-ex.module';
import { UserRepository } from '@user/repository/user.repository';
import { ProductRepository } from './repository/product.repository';
import { ProductPurchaseHistoryRepository } from './repository/product-purchase-history.repository';
import { ProductSellerController, ProductCustomerController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      ProductRepository,
      ProductPurchaseHistoryRepository,
    ]),
  ],
  controllers: [ProductSellerController, ProductCustomerController],
  providers: [ProductService],
})
export class ProductModule {}
