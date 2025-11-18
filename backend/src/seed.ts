import { connectDB, disconnectDB } from './config/database.js';
import { Store } from './models/Store.js';
import { Product } from './models/Product.js';

const seedData = async () => {
  try {
    console.log('🌱 Starting database seed...');

    await connectDB();

    // Clear existing data
    await Store.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create stores - strategic mix for interesting analytics
    const stores = await Store.create([
      // BIG CITIES - Electronics + Fashion + Food dominant
      {
        name: 'Tech Haven',
        description: 'Electronics and gadgets',
        city: 'New York',
        cityType: 'big',
        address: '123 Tech Street, Manhattan, NY',
        phone: '+1-555-0101',
        email: 'contact@techhaven.com',
      },
      {
        name: 'Fashion Central',
        description: 'Latest fashion trends',
        city: 'New York',
        cityType: 'big',
        address: '456 Fashion Ave, Brooklyn, NY',
        phone: '+1-555-0102',
        email: 'info@fashioncentral.com',
      },
      {
        name: 'Metro Electronics',
        description: 'Consumer electronics superstore',
        city: 'New York',
        cityType: 'big',
        address: '789 Broadway, Manhattan, NY',
        phone: '+1-555-0103',
        email: 'sales@metroelectronics.com',
      },
      {
        name: 'Gourmet Foods',
        description: 'Premium foods and beverages',
        city: 'Los Angeles',
        cityType: 'big',
        address: '789 Culinary Lane, LA, CA',
        phone: '+1-555-0201',
        email: 'shop@gourmetfoods.com',
      },
      {
        name: 'LA Fashion House',
        description: 'Trendy clothing and accessories',
        city: 'Los Angeles',
        cityType: 'big',
        address: '234 Rodeo Drive, LA, CA',
        phone: '+1-555-0202',
        email: 'info@lafashion.com',
      },
      {
        name: 'Chicago Tech Store',
        description: 'Latest technology products',
        city: 'Chicago',
        cityType: 'big',
        address: '567 Michigan Ave, Chicago, IL',
        phone: '+1-555-0301',
        email: 'hello@chitech.com',
      },
      {
        name: 'Windy City Fashion',
        description: 'Urban fashion boutique',
        city: 'Chicago',
        cityType: 'big',
        address: '890 State Street, Chicago, IL',
        phone: '+1-555-0302',
        email: 'shop@windycityfashion.com',
      },
      
      // SMALL TOWNS - Tools + Food (missing Electronics + Fashion)
      {
        name: 'Village Market',
        description: 'Local goods and essentials',
        city: 'Millbrook',
        cityType: 'small',
        address: '88 Main Street, Millbrook, NY',
        phone: '+1-555-0401',
        email: 'info@villagemarket.com',
      },
      {
        name: 'Country Store',
        description: 'Hardware and farm supplies',
        city: 'Farmville',
        cityType: 'small',
        address: '22 Oak Avenue, Farmville, VA',
        phone: '+1-555-0501',
        email: 'info@countrystore.com',
      },
      {
        name: 'Riverside Tools',
        description: 'Tools and hardware for everyone',
        city: 'Riverside',
        cityType: 'small',
        address: '45 River Road, Riverside, IA',
        phone: '+1-555-0601',
        email: 'contact@riversidetools.com',
      },
      {
        name: 'Small Town Grocer',
        description: 'Fresh food and groceries',
        city: 'Greenville',
        cityType: 'small',
        address: '12 Main St, Greenville, SC',
        phone: '+1-555-0701',
        email: 'info@smalltowngrocer.com',
      },
      {
        name: 'Country Hardware',
        description: 'Hardware, tools, and supplies',
        city: 'Springfield',
        cityType: 'small',
        address: '99 Oak Street, Springfield, MO',
        phone: '+1-555-0801',
        email: 'sales@countryhardware.com',
      },
    ]);
    console.log('✅ Created 12 stores');

    // Create products - MORE products per store for richer data
    
    // Tech Haven (NYC) - Electronics
    await Product.create([
      { name: 'Laptop', description: 'High-performance laptop', price: 999.99, store: stores[0]._id, category: 'Electronics', stock: 20 },
      { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 29.99, store: stores[0]._id, category: 'Electronics', stock: 50 },
      { name: 'Headphones', description: 'Noise-canceling headphones', price: 199.99, store: stores[0]._id, category: 'Electronics', stock: 30 },
      { name: 'USB Cable', description: 'Fast charging USB-C cable', price: 15.99, store: stores[0]._id, category: 'Electronics', stock: 100 },
      { name: 'Webcam', description: '4K webcam for streaming', price: 89.99, store: stores[0]._id, category: 'Electronics', stock: 25 },
      { name: 'Keyboard', description: 'Mechanical gaming keyboard', price: 129.99, store: stores[0]._id, category: 'Electronics', stock: 35 },
    ]);

    // Fashion Central (NYC) - Fashion
    await Product.create([
      { name: 'Designer Jeans', description: 'Premium denim jeans', price: 89.99, store: stores[1]._id, category: 'Fashion', stock: 40 },
      { name: 'Leather Jacket', description: 'Genuine leather jacket', price: 299.99, store: stores[1]._id, category: 'Fashion', stock: 15 },
      { name: 'Sneakers', description: 'Athletic sneakers', price: 79.99, store: stores[1]._id, category: 'Fashion', stock: 60 },
      { name: 'T-Shirt', description: 'Cotton graphic t-shirt', price: 24.99, store: stores[1]._id, category: 'Fashion', stock: 80 },
      { name: 'Dress', description: 'Summer dress', price: 69.99, store: stores[1]._id, category: 'Fashion', stock: 45 },
      { name: 'Handbag', description: 'Designer handbag', price: 149.99, store: stores[1]._id, category: 'Fashion', stock: 30 },
    ]);

    // Metro Electronics (NYC) - Electronics
    await Product.create([
      { name: 'Smartphone', description: 'Latest smartphone model', price: 799.99, store: stores[2]._id, category: 'Electronics', stock: 50 },
      { name: 'Tablet', description: '10-inch tablet', price: 449.99, store: stores[2]._id, category: 'Electronics', stock: 30 },
      { name: 'Smart Watch', description: 'Fitness tracking smartwatch', price: 299.99, store: stores[2]._id, category: 'Electronics', stock: 40 },
      { name: 'Bluetooth Speaker', description: 'Portable speaker', price: 79.99, store: stores[2]._id, category: 'Electronics', stock: 60 },
      { name: 'Power Bank', description: '20000mAh power bank', price: 39.99, store: stores[2]._id, category: 'Electronics', stock: 75 },
    ]);

    // Gourmet Foods (LA) - Food
    await Product.create([
      { name: 'Organic Coffee', description: 'Premium coffee beans', price: 18.99, store: stores[3]._id, category: 'Food', stock: 100 },
      { name: 'Olive Oil', description: 'Extra virgin olive oil', price: 24.99, store: stores[3]._id, category: 'Food', stock: 80 },
      { name: 'Dark Chocolate', description: 'Belgian dark chocolate', price: 12.99, store: stores[3]._id, category: 'Food', stock: 120 },
      { name: 'Pasta', description: 'Artisan pasta', price: 8.99, store: stores[3]._id, category: 'Food', stock: 150 },
      { name: 'Wine', description: 'California red wine', price: 29.99, store: stores[3]._id, category: 'Food', stock: 60 },
      { name: 'Cheese', description: 'Imported aged cheese', price: 15.99, store: stores[3]._id, category: 'Food', stock: 70 },
    ]);

    // LA Fashion House (LA) - Fashion
    await Product.create([
      { name: 'Sunglasses', description: 'Designer sunglasses', price: 159.99, store: stores[4]._id, category: 'Fashion', stock: 50 },
      { name: 'Shorts', description: 'Summer shorts', price: 39.99, store: stores[4]._id, category: 'Fashion', stock: 70 },
      { name: 'Sandals', description: 'Leather sandals', price: 49.99, store: stores[4]._id, category: 'Fashion', stock: 55 },
      { name: 'Hat', description: 'Wide-brim sun hat', price: 34.99, store: stores[4]._id, category: 'Fashion', stock: 40 },
      { name: 'Belt', description: 'Leather belt', price: 29.99, store: stores[4]._id, category: 'Fashion', stock: 60 },
    ]);

    // Chicago Tech Store (Chicago) - Electronics
    await Product.create([
      { name: 'Monitor', description: '27-inch 4K monitor', price: 399.99, store: stores[5]._id, category: 'Electronics', stock: 25 },
      { name: 'Router', description: 'WiFi 6 router', price: 149.99, store: stores[5]._id, category: 'Electronics', stock: 40 },
      { name: 'External SSD', description: '1TB portable SSD', price: 119.99, store: stores[5]._id, category: 'Electronics', stock: 50 },
      { name: 'Printer', description: 'Wireless printer', price: 179.99, store: stores[5]._id, category: 'Electronics', stock: 20 },
      { name: 'Desk Lamp', description: 'LED desk lamp', price: 44.99, store: stores[5]._id, category: 'Electronics', stock: 45 },
    ]);

    // Windy City Fashion (Chicago) - Fashion
    await Product.create([
      { name: 'Winter Coat', description: 'Warm winter coat', price: 249.99, store: stores[6]._id, category: 'Fashion', stock: 30 },
      { name: 'Scarf', description: 'Wool scarf', price: 34.99, store: stores[6]._id, category: 'Fashion', stock: 60 },
      { name: 'Gloves', description: 'Leather gloves', price: 44.99, store: stores[6]._id, category: 'Fashion', stock: 50 },
      { name: 'Boots', description: 'Winter boots', price: 129.99, store: stores[6]._id, category: 'Fashion', stock: 35 },
      { name: 'Sweater', description: 'Cashmere sweater', price: 89.99, store: stores[6]._id, category: 'Fashion', stock: 45 },
    ]);

    // Village Market (Millbrook - Small) - Food
    await Product.create([
      { name: 'Fresh Bread', description: 'Homemade bread', price: 4.99, store: stores[7]._id, category: 'Food', stock: 50 },
      { name: 'Local Honey', description: 'Raw honey', price: 9.99, store: stores[7]._id, category: 'Food', stock: 40 },
      { name: 'Eggs', description: 'Farm fresh eggs', price: 5.99, store: stores[7]._id, category: 'Food', stock: 60 },
      { name: 'Milk', description: 'Whole milk', price: 3.99, store: stores[7]._id, category: 'Food', stock: 80 },
      { name: 'Apples', description: 'Local apples', price: 6.99, store: stores[7]._id, category: 'Food', stock: 100 },
    ]);

    // Country Store (Farmville - Small) - Tools
    await Product.create([
      { name: 'Work Gloves', description: 'Heavy-duty work gloves', price: 14.99, store: stores[8]._id, category: 'Tools', stock: 40 },
      { name: 'Hammer', description: 'Steel hammer', price: 19.99, store: stores[8]._id, category: 'Tools', stock: 25 },
      { name: 'Tool Box', description: 'Metal tool box', price: 39.99, store: stores[8]._id, category: 'Tools', stock: 15 },
      { name: 'Screwdriver Set', description: '12-piece screwdriver set', price: 24.99, store: stores[8]._id, category: 'Tools', stock: 30 },
      { name: 'Tape Measure', description: '25-foot tape measure', price: 12.99, store: stores[8]._id, category: 'Tools', stock: 35 },
      { name: 'Wrench Set', description: 'Metric wrench set', price: 34.99, store: stores[8]._id, category: 'Tools', stock: 20 },
    ]);

    // Riverside Tools (Riverside - Small) - Tools
    await Product.create([
      { name: 'Drill', description: 'Cordless power drill', price: 89.99, store: stores[9]._id, category: 'Tools', stock: 15 },
      { name: 'Saw', description: 'Hand saw', price: 22.99, store: stores[9]._id, category: 'Tools', stock: 20 },
      { name: 'Pliers', description: 'Multi-purpose pliers', price: 16.99, store: stores[9]._id, category: 'Tools', stock: 30 },
      { name: 'Level', description: 'Spirit level', price: 18.99, store: stores[9]._id, category: 'Tools', stock: 25 },
      { name: 'Paint Brush Set', description: 'Professional paint brushes', price: 14.99, store: stores[9]._id, category: 'Tools', stock: 40 },
    ]);

    // Small Town Grocer (Greenville - Small) - Food
    await Product.create([
      { name: 'Vegetables', description: 'Fresh vegetables', price: 7.99, store: stores[10]._id, category: 'Food', stock: 90 },
      { name: 'Chicken', description: 'Free-range chicken', price: 12.99, store: stores[10]._id, category: 'Food', stock: 50 },
      { name: 'Rice', description: 'Organic rice', price: 8.99, store: stores[10]._id, category: 'Food', stock: 70 },
      { name: 'Canned Goods', description: 'Assorted canned goods', price: 3.99, store: stores[10]._id, category: 'Food', stock: 120 },
      { name: 'Juice', description: 'Fresh orange juice', price: 5.99, store: stores[10]._id, category: 'Food', stock: 60 },
    ]);

    // Country Hardware (Springfield - Small) - Tools
    await Product.create([
      { name: 'Nails', description: 'Assorted nails box', price: 9.99, store: stores[11]._id, category: 'Tools', stock: 100 },
      { name: 'Screws', description: 'Assorted screws box', price: 11.99, store: stores[11]._id, category: 'Tools', stock: 90 },
      { name: 'Plywood', description: '4x8 plywood sheet', price: 29.99, store: stores[11]._id, category: 'Tools', stock: 25 },
      { name: '2x4 Lumber', description: '8-foot 2x4 lumber', price: 8.99, store: stores[11]._id, category: 'Tools', stock: 50 },
      { name: 'Paint', description: 'Interior paint gallon', price: 34.99, store: stores[11]._id, category: 'Tools', stock: 40 },
    ]);

    console.log('✅ Created 72 products across all stores');

    console.log('\n🎉 Database seeded successfully!');
    console.log('📊 Analytics patterns:');
    console.log('   - Big cities: Heavy in Electronics, Fashion, Food');
    console.log('   - Small towns: Heavy in Tools, Food');
    console.log('   - Missing in small towns: Electronics, Fashion (OPPORTUNITIES!)');
    console.log('   - 12 stores total, 72 products\n');

    await disconnectDB();
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();