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
  
  @IsString()
  productName: string;
  
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
  productUuid: string;
  
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
  productUuid: string;
}

export class PurchaseProductBundle {
  productUuid: string;
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
  productUuid: string;
  productId: number;
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
