import { CustomRepository } from '@common/decorator/custom-repository.decorator';
import { Repository } from 'typeorm';
import { Store } from '../entity/store.entity';

@CustomRepository(Store)
export class StoreRepository extends Repository<Store> {}
