// require('dotenv').config();
// const mongoose = require('mongoose');
// const TechProduct = require('../models/techProduct.model');
// const products = require('../data/products.json');

// const MONGO_URI = process.env.MONGO_URI || 'mongodb://root:ejemplo123@mongo:27017/ecommerceDB?authSource=admin';

// async function seedDatabase() {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log('✔ Conectado a MongoDB');

//     await TechProduct.deleteMany();
//     console.log('✔ Colección de productos limpiada');

//     const productsToInsert = products.map(item => ({
//       ...item,
//       name: `${item.marca} ${item.modelo}`
//     }));

//     await TechProduct.insertMany(productsToInsert);
//     console.log(`✅ ${products.length} productos insertados correctamente`);
//     process.exit(0);
//   } catch (error) {
//     console.error('❌ Error:', error.message);
//     process.exit(1);
//   }
// }

// seedDatabase();
require('dotenv').config();
const mongoose = require('mongoose');
const TechProduct = require('../models/techProduct.model');
const products = require('../data/products.json');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerceDB';

async function seedDatabase() {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log('✔ Conectado a MongoDB. Base de datos:', conn.connection.db.databaseName);

    await TechProduct.deleteMany();
    console.log('✔ Colección de productos limpiada');

    const result = await TechProduct.insertMany(products);
    console.log(`✅ ${result.length} productos insertados correctamente`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedDatabase();