const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

dotenv.config();

const categories = [
  { name: 'Hot Coffees', displayOrder: 1 },
  { name: 'Iced Coffees', displayOrder: 2 },
  { name: 'Frappes', displayOrder: 3 },
  { name: 'Matcha', displayOrder: 4 },
  { name: 'Iced Tea', displayOrder: 5 },
  { name: 'Chillers', displayOrder: 6 },
  { name: 'Hot Chocolate', displayOrder: 7 },
  { name: 'Desserts', displayOrder: 8 },
];

const menuItems = [
  // Hot Coffees
  { category: 'Hot Coffees', name: 'Americano', price: 4.5 },
  { category: 'Hot Coffees', name: 'Cappuccino', price: 5.0 },
  { category: 'Hot Coffees', name: 'Flat White', price: 5.5 },
  { category: 'Hot Coffees', name: 'Cortado', price: 5.0 },
  { category: 'Hot Coffees', name: 'Latte', price: 5.5 },
  { category: 'Hot Coffees', name: 'Spanish', price: 5.5 },
  { category: 'Hot Coffees', name: 'French Vanilla', price: 6.0 },
  { category: 'Hot Coffees', name: 'Caramel', price: 6.0 },
  { category: 'Hot Coffees', name: 'Hazelnut', price: 6.0 },
  { category: 'Hot Coffees', name: 'Tiramisu', price: 6.5 },
  { category: 'Hot Coffees', name: 'Pista', price: 6.5 },
  { category: 'Hot Coffees', name: 'Mocha', price: 6.0 },
  { category: 'Hot Coffees', name: 'Tahitian Vanilla', price: 6.5 },

  // Iced Coffees
  { category: 'Iced Coffees', name: 'Americano', price: 4.5 },
  { category: 'Iced Coffees', name: 'Latte', price: 5.5 },
  { category: 'Iced Coffees', name: 'Spanish', price: 5.5 },
  { category: 'Iced Coffees', name: 'French Vanilla', price: 6.0 },
  { category: 'Iced Coffees', name: 'Caramel', price: 6.0 },
  { category: 'Iced Coffees', name: 'Hazelnut', price: 6.0 },
  { category: 'Iced Coffees', name: 'Tiramisu', price: 6.5 },
  { category: 'Iced Coffees', name: 'Pista', price: 6.5 },
  { category: 'Iced Coffees', name: 'Mocha', price: 6.0 },
  { category: 'Iced Coffees', name: 'Tahitian Vanilla (Cinnamon Vanilla)', price: 6.5 },

  // Frappes
  { category: 'Frappes', name: 'French Vanilla', price: 7.0 },
  { category: 'Frappes', name: 'Caramel', price: 7.0 },
  { category: 'Frappes', name: 'Hazelnut', price: 7.0 },
  { category: 'Frappes', name: 'Pista', price: 7.5 },
  { category: 'Frappes', name: 'Mocha', price: 7.0 },

  // Matcha
  { category: 'Matcha', name: 'Original', price: 6.0 },
  { category: 'Matcha', name: 'Vanilla', price: 6.5 },
  { category: 'Matcha', name: 'Strawberry', price: 6.5 },
  { category: 'Matcha', name: 'Blackberry Matcha', price: 6.5 },

  // Iced Tea
  { category: 'Iced Tea', name: 'Peach', price: 5.0 },
  { category: 'Iced Tea', name: 'Passion Fruit', price: 5.0 },

  // Chillers
  { category: 'Chillers', name: 'Peach', price: 5.5 },
  { category: 'Chillers', name: 'Strawberry', price: 5.5 },
  { category: 'Chillers', name: 'Blackberry', price: 5.5 },

  // Hot Chocolate
  { category: 'Hot Chocolate', name: 'Hazelnut', price: 6.0 },

  // Desserts
  { category: 'Desserts', name: 'Lindt Cheesecake', price: 8.0 },
  { category: 'Desserts', name: 'Snickers Cheesecake', price: 8.5 },
  { category: 'Desserts', name: 'Burnt Basque Cheesecake', price: 9.0 },
  { category: 'Desserts', name: 'Cinnamon Rolls', price: 6.5 },
  { category: 'Desserts', name: 'Lotus Cookies', price: 5.0 },
  { category: 'Desserts', name: 'Peanut Butter Brownie', price: 7.0 },
  { category: 'Desserts', name: 'Fudge Brownie', price: 7.0 },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://mohdaleerehman_db_user:8Sj0pu3BexuFWp8Z@drinkpheww.jts4pbd.mongodb.net/phew-pos?retryWrites=true&w=majority&appName=drinkpheww', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🌱 Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await MenuItem.deleteMany({});

    // Create default admin user
    const admin = await User.create({
      name: 'Admin',
      username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
      password: process.env.DEFAULT_ADMIN_PASSWORD || 'PHEWcares12@',
      role: 'admin',
    });
    console.log('✅ Admin user created:', admin.username);

    // Create categories
    const createdCategories = {};
    for (const cat of categories) {
      const category = await Category.create(cat);
      createdCategories[cat.name] = category._id;
      console.log(`✅ Category created: ${cat.name}`);
    }

    // Create menu items
    for (const item of menuItems) {
      const categoryId = createdCategories[item.category];
      if (categoryId) {
        await MenuItem.create({
          name: item.name,
          category: categoryId,
          price: item.price,
          isAvailable: true,
        });
        console.log(`✅ Menu item created: ${item.name}`);
      }
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

