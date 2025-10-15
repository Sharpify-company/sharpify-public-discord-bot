export class DiscordUserEntity {
  id!: string;
  cartChannelId!: string | null;
  cartMessageId!: string | null;

  constructor(props: DiscordUserEntity.Input) {
    const defaultProps: DiscordUserEntity.Props = {
      ...props,
      cartChannelId: null,
      cartMessageId: null,
    };
    Object.assign(this, defaultProps);
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
