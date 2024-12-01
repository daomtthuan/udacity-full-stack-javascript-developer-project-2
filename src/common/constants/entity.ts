/** Entity status. */
export const enum EntityStatus {
  Active = 'active',
  Inactive = 'inactive',
  Deleted = 'deleted',
}

/** Order stage. */
export const enum OrderStage {
  Created = 'created',
  Pending = 'pending',
  Confirmed = 'confirmed',
  Processing = 'processing',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
  Returned = 'returned',
}
