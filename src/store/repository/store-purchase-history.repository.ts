import { CustomRepository } from '@common/decorator/custom-repository.decorator';
import { Repository } from 'typeorm';
import { StorePurchaseHistory } from '../entity/store-purchase-history.entity';

@CustomRepository(StorePurchaseHistory)
export class StorePurchaseHistoryRepository extends Repository<StorePurchaseHistory> {}
