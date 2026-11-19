import type { Request, Response } from "express";
import * as queries from '../db/queries'

import { HTTP_STATUS } from '../constant_status_codes/statusCodes';


export async function syncUser (req:Request,res:Response){
    try{
        
       const { userId, email, firstName, lastName, imageUrl, phoneNumber } = req.body;
      
        if(!userId) return res.status(HTTP_STATUS.UNAUTHORIZED).json({error:'Abuna Ýok!'})
           // const { email, firstName, lastName, imageUrl, phoneNumber } = req.body;
        if (!email || !firstName || !lastName || !imageUrl) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Email, Ady, Familiýasy we Surat dolduryň' });
    }
    const user = await queries.upsertUser({
      id: userId,
      email,
      firstName,
      lastName,
      imageUrl,
      phoneNumber: phoneNumber || null, // Eger gelmese null goýýarys
    });
    return res.status(HTTP_STATUS.OK).json(user);
  } catch (error) {
    console.error('Ulanyjy Doly Girizilmedi', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Ulanyjy Girizilmedi' });
  }
}
