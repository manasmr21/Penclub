import path from "path";
import { DataSource } from "typeorm";
import dotenv from "dotenv"

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

if(!dbUrl) throw new Error("DATABASE_URL environment variable is not defined");

const dataSource = new DataSource({
    type: "postgres",
    url: dbUrl,
    entities:[
        path.join(__dirname, "../modules/**/entities/**/*.entity{.ts,.js}")
    ],
    synchronize: true, //make it false in production

    ssl: {
        rejectUnauthorized: false
    },
    extra:{
        keepAlive : true,
    },
    logging: true
})

export default dataSource;