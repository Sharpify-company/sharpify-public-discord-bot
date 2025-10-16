import { ProductEntity } from "../entities";
import { sqlite } from "../sqlite";

const tableName = "products";

// CREATE TABLE "products" (
// 	"id"	TEXT,
// 	"productProps"	TEXT,
// 	"channelsLinked"	TEXT,
// 	PRIMARY KEY("id")
// );

class ProductRepository {
	async create(productEntity: ProductEntity): Promise<void> {
		const insert = sqlite.prepare(`
      INSERT INTO ${tableName} (id, productProps, channelsLinked)
        VALUES (
          ?,
          ?,
          ?
        )     
      `);
		insert.run(productEntity.id, JSON.stringify(productEntity.productProps), JSON.stringify(productEntity.channelsLinked));
	}

	async findById(id: string): Promise<ProductEntity | null> {
		const select = sqlite.prepare(`
      SELECT * FROM ${tableName} WHERE id = ?
    `);
		const row = select.get(id) as any;
		if (!row) return null;
		return new ProductEntity({
			id: row.id,
			productProps: JSON.parse(row.productProps),
			channelsLinked: JSON.parse(row.channelsLinked),
		});
	}

	async update(productEntity: ProductEntity): Promise<void> {
		const update = sqlite.prepare(`
        UPDATE ${tableName}
        SET 
            productProps = ?,
            channelsLinked = ?
        WHERE id = ?
    `);
		update.run(JSON.stringify(productEntity.productProps), JSON.stringify(productEntity.channelsLinked), productEntity.id);
		return Promise.resolve();
	}

	async delete(id: string): Promise<void> {
		const del = sqlite.prepare(`
	  DELETE FROM ${tableName} WHERE id = ?
	`);
		del.run(id);
		return Promise.resolve();
	}
}

export async function getProductRepository(): Promise<ProductRepository> {
	return new ProductRepository();
}
