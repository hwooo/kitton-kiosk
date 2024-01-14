import { Body, Controller, Post, Patch, Delete } from '@nestjs/common';
import { StoreService } from './store.service';
import {
  RegisterStoreProductDto,
  UpdateStoreProductDto,
  DeleteStoreProductDto,
  PurchaseProductDto,
} from './dto/store.dto';
import { UserInterface } from '@user/user.interface';
import { CurrentUser } from '@common/decorator/current-user.decorator';
import { UserRole } from '@user/user.constant';
import { Roles } from '@common/decorator/roles.decorator';

@Controller('store/seller')
@Roles(UserRole.Admin, UserRole.Seller)
export class StoreSellerController {
  constructor(
    private storeService: StoreService,
  ) {}
  
  @Post('registerProduct')
  async registerProduct(
    @CurrentUser() currentUser: UserInterface,
    @Body() dto: RegisterStoreProductDto,
  ) {
    return this.storeService.registerProduct(currentUser, dto);
  }
  
  @Patch('updateProduct')
  async updateProduct(
    @CurrentUser() currentuser: UserInterface,
    @Body() dto: UpdateStoreProductDto,
  ) {
    return this.storeService.updateProduct(currentuser, dto);
  }
  
  @Delete('deleteProduct')
  async deleteProduct(
    @CurrentUser() currentUser: UserInterface,
    @Body() dto: DeleteStoreProductDto,
  ) {
    return this.storeService.deleteProduct(currentUser, dto);
  }
}

@Controller('store/customer')
@Roles(UserRole.Admin, UserRole.Customer)
export class StoreCustomerController {
  constructor(
    private storeService: StoreService,
  ) {}
  
  @Post('purchaseProduct')
  async purchaseProduct(
    @CurrentUser() currentUser: UserInterface,
    @Body() dto: PurchaseProductDto,
  ) {
    return this.storeService.purchaseProduct(currentUser, dto);
  }
}
