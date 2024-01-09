import { SetMetadata } from '@nestjs/common';
import { EntitySchema } from 'typeorm';
import { TYPEORM_EX_CUSTOM_REPOSITORY } from '../common.constant';

export function CustomRepository(entity: EntitySchema): ClassDecorator {
  return SetMetadata(TYPEORM_EX_CUSTOM_REPOSITORY, entity);
}
