import { User } from '@user/entity/user.entity';
import { Product } from './product.entity';
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
export class ProductPurchaseHistory {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Index()
  @Column({ name: 'product_id' })
  productId: number;
  
  @ManyToOne(() => Product, (target) => target.productPurchaseHistories, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'product_id',
  })
  product: Product;
  
  @Index()
  @Column()
  paymentPrice: number;
  
  @Index()
  @Column({ name: 'customer_user_id' })
  customerUserId: number;
  
  @ManyToOne(() => User, (target) => target.productPurchaseHistories, {
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
