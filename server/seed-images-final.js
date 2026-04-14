const mongoose = require("mongoose");
const Menu = require("./models/Menu");

const itemImageMap = [
  { 
    keywords: ['cold coffee', 'iced coffee', 'frappe'], 
    url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    category: 'Beverages'
  },
  { 
    keywords: ['coffee', 'hot coffee', 'latte', 'cappuccino'], 
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    category: 'Beverages'
  },
  { 
    keywords: ['tea', 'chai', 'masala tea'], 
    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    category: 'Beverages'
  },
  { 
    keywords: ['milk', 'shake', 'smoothie'], 
    url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    category: 'Beverages'
  },
  { 
    keywords: ['burger', 'mac', 'cheese burger'], 
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    category: 'Snacks'
  },
  { 
    keywords: ['pizza', 'margherita', 'pepperoni'], 
    url: 'https://images.unsplash.com/photo-1513104890-38c1cb22caca?auto=format&fit=crop&w=800&q=80',
    category: 'Snacks'
  },
  { 
    keywords: ['fries', 'french', 'chips'], 
    url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    category: 'Snacks'
  },
  { 
    keywords: ['sandwitch', 'sandwich', 'club'], 
    url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    category: 'Snacks'
  },
  { 
    keywords: ['pasta', 'macaroni', 'sauce', 'sause'], 
    url: 'https://images.unsplash.com/photo-1621996316564-6fa3fbef4bf8?auto=format&fit=crop&w=800&q=80',
    category: 'Main Course'
  },
  { 
    keywords: ['noodles', 'hakka', 'chowmein'], 
    url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    category: 'Main Course'
  },
  { 
    keywords: ['biryani', 'pulav', 'pulao', 'fried rice'], 
    url: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=800&q=80',
    category: 'Main Course'
  },
  { 
    keywords: ['chapati', 'roti', 'bhaji', 'sabzi', 'thali'], 
    url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    category: 'Main Course'
  },
  { 
    keywords: ['dosa', 'idli', 'south indian'], 
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    category: 'Snacks'
  },
  { 
    keywords: ['vada pav', 'pav', 'street food'], 
    url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
    category: 'Snacks'
  },
  { 
    keywords: ['ice-cream', 'ice cream', 'strawberry', 'chocolate'], 
    url: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80',
    category: 'Desserts'
  },
  { 
    keywords: ['gulab jamun', 'sweet', 'mithai'], 
    url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80',
    category: 'Desserts'
  }
];

const fallbackUrl = 'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=800&q=80';

const seedAndCleanup = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/canteenDB1");
    console.log("Connected to DB for final seeding and cleanup.");

    const items = await Menu.find({});
    console.log(`Initial items in DB: ${items.length}`);

    const seenItemNames = new Set();
    const itemsToDelete = [];
    const itemsToUpdate = [];

    // 1. Identify Unique Items & Duplicates
    for (const item of items) {
      const normalizedName = item.name.trim().toLowerCase();
      
      if (seenItemNames.has(normalizedName)) {
        itemsToDelete.push(item._id);
        console.log(`Duplicate found: ${item.name} (${item._id})`);
      } else {
        seenItemNames.add(normalizedName);
        
        // 2. Find best image and category
        let bestMatch = itemImageMap.find(m => 
          m.keywords.some(k => normalizedName.includes(k))
        );

        const newImage = bestMatch ? bestMatch.url : fallbackUrl;
        const newCategory = bestMatch ? bestMatch.category : 'General';
        
        itemsToUpdate.push({
          id: item._id,
          name: item.name,
          image: newImage,
          category: newCategory
        });
      }
    }

    // 3. Delete Duplicates
    if (itemsToDelete.length > 0) {
      const delResult = await Menu.deleteMany({ _id: { $in: itemsToDelete } });
      console.log(`Cleaned up ${delResult.deletedCount} duplicates.`);
    }

    // 4. Update Images and Categories
    for (const update of itemsToUpdate) {
      await Menu.findByIdAndUpdate(update.id, { 
        image: update.image, 
        category: update.category,
        available: true // Ensure everything is visible after this reset
      });
      console.log(`Processed: ${update.name} -> ${update.category}`);
    }

    console.log("SUCCESS: Database optimized and images updated.");
    process.exit(0);
  } catch (err) {
    console.error("ERROR during seed:", err);
    process.exit(1);
  }
};

seedAndCleanup();
