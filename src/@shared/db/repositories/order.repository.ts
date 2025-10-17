import { OrderEntity } from "../entities";
import { sqlite } from "../sqlite";

const tableName = "orders";

// CREATE TABLE "orders" (
// 	"id"	TEXT,
// 	"orderProps"	TEXT,
// 	"customerId"	TEXT,
// 	"deliveryStatus"	TEXT,
// 	PRIMARY KEY("id")
// );

class OrdersRepository {
	async create(orderEntity: OrderEntity): Promise<void> {
		const insert = sqlite.prepare(`
        INSERT INTO ${tableName} (id, orderProps, customerId, deliveryStatus)
            VALUES (
            ?,
            ?,
            ?,
            ?
            )     
        `);
		insert.run(orderEntity.id, JSON.stringify(orderEntity.orderProps), orderEntity.customerId, orderEntity.deliveryStatus);
	}

	async findById(id: string): Promise<OrderEntity | null> {
		const select = sqlite.prepare(`
      SELECT * FROM ${tableName} WHERE id = ?
    `);
		const row = select.get(id) as any;
		if (!row) return null;
		return new OrderEntity({
			id: row.id,
			orderProps: JSON.parse(row.orderProps),
			customerId: row.customerId,
			deliveryStatus: row.deliveryStatus as OrderEntity.DeliveryStatus,
		});
	}

	async listAllPendingDelivery(): Promise<OrderEntity[]> {
		const select = sqlite.prepare(`
	  SELECT * FROM ${tableName} WHERE deliveryStatus = 'PREPARING_DELIVERY'
	`);
		const rows = select.all() as any[];
		return rows.map(
			(row) =>
				new OrderEntity({
					id: row.id,
					orderProps: JSON.parse(row.orderProps),
					customerId: row.customerId,
					deliveryStatus: row.deliveryStatus as OrderEntity.DeliveryStatus,
				}),
		);
	}

	async update(orderEntity: OrderEntity): Promise<void> {
		const update = sqlite.prepare(`
        UPDATE ${tableName}
        SET 
            orderProps = ?,
            customerId = ?,
            deliveryStatus = ?
        WHERE id = ?
    `);
		update.run(JSON.stringify(orderEntity.orderProps), orderEntity.customerId, orderEntity.deliveryStatus, orderEntity.id);
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

export async function getOrderRepository(): Promise<OrdersRepository> {
	return new OrdersRepository();
}
