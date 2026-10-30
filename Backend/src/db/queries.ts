import {db} from './connection'
import {eq} from 'drizzle-orm'
import {users, products, productImages,
    userAddresses,categories,brands,
    productVariant, orderItems,orders,comments,
    type NewUser, type NewProduct, type NewProductImages,
    type NewUserAddresses, type NewCategories,type NewBrands,
    type NewProductVariant, type NewOrderItems, type NewOrders,type NewComments,
} from './scheme'
import { isPrimary, } from 'node:cluster'


//Täze Ulanyjy Goşmak Sintaksisi.
export const createUser = async (data:NewUser) =>{
    const [user] = await db.insert(users).values(data).returning()
    return user
}

// Id-syna Laýykgelýan Ulanyjyny Tapyp Berýär.
export const getUserById = async (id:string) => {
    return db.query.users.findFirst({ where:eq(users.id,id)
})}

// Tablisa Girizilen Maglumady Täzelemek.
export const updateUser = async (data:Partial<NewUser>,id:string) => {
    const [user] = await db.update(users).set(data).where(eq(users.id,id)).returning();
    return user
}

//Eger Ulanyjy Bar Bolsa Esasy Maglumata gaytar Ulanyjy Yok Bolsa Taze Ulanyjy Doret.
export const upsertUser = async (data:NewUser) => {
    const existingUser = await getUserById(data.id!);
    if (existingUser){
         return updateUser (data,data.id!)

    }
    return createUser(data)
}


//Product Bölüm Üçin Query.
//Ähli Önümleri We Olaryň Baglanyşykly Maglumatlaryny Getirmek.
export  const createProducts =async (data:NewProduct) =>{
   const [product] = await db.insert(products).values(data).returning();
   return product
};


// Ähli Harytlary Görkez.
export const getAllProducts = async () => {
    return db.query.products.findMany({
        with:{user: true,image:true},
        orderBy: (products, {desc}) => [desc(products.createdAt)]
    })
};


//Harytlary Id  Boýunça Çagyrmak.
export const getProductsById = async (id:string)=>{
    return db.query.products.findFirst({
        where:eq(products.id,id),
        with:{
            description:true,
            comments:{
                with:{user:true},
                orderBy:(comments,{desc}) => [desc(comments.createdAt)]
            }
        }
    })
};

//  Önümiň Islendik Bölegini Täzelemek 
export const updateProductById = async (id:string,data:Partial<NewProduct>) => {
     const [product] = await db.update(products).set(data).where(eq(products.id,id)).returning();
    return product
};


//Comment Goşmak Üçin.
//Comment Goşmak.
export const createComment = async (data:NewComments) =>{
    const [comment] = await db.insert(comments).values(data).returning();
    return comment
};

//Comment-y Pozmak.
export const deleteComment = async (id:string,) => {
     const [comment] = await db.delete(comments).where(eq(comments.id,id)).returning();
    return comment
};

//Comment-y Täzelemek.
export const updateComment = async (id:string,data:NewComments) => {
     const [comment] = await db.update(comments).set(data).where(eq(comments.id,id)).returning();
    return comment
};


// Täze Surat Goşmak.
export const createProductImage = async (data: NewProductImages) => {
    const [image] = await db.insert(productImages).values(data).returning();
    return image;
};


//Bir Önüme Degişli Bolan Ähli Suratlary Getirmek.
export const getAllProductImage = async(productId:string)=>{
    return db.query.productImages.findMany({
        where:eq(productImages.id,productId),
        orderBy:(productImages,{asc}) =>[asc(productImages.displayOrder)]
    })
};


//Suraty Pozmak.
export const deleteProductImage = async (id: string) => {
    const [image] = await db.delete(productImages).where(eq(productImages.id, id)).returning();
    return image;
};


//Öňki Surady Aýyryp Täze Surat Goýmak.
 export const setPrimaryProductImage = async (productId: string, imageId: string) => {
    return await db.transaction(async (db) => {
        await db.update(productImages)
            .set({ isPrimary: false })
            .where(eq(productImages.productId, productId));

        const [updatedImage] = await db.update(productImages)
            .set({ isPrimary: true })
            .where(eq(productImages.id, imageId))
            .returning();

        return updatedImage;
    });
};

// 1. Täze Variant Goşmak Mysal üçin: Gara Reňk, L Ölçeg, 10 Sany Stock.
export const createProductVariant = async (data: NewProductVariant) => {
    const [variant] = await db.insert(productVariant).values(data).returning();
    return variant;
};


// 2. Belli Bir Önümiň ÄHLI Variantlaryny Getirmek.
export const getVariantsByProductId = async (productId: string) => {
return db.query.productVariant.findMany({
where: eq(productVariant.productId, productId),
});
};


// 3. ID Boýunça Ýeke-Täk Varianty Tapmak.
export const getVariantById = async (id: string) => {
return db.query.productVariant.findFirst({
where: eq(productVariant.id, id),
with: {
product: true,  
images: true,  
}
});
};


//Variantyň Maglumatlaryny Stock, Baha, Reňk Täzelemek.
export const updateProductVariant = async (id: string, data: Partial<NewProductVariant>) => {
const [variant] = await db .update(productVariant).set(data).where(eq(productVariant.id, id)).returning();
return variant;
};


//Varianty Pozmak.
export const deleteProductVariant = async (id: string) => {
const [variant] = await db.delete(productVariant).where(eq(productVariant.id, id)).returning();
return variant;
};


// Ulanyja TäzeAdress Goşmak.
export const createUserAddress = async (data: NewUserAddresses) => {
const [address] = await db.insert(userAddresses).values(data).returning();
return address;
};


// Belli Bir Ulanyjynyň ÄHLI Adreslerini Getirmek.
export const getUserAddresses = async (userId: string) => {
return db.query.userAddresses.findMany({
where: eq(userAddresses.userId, userId)
});
};

// Adresiň Maglumatlaryny Täzelemek.
export const updateUserAddress = async (id: string, data: Partial<NewUserAddresses>) => {
    const [address] = await db.update(userAddresses).set(data).where(eq(userAddresses.id, id)).returning();
     return address;
};

// Adressi Pozmak.
export const deleteUserAddress = async (id: string) => {
    const [address] = await db.delete(userAddresses).where(eq(userAddresses.id, id)).returning();
     return address;
};


//Sargytlar Bölümini  Döret.
export const listOrders = async (data:NewOrderItems) =>{
    const listOrderItem = await db.insert(orderItems).values(data).returning()
    return listOrderItem
};


//Sargytlary Çekmek.
export const getOrders = async (id:string) =>{
 const getOrders = await db.query.orderItems.findMany({
    where:eq(orderItems.id,id),
    with:{
        variant:true,
        order:true
    }
 })
 return getOrders
};


//Sargytlary Täzelemek.
export const updateOrders = async (id:string,data:Partial<NewOrderItems>) =>{
    const updateListOrders = await db.update(orderItems).set(data).where(eq(orderItems.id,id)).returning()
    return updateListOrders
};


//Sargytlary Pozmak.
export const deleteListOrders = async (id:string) =>{
    const deleteOrderLists = db.delete(orderItems).where(eq(orderItems.id,id)).returning()
    return deleteOrderLists
};


//Täze Brend Goşmak.
export const createBrand = async (data:NewBrands) =>{
    const createNewBrand = await db.insert(brands).values(data).returning()
    return createNewBrand
}


//Ähli Brendleri Çekmek.
export const getAllBrands = async () =>{
    const allBrands = await db.query.brands.findMany();
    return allBrands
}


//Bir Brendi Degişli Bolan Harydy Bilen Getirmek.
export const getBrandWithProducts = async (brandName:string) =>{
    const brandWithProduct = await db.query.brands.findFirst({
        where:eq(brands.name,brandName),
        with:{
            products:true
        }
    })
    return brandWithProduct
}




// Id Boýunça Brendy Getirmek.
export const getBrandById = async (id: string) => { 
    const brand = await db.query.brands.findFirst({
        where: eq(brands.id, id),
    });
    return brand;
};


//Brendi Täzelemek.
export const updateBrand = async (id: string, data: Partial<NewBrands>) => {
    const updatedBrand = await db.update(brands).set(data).where(eq(brands.id, id)).returning();
    return updatedBrand;
};


//Täze Brend Goş Eger Bar Bolsa Brend- gaýtar.
export const upsertBrand = async (data:NewBrands) => {
    const existingBrand = await getBrandById(data.id!);
    if (existingBrand){
         return updateBrand (data.id!,data)
        }
    return createBrand(data)
}



//Brendi Pozmak.
export const deleteBrand = async (id: string) => {
    const deletedBrand = await db.delete(brands).where(eq(brands.id, id)).returning();
    return deletedBrand;
};


//Kategoriya Goşmak.
export const createCategory = async (data:NewCategories) =>{
    const [addCategory] = await db.insert(categories).values(data).returning()
    return addCategory;
}


//Kategoriýany Id Boýunça Çagyrmak.
export const getCategoryById = async (id:string)=>{
    const category = await db.query.categories.findFirst({
        where:eq(categories.id,id)
    })
    return category
}


//Kategoriýany Pozmak.
export const deleteCategory = async (id:string)=>{
    const deleteCategoryById = await db.delete(categories).where(eq(categories.id,id)).returning()
    return deleteCategoryById;
}


//Kategoriýany Täzelemek
export const updateCategory = async (id:string,data:Partial<NewCategories>)=>{
    const updateCaategoryById = await db.update(categories).set(data).where(eq(categories.id,id)).returning()
    return updateCaategoryById;
}


//Täze Kategoriýa Goşmak Ýa-da Bar Bolan Kategoriýany Täzelemek.
export const upsertCategory = async (data:NewCategories)=>{
    const existingCategory = await getCategoryById(data.id!)
    if (existingCategory){
        return updateCategory(data.id!,data)
    }
    return createCategory(data) 
}


//Täze Sargyt Goşmak.

