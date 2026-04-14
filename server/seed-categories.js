const mongoose = require("mongoose");
const Menu = require("./models/Menu");

const backfillCategories = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/canteenDB1");
    console.log("Connected to DB");

    const items = await Menu.find({});
    
    for (let item of items) {
      let category = "Snacks";
      const name = item.name.toLowerCase();

      if (name.includes('milk') || name.includes('tea') || name.includes('coffee')) {
        category = 'Beverages';
      } else if (name.includes('ice') || name.includes('cream')) {
        category = 'Dessert';
      } else if (name.includes('pulav') || name.includes('biryani') || name.includes('pasta')) {
        category = 'Lunch';
      } else if (name.includes('special')) {
        category = 'Special';
      }

      item.category = category;
      await item.save();
      console.log(`Updated ${item.name} to ${category}`);
    }

    console.log("Done updating categories.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

backfillCategories();
