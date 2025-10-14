import { Injectable, Logger } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';

@Injectable()
export class AppUpdate {
  private readonly logger = new Logger(AppUpdate.name);

  @SlashCommand({
    name: 'ping',
    description: 'Replies with pong!',
    defaultMemberPermissions: ["Administrator"]
  })
  public async onPing(@Context() [interaction]: SlashCommandContext) {
    this.logger.log('Ping command triggered');
    await interaction.reply('🏓 Pong!');
  }
}
