import { ProductType } from '../store.constant';
import {
  IsNumber,
  IsString,
  Min,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class RegisterStoreProductDto {
  @IsNumber()
  userId: number;
  
  @IsEnum(ProductType)
  productType: ProductType;
  
  @IsNumber()
  productIndex: number;
  
  @IsNumber()
  amount: number;
  
  @IsNumber()
  @Min(0)
  price: number;
}

export class UpdateStoreProductDto {
  @IsNumber()
  userId: number;
  
  @IsString()
  storeUuid: string;
  
  @IsOptional()
  @IsNumber()
  amount?: number = -1;
  
  @IsOptional()
  @IsNumber()
  price?: number = -1;
}

export class DeleteStoreProductDto {
  @IsNumber()
  userId: number;
  
  @IsString()
  storeUuid: string;
}

export class RegisterStoreProductOutput {
  isSuccess: boolean;
  messageCode: number;
  storeUuid: string;
  storeId: number;
}

export class UpdateStoreProductOutput {
  isSuccess: boolean;
  messageCode: number;
}

export class DeleteStoreProductOutput {
  isSuccess: boolean;
  messageCode: number;
}
