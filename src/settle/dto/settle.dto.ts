import { IsNumber, IsEnum } from 'class-validator';
import { SettlementListType } from '../settle.constant';

export class GetSettlementRevenueDto {
  @IsNumber()
  userId: number;
  
  @IsEnum(SettlementListType)
  type: SettlementListType;
  
  @IsNumber()
  offset: number;
}
