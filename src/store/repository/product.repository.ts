import { CustomRepository } from '@common/decorator/custom-repository.decorator';
import { Repository } from 'typeorm';
import { Product } from '../entity/product.entity';

@CustomRepository(Product)
export class ProductRepository extends Repository<Product> {}
