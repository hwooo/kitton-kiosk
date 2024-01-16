import { Injectable } from '@nestjs/common';
import { Transactional, Propagation } from 'typeorm-transactional';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserInterface } from '@user/user.interface';
import { ProductPurchaseHistoryRepository } from '@store/repository/product-purchase-history.repository';
import { SettlementMessageCode } from './settle.constant';
import { GetSettlementRevenueDto } from './dto/settle.dto';

@Injectable()
export class SettleService {
  constructor(
    private readonly productPurchaseHistoryRepository: ProductPurchaseHistoryRepository,
  ) {}
  
  async getRevenue(dto: GetSettlementRevenueDto) {
    const purchases = await this.productPurchaseHistoryRepository.findByListType(
      dto.type,
      dto.type,
    );
    
    
  }
  
  
}
