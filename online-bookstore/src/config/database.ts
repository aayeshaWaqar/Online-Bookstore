import {Pool, PoolClient, QueryResult, QueryResultRow} from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// create postgresql connection pool
const pool = new Pool({
host: process.env.DB_HOST, 
port: parseInt(process.env.DB_PORT || '5432'),
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,
});

// event listener - when connection established successfully 
pool.on('connect', () => {
  console.log('Connected to PostgreSQL Database');
});

// generic query function - to run query on database
export const query = async <T extends QueryResultRow>(
 text : string,
 params ?: any[]
): Promise<QueryResult<T>> => {
 return await pool.query<T>(text,params);
};

// transaction helper - to run multiple queries at the same time
export const transaction = async <T>(
 callback: (client: PoolClient) => Promise<T>
): Promise<T> =>{
 const client = await pool.connect();
 try{
  await client.query("BEGIN");
  const result = await callback(client);
  await client.query("COMMIT");
  return result;
 }catch(error){
  await client.query("ROLLBACK");
  throw error;
 }finally{
  client.release();
 }
};

//export all functions so that other files use it
export default {pool, query, transaction};

