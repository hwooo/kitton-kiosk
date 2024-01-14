import { CustomRepository } from '@common/decorator/custom-repository.decorator';
import { DeepPartial, Repository } from 'typeorm';
import { StorePurchaseHistory } from '../entity/store-purchase-history.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@CustomRepository(StorePurchaseHistory)
export class StorePurchaseHistoryRepository extends Repository<StorePurchaseHistory> {
  async insertNotReload(entities: DeepPartial<StorePurchaseHistory[]>) {
    return await this.createQueryBuilder('storePurchaseHistory')
      .insert()
      .values(entities)
      .updateEntity(false)
      .execute();
  }
}
