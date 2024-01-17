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
  
  async findByListType(accountId: number, type: SettlementListType, offset: number) {
    let whereQuery = `account_id = ${accountId} and `;
    switch (type) {
      case SettlementListType.Daily:
        whereQuery += `date(pph.created_time) = curdate() - interval ${offset} day`;
        break;
      case SettlementListType.Weekly:
        whereQuery += `yearweek(pph.created_time, 1) = yearweek(curdate(), 1) - interval ${offset} week`;
        break;
      case SettlementListType.Monthly:
        whereQuery += `month(pph.created_time) = month(curdate()) - interval ${offset} month`;
        break;
      default:
        break;
    }
    return await this.createQueryBuilder('pph')
      .where(`${whereQuery}`)
      .select([
        'pph.id as id',
        'pph.product_uuid as productUuid',
        'pph.product_index as productIndex',
        'pph.amount as amount',
        'pph.price as price',
        'pph.created_time as createdTime',
      ])
      .getRawMany();
  }
}
