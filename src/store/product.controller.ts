import { Body, Controller, Post, Patch, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import {
  RegisterProductDto,
  UpdateProductDto,
  DeleteProductDto,
  PurchaseProductDto,
} from './dto/product.dto';
import { UserInterface } from '@user/user.interface';
import { CurrentUser } from '@common/decorator/current-user.decorator';
import { UserRole } from '@user/user.constant';
import { Roles } from '@common/decorator/roles.decorator';

@Controller('product/seller')
@Roles(UserRole.Admin, UserRole.Seller)
export class ProductSellerController {
  constructor(
    private storeService: ProductService,
  ) {}
  
  @Post('registerProduct')
  async registerProduct(
    @CurrentUser() currentUser: UserInterface,
    @Body() dto: RegisterProductDto,
  ) {
    return this.storeService.registerProduct(currentUser, dto);
  }
  
  @Patch('updateProduct')
  async updateProduct(
    @CurrentUser() currentuser: UserInterface,
    @Body() dto: UpdateProductDto,
  ) {
    return this.storeService.updateProduct(currentuser, dto);
  }
  
  @Delete('deleteProduct')
  async deleteProduct(
    @CurrentUser() currentUser: UserInterface,
    @Body() dto: DeleteProductDto,
  ) {
    return this.storeService.deleteProduct(currentUser, dto);
  }
}

@Controller('product/customer')
@Roles(UserRole.Admin, UserRole.Customer)
export class ProductCustomerController {
  constructor(
    private storeService: ProductService,
  ) {}
  
  @Post('purchaseProduct')
  async purchaseProduct(
    @CurrentUser() currentUser: UserInterface,
    @Body() dto: PurchaseProductDto,
  ) {
    return this.storeService.purchaseProduct(currentUser, dto);
  }
}
