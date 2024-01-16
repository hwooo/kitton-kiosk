import { ProductType } from '../product.constant';
import { ProductPurchaseHistory } from './product-purchase-history.entity';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  DeleteDateColumn,
  Entity,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Index({ unique: true })
  @Column({ length: 40 })
  productUuid: string;
  
  @Index()
  @Column()
  productType: ProductType;
  
  @Column()
  productIndex: number;
  
  @Column()
  productName: string;
  
  @Column({ default: 0 })
  amount: number;
  
  @Column()
  price: number;
  
  @CreateDateColumn({ select: false })
  createdTime: Date;
  
  @UpdateDateColumn({ select: false })
  updatedTime: Date;
  
  @DeleteDateColumn()
  deletedTime: Date;
  
  @OneToMany(() => ProductPurchaseHistory, (target) => target.product, {
    cascade: ['insert', 'update'],
  })
  productPurchaseHistories: ProductPurchaseHistory[];
}
