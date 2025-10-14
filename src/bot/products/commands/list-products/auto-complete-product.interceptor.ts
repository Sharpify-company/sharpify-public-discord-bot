import { formatPrice } from '@/@shared/lib';
import { Sharpify } from '@/@shared/sharpify';
import { Injectable } from '@nestjs/common';
import { AutocompleteInteraction } from 'discord.js';
import { AutocompleteInterceptor } from 'necord';

@Injectable()
export class ProductAutocompleteInterceptor extends AutocompleteInterceptor {
  public async transformOptions(interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused(true);

    const req = await Sharpify.api.v1.catalog.product.list({
      limit: 10,
      page: 1,
      title: focused.value.toString(),
    });
    if (!req.success)
      return interaction.respond([
        {
          name: `Error ao buscar produtos: ${req.errorName}`,
          value: '0',
        },
      ]);

    return interaction.respond(
      req.data.products.map((product) => ({
        name: `${product.info.title}   |  ${formatPrice(product.readonly.lowestPrice)}   |    #${product.shortReference}`,
        value: product.id,
      })),
    );
  }
}
