import { CustomRepository } from '@common/decorator/custom-repository.decorator';
import { DeepPartial, Repository } from 'typeorm';
import { ProductPurchaseHistory } from '../entity/product-purchase-history.entity';
import { SettlementListType } from '@settle/settle.constant';

@CustomRepository(ProductPurchaseHistory)
export class ProductPurchaseHistoryRepository extends Repository<ProductPurchaseHistory> {
  async insertNotReload(entities: DeepPartial<ProductPurchaseHistory[]>) {
    return await this.createQueryBuilder('storePurchaseHistory')
      .insert()
      .values(entities)
      .updateEntity(false)
      .execute();
  }
  
  async findByListType(accountId: number, type: SettlementListType) {
    let whereQuery = `account_id = ${accountId} and `;
    switch (type) {
      case SettlementListType.Daily:
        whereQuery += `date(storePurchaseHistory.created_time) = curdate()`;
        break;
      case SettlementListType.Weekly:
        whereQuery += `yearweek(storePurchaseHistory.created_time, 1) = yearweek(curdate(), 1)`;
        break;
      case SettlementListType.Monthly:
        whereQuery += `month(storePurchaseHistory.created_time) = month(curdate())`;
        break;
      default:
        break;
    }
    return await this.createQueryBuilder('productPurchaseHistory')
      .where(`${whereQuery}`)
      .select([
        ''
      ])
      .getRawMany();
  }
}
