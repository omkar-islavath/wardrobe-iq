import { sequelize } from './config/db.js';
import WardrobeItem from './models/WardrobeItem.js';

const checkDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB authenticated");
    const items = await WardrobeItem.findAll();
    console.log(`Found ${items.length} items:`);
    items.forEach(item => {
      console.log(`ID: ${item.id}, Name: ${item.color} ${item.category}, ImageUrl: ${item.imageUrl}`);
    });
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkDb();
