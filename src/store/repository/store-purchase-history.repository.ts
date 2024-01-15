import { CustomRepository } from '@common/decorator/custom-repository.decorator';
import { DeepPartial, Repository } from 'typeorm';
import { StorePurchaseHistory } from '../entity/store-purchase-history.entity';
import { SettlementListType } from '@settle/settle.constant';

@CustomRepository(StorePurchaseHistory)
export class StorePurchaseHistoryRepository extends Repository<StorePurchaseHistory> {
  async insertNotReload(entities: DeepPartial<StorePurchaseHistory[]>) {
    return await this.createQueryBuilder('storePurchaseHistory')
      .insert()
      .values(entities)
      .updateEntity(false)
      .execute();
  }
  
  async findByListType(type: SettlementListType) {
    let whereQuery = '';
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
    return await this.createQueryBuilder('storePurchaseHistory')
      .where(`${whereQuery}`)
      .select([
        
      ])
      .getRawMany();
  }
}
