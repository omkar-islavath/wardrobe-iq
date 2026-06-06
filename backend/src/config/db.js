import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  sequelize = new Sequelize(
    process.env.PG_DATABASE || 'wardrobe_iq',
    process.env.PG_USER || 'postgres',
    process.env.PG_PASSWORD || 'root',
    {
      host: process.env.PG_HOST || 'localhost',
      port: process.env.PG_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

export let isDbConnected = false;

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    isDbConnected = true;
    console.log('PostgreSQL Connected Successfully via Sequelize!');
    // Sync all models (caution: sync({ alter: true }) automatically adds columns/tables without losing existing data)
    await sequelize.sync({ alter: true });
    console.log('PostgreSQL Models synced successfully.');
  } catch (error) {
    console.error(`PostgreSQL Connection Error: ${error.message}`);
    console.warn("WARNING: The backend server started but is NOT connected to PostgreSQL. Database operations will fail.");
  }
};

export { sequelize };
export default connectDB;
