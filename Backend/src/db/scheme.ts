import {text,pgTable,timestamp,uuid,serial,varchar, pgEnum,boolean,integer,decimal} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm";


export const userRoleEnum=pgEnum('user_role',['customer','admin','staff']);
export const addressTypeEnum =pgEnum('address_type',['shipping','billing',]);
export const orderStatusEnum = pgEnum('order_status',['pending','proccess','shipped'])





export const users = pgTable("users",{
    id:uuid('id').primaryKey().defaultRandom(),
    email:varchar('email',{length:255}).notNull().unique(),
    password:varchar('password',{length:255}).notNull(),
    firstName:varchar('first_name',{length:100}),
    lastName:varchar('last_name',{length:100}),
    phoneNumber:varchar('phone_number',{length:20}),
    role:userRoleEnum('role').default('customer').notNull(),
    imageurl:text('imageurl'),
    createdAt:timestamp("created_at",{mode:'date'}).notNull().defaultNow(),
    updateAt:timestamp("update_at",{mode:'date'}).notNull().defaultNow(),
    
})


export const products =pgTable('products',{
    id:uuid('id').defaultRandom().primaryKey(),
    description:text('description').notNull(),
    price:text('price').notNull(),
    title:text('title').notNull(),
    userId:text('user_id')
    .notNull()
    .references(()=>users.id ,{onDelete:'cascade'}),//Bu funksiya iki tablisany baglanyşdyrýar haçanda aýrylan wagtynda tutuş pozulyar.
    brandId:integer('brand_id')
    .references(()=>brands.id,{onDelete:"set null"}),
    categoryId:integer('category_id')
    .notNull()
    .references(()=>categories.id,{onDelete:"restrict"}),
    isActive:boolean('is_active').default(true).notNull(),
    createdAt:timestamp("created_at",{mode:'date'}).notNull().defaultNow(),// Bu bölek produktyň döredilen wagtyny görkezýär.
    updateAt:timestamp("update_at",{mode:'date'}).notNull().defaultNow(),//Bu bölek şol produktyň update bolan wagtyny görkezýar
})


export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => productVariant.id, { onDelete: "set null" }),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  displayOrder: integer("display_order").default(0).notNull()
})

export const userAddresses = pgTable('user_addresses',{
    id:uuid('id').primaryKey().defaultRandom(),
    userId:uuid('user_id').notNull().
    references(()=>users.id,{onDelete:"cascade"}),
    addresType:addressTypeEnum('address_type').notNull(),
    streetAddress:varchar('street_type',{length:255}).notNull(),
    city:varchar('city',{length:100}).notNull(),
    state:varchar('state',{length:100}).notNull(),
    postalCode:varchar('postal_code',{length:255}).notNull(),
    country:varchar('country',{length:100}).notNull(),
    isDefault:boolean('is_default').default(false).notNull(),
})


export const categories = pgTable('categories',{
    id:uuid('id').primaryKey(),
    parentId:uuid('parent_id'),
    name:varchar('name',{length:100}).notNull(),
    slug:varchar('slug',{length:100}).unique().notNull(),
    description:text('description')
})


export const brands = pgTable('brands',{
    id:uuid('id').primaryKey(),
    name:varchar("name",{length:100}),
    logoUrl:varchar('logo_url',{length:500})
})


export const productVariant = pgTable('product_variant',{
    id:uuid('id').primaryKey().defaultRandom(),
    productId:uuid('product_id')
    .notNull()
    .references(()=>products.id,{onDelete:'cascade'}),
    size: varchar("size",{length:50}),
    color: varchar("color",{length:50}),
    priceOverride: decimal("price_override", { precision: 10, scale: 2 }),
    stockQuantity: integer("stock_quantity").default(0).notNull(),
    weightKg: decimal("weight_kg", { precision: 5, scale: 2 }),
    tireWidth: varchar("tire_width", { length: 50 }),
})


export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").notNull().references(() => productVariant.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
});


export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  orderStatus: orderStatusEnum("order_status").default("pending").notNull(),
  shippingFee: decimal("shipping_fee", { precision: 10, scale: 2 }).default("0.00").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingAddressId: uuid("shipping_address_id").notNull().references(() => userAddresses.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});


export const comments = pgTable('comments', {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), 
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});


// --- Relations.


export const usersRelations = relations(users,({many})=>({
    addresses:many(userAddresses),
    orders:many(orders),
    comments:many(comments)
}))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "category_parent",
  }),
  subcategories: many(categories, { relationName: "category_parent" }),
  products: many(products),
}));


export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));


export const productsRelations = relations(products, ({ one, many }) => ({
  user: one(users, { fields: [products.userId], references: [users.id] }),
  brand: one(brands, { fields: [products.brandId], references: [brands.id] }),
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  variants: many(productVariant),
  image: many(productImages),
  comments:many(comments),
}));


export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productVariantsRelations = relations(productVariant, ({ one, many }) => ({
  product: one(products, { fields: [productVariant.productId], references: [products.id] }),
  images: many(productImages),
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  shippingAddress: one(userAddresses, { fields: [orders.shippingAddressId], references: [userAddresses.id] }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  variant: one(productVariant, { fields: [orderItems.variantId], references: [productVariant.id] }),
}));



  





// Tablisa Maglumat goşmak we Tablisany funksiýada ulanmak üçin we koduň typesafe maksatda ulanylýar.
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;


export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;


export type ProductImages = typeof productImages.$inferSelect;
export type NewProductImages = typeof productImages.$inferInsert;


export type UserAddresses = typeof userAddresses.$inferSelect;
export type NewUserAddresses = typeof userAddresses.$inferInsert;


export type Categories = typeof categories.$inferSelect;
export type NewCategories = typeof categories.$inferInsert;


export type Brands = typeof brands.$inferSelect;
export type NewBrands = typeof brands.$inferInsert;


export type ProductVariant = typeof productVariant.$inferSelect;
export type NewProductVariant = typeof productVariant.$inferInsert;


export type OrderItems = typeof orderItems.$inferSelect;
export type NewOrderItems = typeof orderItems.$inferInsert;


export type Orders = typeof orders.$inferSelect;
export type NewOrders = typeof orders.$inferInsert;


export type Comments = typeof comments.$inferSelect;
export type NewComments = typeof comments.$inferInsert;






