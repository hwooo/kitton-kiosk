import { Injectable } from '@nestjs/common';
import { Transactional, Propagation } from 'typeorm-transactional';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserInterface } from '@user/user.interface';
import { ProductPurchaseHistoryRepository } from '@product/repository/product-purchase-history.repository';
import { GetSettlementRevenueDto } from './dto/settle.dto';

@Injectable()
export class SettleService {
  constructor(
    private readonly productPurchaseHistoryRepository: ProductPurchaseHistoryRepository,
  ) {}
  
  async getRevenue(currentUser: UserInterface, dto: GetSettlementRevenueDto) {
    if (currentUser.userId !== dto.userId) {
      throw new HttpException(
        `user doesn't exist`,
        HttpStatus.FORBIDDEN,
      );
    }
    
    const purchases = await this.productPurchaseHistoryRepository.findByListType(
      dto.type,
      dto.type,
      dto.offset,
    );
    
    
  }
}
