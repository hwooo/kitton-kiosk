import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { In, MoreThan } from 'typeorm';
import { Transactional, Propagation } from 'typeorm-transactional';
import { ProductRepository } from './repository/product.repository';
import { ProductPurchaseHistory } from './entity/product-purchase-history.entity';
import { ProductPurchaseHistoryRepository } from './repository/product-purchase-history.repository';
import { StoreMessageCode } from './product.constant';
import { UserInterface } from '@user/user.interface';
import { v4 as uuidv4 } from 'uuid';
import {
  RegisterProductDto,
  UpdateProductDto,
  DeleteProductDto,
  PurchaseProductDto,
  RegisterProductOutput,
  UpdateProductOutput,
  DeleteProductOutput,
  PurchaseProductOutput,
} from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productPurchaseHistoryRepository: ProductPurchaseHistoryRepository,
  ) {}
  
  @Transactional({ propagation: Propagation.NESTED })
  async registerProduct(
    currentUser: UserInterface,
    dto: RegisterProductDto,
  ): Promise<RegisterProductOutput> {
    if (currentUser.userId !== dto.userId) {
      throw new HttpException(
        `user doesn't exist`,
        HttpStatus.FORBIDDEN,
      );
    }
    
    const product = this.productRepository.create();
    product.productUuid = uuidv4();
    product.productType = dto.productType;
    product.productIndex = dto.productIndex;
    product.amount = dto.amount;
    product.price = dto.price;
    
    await this.productRepository.save(product);
    
    return {
      isSuccess: true,
      messageCode: StoreMessageCode.Complete,
      storeUuid: product.productUuid,
      storeId: product.id,
    };
  }
  
  @Transactional({ propagation: Propagation.NESTED })
  async updateProduct(
    currentUser: UserInterface,
    dto: UpdateProductDto,
  ): Promise<UpdateProductOutput> {
    if (currentUser.userId !== dto.userId) {
      throw new HttpException(
        `user doesn't exist`,
        HttpStatus.FORBIDDEN,
      );
    }
    
    const targetProduct = await this.productRepository.findOne({
      where: {
        productUuid: dto.storeUuid,
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
    
    await this.productRepository.save(
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
    dto: DeleteProductDto,
  ): Promise<DeleteProductOutput> {
    if (currentUser.userId !== dto.userId) {
      throw new HttpException(
        `user doesn't exist`,
        HttpStatus.FORBIDDEN,
      );
    }
    
    const targetProduct = await this.productRepository.findOne({
      where: {
        productUuid: dto.storeUuid,
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
    
    const deleteResult = await this.productRepository.softDelete({
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
    
    const targetProducts = await this.productRepository.find({
      where: {
        productUuid: In(dto.purchaseBundle.map((el) => el.storeUuid)),
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
    const purchaseHistories: ProductPurchaseHistory[] = [];
    
    for (const product of targetProducts) {
      const currentBundle = dto.purchaseBundle.find(
        (el) => el.storeUuid == product.productUuid,
      );
      
      if (!currentBundle) {
        throw new HttpException(
          `invalid storeUuid (${product.productUuid})`,
          HttpStatus.FORBIDDEN,
        );
      }
      
      product.amount -= currentBundle.purchaseAmount;
      const paymentPrice = product.price * currentBundle.purchaseAmount;
      purchases.push({
        storeId: product.id,
        paymentPrice: paymentPrice,
      });
      
      const purchaseHistory = new ProductPurchaseHistory();
      purchaseHistory.productId = product.id;
      purchaseHistory.customerUserId = currentUser.userId;
      purchaseHistory.paymentPrice = paymentPrice;
      purchaseHistories.push(purchaseHistory);
    }
    
    await this.productPurchaseHistoryRepository.insertNotReload(
      purchaseHistories,
    );
    
    await this.productRepository.save(
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
