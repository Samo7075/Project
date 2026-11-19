import type { Request,Response } from "express";

import * as queries from '../db/queries'
//import { getAuth } from "@clerk/express";
import { HTTP_STATUS, PRODUCT_MESSAGES } from "../constant_status_codes/statusCodes";





//Ähli Harytlar Almak Üçin Logika.
export const getAllProducts = async (req:Request,res:Response)=>{
    try {
        const products = await queries.getAllProducts();
        res.status(HTTP_STATUS.OK).json(products)
    }catch(error){
        console.error("getAllProducts error:", error);
        console.error("Ähli Harytlar Tapylmady")
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({error:'Häzirlikçe Harytlar Elýeter Däldir'});
    }
}

 //Ýeke-Täk Harydy Almak Üçin Id Arkaly.
 export const getProductsById = async(req:Request,res:Response)=>{
    try {
        
        const{ id } = req.params;

        if (typeof id !=="string") {
            return res.status(400).json({
                error: "Haryt ID nädogry"
            });
        }
        const product = await queries.getProductsById(id)

        if(!product) return res.status(404).json({error:'Haryt Tapylmady'})
            res.status(200).json(product)
    } catch (error) {
        console.error("Haryt Tapylmady!",error)
        res.status(500).json({error:'Haryt Tapmakda '})
        
    }
 }


 // Öz Harytlarymy Çagyrmak. 
 export const getMyProductsById = async (req:Request,res:Response)=>{
        
  try {
    // Auth middleware ulanyan bolsangyz (meselem Clerk ya-da JWT), 
    // userId req.user ya-da req.auth ichinden alynyar.
    const userId = "user_test_001"; // ya-da req.auth.userId

    if (!userId) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({error: 'Abuna Ýok!' });
      return;
    }

    const myProducts =  await queries.getMyProductById(userId);
    res.status(HTTP_STATUS.OK).json(myProducts);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({error:'Siziň Harydyňyz Tapylmady!' });
  }
}; 

//Täze Haryt Döretmek Ýa-da Goşmak.
    export const createProduct = async (req: Request, res: Response) => {
        try {
            

            // Autensaýinasiýa barlagy
            

            // Request body-den maglumatlary alyarys
            const { description, price, title,categoryId,brandId} = req.body;

            // Meýdançalaryň hemmesiniň bar bolmagyny barlaýarys
            if (!description || !price || !title  ) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: PRODUCT_MESSAGES.NOT_FOUND });
            }

            // Eýýäm ýazlan query-ňizi çagyrýarys
            const product = await queries.createProducts({
                id:crypto.randomUUID(),
                title,
                description,
                price,
                categoryId,
                brandId
                
            });

            // Üstünlikli jogap iberýäris
            return res.status(HTTP_STATUS.CREATED).json({
                message:PRODUCT_MESSAGES.SUCCESS,product
            })

        } catch (error) {
            console.error(PRODUCT_MESSAGES.NOT_FOUND, error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: PRODUCT_MESSAGES.UNSUCCESS });
        }
    };


//Harydy Pozmak.

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id as string; // URL-daky haryt ID-si (:id)

    if (!productId) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ error: PRODUCT_MESSAGES.NOT_FOUND });
      return;
    }

    // Bazyda harydy pozmak üçin query ýa-da model ýüzlenmesi
    const deletedProduct = await queries.deleteProductById(productId);

    if (!deletedProduct) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ error: PRODUCT_MESSAGES.NOT_FOUND });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ 
      message: PRODUCT_MESSAGES.DELETED,
      deletedProduct 
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      error: 'Haryt öçürilende ýalňyşlyk ýüze çykdy!' 
    });
  }
};
