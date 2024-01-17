import { Body, Controller, Post } from '@nestjs/common';
import { SettleService } from './settle.service';
import { UserInterface } from '@user/user.interface';
import { CurrentUser } from '@common/decorator/current-user.decorator';
import { UserRole } from '@user/user.constant';
import { Roles } from '@common/decorator/roles.decorator';
import { GetSettlementRevenueDto } from './dto/settle.dto';

@Controller('settle')
@Roles(UserRole.Admin, UserRole.Seller)
export class SettleController {
  constructor(
    private settleService: SettleService,
  ) {}
  
  @Post('getRevenue')
  async getRevenue(
    @CurrentUser() currentUser: UserInterface,
    @Body() dto: GetSettlementRevenueDto,
  ) {
    return this.settleService.getRevenue(currentUser, dto);
  }
}
