import { IsNumber, IsEnum } from 'class-validator';
import { SettlementListType } from '../settle.constant';

export class GetSettlementRevenueDto {
  @IsEnum(SettlementListType)
  type: SettlementListType;
}
