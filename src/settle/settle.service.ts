import { Injectable } from '@nestjs/common';
import { Transactional, Propagation } from 'typeorm-transactional';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserInterface } from '@user/user.interface';
import { StorePurchaseHistoryRepository } from '@store/repository/store-purchase-history.repository';
import { SettlementMessageCode } from './settle.constant';
import { GetSettlementRevenueDto } from './dto/settle.dto';

@Injectable()
export class SettleService {
  constructor(
    private readonly storePurchaseHistoryRepository: StorePurchaseHistoryRepository,
  ) {}
  
  async getRevenue(dto: GetSettlementRevenueDto) {
    const purchases = await this.storePurchaseHistoryRepository.findByListType(
      dto.type,
    );
    
    
  }
  
  
}
