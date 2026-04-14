const mongoose = require("mongoose");
const Menu = require("./models/Menu");

const seedImages = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/canteenDB1");
    console.log("Connected to DB to update images");

    const items = await Menu.find({});
    
    for (let item of items) {
      if (item.image) continue; // skip if already has an image

      const name = item.name.toLowerCase();
      let imageUrl = "";

      if (name.includes('coffee')) {
        imageUrl = "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('tea')) {
        imageUrl = "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('milk')) {
        imageUrl = "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('burger')) {
        imageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('pizza')) {
        imageUrl = "https://images.unsplash.com/photo-1513104890-38c1cb22caca?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('fries') || name.includes('sandwitch')) {
        imageUrl = "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('ice') || name.includes('cream')) {
        imageUrl = "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('pasta')) {
        imageUrl = "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('biryani') || name.includes('pulav')) {
        imageUrl = "https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('dosa')) {
        imageUrl = "https://images.unsplash.com/photo-1627308595229-7830f5c90683?auto=format&fit=crop&w=500&q=80";
      } else if (name.includes('vada pav')) {
        // generic indian snack placeholder
        imageUrl = "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=500&q=80";
      } else {
        // generic food fallback
        imageUrl = "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=500&q=80";
      }

      item.image = imageUrl;
      await item.save();
      console.log(`Updated ${item.name} with an image.`);
    }

    console.log("Done updating images.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedImages();
