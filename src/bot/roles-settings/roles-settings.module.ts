import { Module } from '@nestjs/common';
import { ConfigureRolesModule } from './commands/configure-roles/configure-roles.module';

@Module({
  imports: [ConfigureRolesModule],
  controllers: [],
  providers: [],
})
export class RoleSettingsModule {}
