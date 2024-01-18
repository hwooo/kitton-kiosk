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
    
    const revenues = await this.productPurchaseHistoryRepository.findByListType(
      dto.type,
      dto.offset,
    );
    
    revenues.forEach((revenue) => {
      revenue.profit = Math.floor(revenue.paymentPrice * 0.9);
      revenue.tax = Math.floor(revenue.paymentPrice * 0.1);
    });
    
    const total = { profitSum: 0, taxSum: 0, paymentPriceSum: 0 };
    
    total.profitSum = revenues.reduce((acc, now) => acc + now.profit, 0);
    total.taxSum = revenues.reduce((acc, now) => acc + now.tax, 0);
    total.paymentPriceSum = revenues.reduce((acc, now) => acc + now.paymentPrice, 0);
    
    return {
      revenues: revenues,
      total: total,
    };
  }
}
