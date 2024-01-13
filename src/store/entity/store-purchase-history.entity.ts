import { ProductType } from '../store.constant';
import { User } from '@user/entity/user.entity';
import { Store } from './store.entity';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Entity,
} from 'typeorm';

@Entity()
export class StorePurchaseHistory {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Index()
  @Column({ name: 'store_id' })
  storeId: number;
  
  @ManyToOne(() => Store, (target) => target.storePurchaseHistories, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'store_id',
  })
  store: Store;
  
  @Column({ type: 'enum', enum: ProductType })
  productType: ProductType;
  
  @Column()
  productIndex: number;
  
  @Index()
  @Column()
  paymentPrice: number;
  
  @Index()
  @Column({ name: 'customer_user_id' })
  customerUserId: number;
  
  @ManyToOne(() => User, (target) => target.storePurchaseHistories, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'customer_user_id',
  })
  user: User;
  
  @CreateDateColumn({ select: false })
  createdTime: Date;
  
  @UpdateDateColumn({ select: false })
  updatedTime: Date;
}
