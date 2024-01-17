import { UserRole } from '../user.constant';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductPurchaseHistory } from '@product/entity/product-purchase-history.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Index({ unique: true })
  @Column({ length: 40 })
  uuid: string;
  
  @Exclude()
  @Column()
  password: string;
  
  @Exclude()
  @Column({ nullable: true })
  refreshToken?: string;
  
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Customer,
  })
  role: UserRole;
  
  @Column({ default: '1.0.0' })
  clientVersion: string;
  
  @Column()
  language: string;
  
  @OneToMany(() => ProductPurchaseHistory, (target) => target.user, {
    cascade: ['insert', 'update'],
  })
  productPurchaseHistories: ProductPurchaseHistory[];
  
  @CreateDateColumn()
  createdTime: Date;
  
  @UpdateDateColumn()
  updatedTime: Date;
}
