export class DiscordUserEntity {
  id!: string;
  cartChannelId!: string | null;
  cartMessageId!: string | null;

  constructor(props: DiscordUserEntity.Props) {
    Object.assign(this, props);
  }

  static createFromDatabase(row: DiscordUserEntity.Props): DiscordUserEntity {
    return new DiscordUserEntity({
      id: row.id,
      cartChannelId: row.cartChannelId,
      cartMessageId: row.cartMessageId,
    });
  }

  static create(props: DiscordUserEntity.Input) {
    const defaultProps: DiscordUserEntity.Props = {
      ...props,
      cartChannelId: null,
      cartMessageId: null,
    };
    return new DiscordUserEntity(defaultProps);
  }
}

export namespace DiscordUserEntity {
  export type Input = {
    id: string;
  };

  export type Props = {
    id: string;
    cartChannelId: string | null;
    cartMessageId: string | null;
  };
}
