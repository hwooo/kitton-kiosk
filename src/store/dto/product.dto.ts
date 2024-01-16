import { ProductType } from '../product.constant';
import {
  IsNumber,
  IsString,
  IsArray,
  Min,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class RegisterProductDto {
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

export class UpdateProductDto {
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

export class DeleteProductDto {
  @IsNumber()
  userId: number;
  
  @IsString()
  storeUuid: string;
}

export class PurchaseProductBundle {
  @IsNumber()
  storeUuid: string;
  
  @IsNumber()
  purchaseAmount: number;
}

export class PurchaseProductDto {
  @IsNumber()
  userId: number;
  
  @IsArray()
  purchaseBundle: PurchaseProductBundle[];
}

export class RegisterProductOutput {
  isSuccess: boolean;
  messageCode: number;
  storeUuid: string;
  storeId: number;
}

export class UpdateProductOutput {
  isSuccess: boolean;
  messageCode: number;
}

export class DeleteProductOutput {
  isSuccess: boolean;
  messageCode: number;
}

export class PurchaseProductOutput {
  isSuccess: boolean;
  messageCode: number;
  totalPaymentPrice: number;
}
