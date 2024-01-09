import { DynamicModule, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TYPEORM_EX_CUSTOM_REPOSITORY } from './common.constant';

export class TypeOrmExModule {
  public static forCustomRepository<T extends new (...args: any[]) => any>(
    repositories: T[]
  ): DynamicModule {
    const providers: Provider[] = [];
    
    for (const repository of repositories) {
      const baseEntity = Reflect.getMetadata(TYPEORM_EX_CUSTOM_REPOSITORY, repository);
      if (!baseEntity) {
        continue;
      }
      providers.push({
        inject: [getDataSourceToken()],
        provide: repository,
        useFactory: (dataSource: DataSource): typeof repository => {
          const baseRepository = dataSource.getRepository<any>(baseEntity);
          return new repository(
            baseRepository.target,
            baseRepository.manager,
            baseRepository.queryRunner,
          );
        },
      });
    }
    
    return {
      exports: providers,
      module: TypeOrmExModule,
      providers,
    };
  }
}
