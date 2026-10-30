import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ENV } from '../config/config'
import * as scheme from './scheme'

if(!ENV.DATABASE_URL){
    throw new Error('DATABASE_URL ENVIORNMENT BILEN BAGLANYŞYK GURALMADY')
}

const pool = new Pool({
    connectionString:ENV.DATABASE_URL,
});

// DRIZZLE ORM - I POOL BILEN BAGLANYŞDYRMAK.
export const db = drizzle(pool ,{ schema: scheme });

pool.on('connect',()=>{
    console.log('Maglumatlar bazasyna ustunlukli birikdirildi')
})

pool.on('error',(err:Error)=>{
console.error('Maglumatlar bazasyna birikdirilmedi',err)    
})
