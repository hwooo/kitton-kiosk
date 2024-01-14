import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { In, MoreThan } from 'typeorm';
import { Transactional, Propagation } from 'typeorm-transactional';
import { StoreRepository } from './repository/store.repository';
import { StorePurchaseHistory } from './entity/store-purchase-history.entity';
import { StorePurchaseHistoryRepository } from './repository/store-purchase-history.repository';
import { StoreMessageCode } from './store.constant';
import { UserInterface } from '@user/user.interface';
import { v4 as uuidv4 } from 'uuid';
import {
  RegisterStoreProductDto,
  UpdateStoreProductDto,
  DeleteStoreProductDto,
  PurchaseProductDto,
  RegisterStoreProductOutput,
  UpdateStoreProductOutput,
  DeleteStoreProductOutput,
  PurchaseProductOutput,
} from './dto/store.dto';

@Injectable()
export class StoreService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly storePurchaseHistoryRepository: StorePurchaseHistoryRepository,
  ) {}
  
  @Transactional({ propagation: Propagation.NESTED })
  async registerProduct(
    currentUser: UserInterface,
    dto: RegisterStoreProductDto,
  ): Promise<RegisterStoreProductOutput> {
    if (currentUser.userId !== dto.userId) {
      throw new HttpException(
        `user doesn't exist`,
        HttpStatus.FORBIDDEN,
      );
    }
    
    const product = this.storeRepository.create();
    product.storeUuid = uuidv4();
    product.productType = dto.productType;
    product.productIndex = dto.productIndex;
    product.amount = dto.amount;
    product.price = dto.price;
    
    await this.storeRepository.save(product);
    
    return {
      isSuccess: true,
      messageCode: StoreMessageCode.Complete,
      storeUuid: product.storeUuid,
      storeId: product.id,
    };
  }
  
  @Transactional({ propagation: Propagation.NESTED })
  async updateProduct(
    currentUser: UserInterface,
    dto: UpdateStoreProductDto,
  ): Promise<UpdateStoreProductOutput> {
    if (currentUser.userId !== dto.userId) {
      throw new HttpException(
        `user doesn't exist`,
        HttpStatus.FORBIDDEN,
      );
    }
    
    const targetProduct = await this.storeRepository.findOne({
      where: {
        storeUuid: dto.storeUuid,
      },
    });
    
    if (!targetProduct) {
      return {
        isSuccess: false,
        messageCode: StoreMessageCode.NotExistProduct,
      };
    }
    
    targetProduct.amount = dto.amount !== -1 ? dto.amount : targetProduct.amount;
    targetProduct.price = dto.price !== -1 ? dto.price : targetProduct.price;
    
    await this.storeRepository.save(
      targetProduct,
      { reload: false },
    );
    
    return {
      isSuccess: true,
      messageCode: StoreMessageCode.Complete,
    };
  }
  
  @Transactional({ propagation: Propagation.NESTED })
  async deleteProduct(
    currentUser: UserInterface,
    dto: DeleteStoreProductDto,
  ): Promise<DeleteStoreProductOutput> {
    if (currentUser.userId !== dto.userId) {
      throw new HttpException(
        `user doesn't exist`,
        HttpStatus.FORBIDDEN,
      );
    }
    
    const targetProduct = await this.storeRepository.findOne({
      where: {
        storeUuid: dto.storeUuid,
      },
      select: [
        'id',
      ],
    });
    
    if (!targetProduct) {
      return {
        isSuccess: false,
        messageCode: StoreMessageCode.NotExistProduct,
      };
    }
    
    const deleteResult = await this.storeRepository.softDelete({
      id: targetProduct.id,
    });
    
    if (deleteResult.affected < 1) {
      return {
        isSuccess: false,
        messageCode: StoreMessageCode.AlreadyRemoved,
      };
    }
    
    return {
      isSuccess: true,
      messageCode: StoreMessageCode.Complete,
    };
  }
  
  @Transactional({ propagation: Propagation.NESTED })
  async purchaseProduct(
    currentUser: UserInterface,
    dto: PurchaseProductDto,
  ): Promise<PurchaseProductOutput> {
    if (currentUser.userId !== dto.userId) {
      throw new HttpException(
        `user doesn't exist`,
        HttpStatus.FORBIDDEN,
      );
    }
    
    const targetProducts = await this.storeRepository.find({
      where: {
        storeUuid: In(dto.purchaseBundle.map((el) => el.storeUuid)),
        amount: MoreThan(0),
      },
      lock: {
        mode: 'pessimistic_partial_write',
      },
    });
    
    if (targetProducts.length !== dto.purchaseBundle.length) {
      return {
        isSuccess: false,
        messageCode: StoreMessageCode.OutOfStock,
        totalPaymentPrice: 0,
      };
    }
    
    const purchases: { storeId: number; paymentPrice: number; }[] = [];
    const purchaseHistories: StorePurchaseHistory[] = [];
    
    for (const product of targetProducts) {
      const currentBundle = dto.purchaseBundle.find(
        (el) => el.storeUuid == product.storeUuid,
      );
      
      if (!currentBundle) {
        throw new HttpException(
          `invalid storeUuid (${product.storeUuid})`,
          HttpStatus.FORBIDDEN,
        );
      }
      
      product.amount -= currentBundle.purchaseAmount;
      const paymentPrice = product.price * currentBundle.purchaseAmount;
      purchases.push({
        storeId: product.id,
        paymentPrice: paymentPrice,
      });
      
      const purchaseHistory = new StorePurchaseHistory();
      purchaseHistory.storeId = product.id;
      purchaseHistory.customerUserId = currentUser.userId;
      purchaseHistory.productType = product.productType;
      purchaseHistory.productIndex = product.productIndex;
      purchaseHistory.paymentPrice = paymentPrice;
      purchaseHistories.push(purchaseHistory);
    }
    
    await this.storePurchaseHistoryRepository.insertNotReload(
      purchaseHistories,
    );
    
    await this.storeRepository.save(
      targetProducts,
      { reload: false },
    );
    
    const totalPaymentPrice = purchases.reduce(
      (acc, now) => acc + now.paymentPrice, 0,
    );
    
    return {
      isSuccess: true,
      messageCode: StoreMessageCode.Complete,
      totalPaymentPrice: totalPaymentPrice,
    };
  }
}
