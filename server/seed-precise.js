const mongoose = require("mongoose");
const Menu = require("./models/Menu");

const seedImages = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/canteenDB1");
    console.log("Connected to DB to update images accurately.");

    const items = await Menu.find({});
    
    for (let item of items) {
      const name = item.name.toLowerCase();
      let imageUrl = "";

      if (name.includes('cold coffee')) {
        imageUrl = "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=500&q=80"; // iced coffee
      } else if (name.includes('coffee')) {
        imageUrl = "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=500&q=80"; // hot coffee
      } else if (name.includes('tea')) {
        imageUrl = "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('milk')) {
        imageUrl = "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('burger')) {
        imageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('pizza')) {
        imageUrl = "https://images.unsplash.com/photo-1513104890-38c1cb22caca?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('fries') || name.includes('french')) {
        imageUrl = "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('sandwitch') || name.includes('sandwich')) {
        imageUrl = "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('strawberry')) {
        imageUrl = "https://images.unsplash.com/photo-1549395156-e0c1fe6fc7a5?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('ice') || name.includes('cream')) {
        imageUrl = "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('white sause pasta') || name.includes('white sauce')) {
        imageUrl = "https://images.unsplash.com/photo-1621996316564-6fa3fbef4bf8?auto=format&fit=crop&w=500&q=80"; // creamy pasta
      } else if (name.includes('pasta')) {
        imageUrl = "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=80"; // generic pasta
      } else if (name.includes('biryani') || name.includes('pulav')) {
        imageUrl = "https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('dosa')) {
        imageUrl = "https://images.unsplash.com/photo-1627308595229-7830f5c90683?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('vada pav')) {
        imageUrl = "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=500&q=80"; // street food
      } else if (name.includes('noodles')) {
        imageUrl = "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80"; // noodles
      } else if (name.includes('chapati')) {
        imageUrl = "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=500&q=80"; // roti/chapati with sabzi
      } else if (name.includes('gulab jamun')) {
        imageUrl = "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=500&q=80"; // indian sweets
      } else {
        imageUrl = "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=500&q=80";
      }

      item.image = imageUrl;
      await item.save();
      console.log(`Updated ${item.name} with specific image.`);
    }

    console.log("Done updating specific images.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedImages();
