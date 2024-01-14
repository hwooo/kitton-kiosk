import { ProductType } from '../store.constant';
import { StorePurchaseHistory } from './store-purchase-history.entity';
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
export class Store {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Index({ unique: true })
  @Column({ length: 40 })
  storeUuid: string;
  
  @Index()
  @Column({ type: 'enum', enum: ProductType })
  productType: ProductType;
  
  @Column()
  productIndex: number;
  
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
  
  @OneToMany(() => StorePurchaseHistory, (target) => target.store, {
    cascade: ['insert', 'update'],
  })
  storePurchaseHistories: StorePurchaseHistory[];
}
