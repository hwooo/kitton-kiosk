import { Body, Controller, Post } from '@nestjs/common';
import { StoreService } from './store.service';
import { UserRole } from '@user/user.constant';
import { Roles } from '@common/decorator/roles.decorator';

@Controller('store/seller')
@Roles(UserRole.Admin, UserRole.Seller)
export class StoreSellerController {
  constructor(
    private storeService: StoreService,
  ) {}
  
  
}

@Controller('store/customer')
@Roles(UserRole.Admin, UserRole.Seller)
export class StoreCustomerController {
  constructor(
    private storeService: StoreService,
  ) {}
  
  
}
