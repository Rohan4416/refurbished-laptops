import 'dotenv/config'
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'

// Database is in root ./dev.db (prisma.config.ts handles the relative path)
const dbPath = path.join(__dirname, '../dev.db')
const db = new Database(dbPath)

async function seed() {
  console.log('Seeding database...')

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('user123', 10)

  db.prepare(`
    INSERT OR REPLACE INTO User (id, name, email, password, role, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(
    'admin-user-id',
    'Admin User',
    'admin@refurbtech.com',
    adminPassword,
    'ADMIN'
  )

  db.prepare(`
    INSERT OR REPLACE INTO User (id, name, email, password, role, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(
    'test-user-id',
    'Test User',
    'user@example.com',
    userPassword,
    'USER'
  )
  console.log('Created users')

  // Sample products
  const products = [
    {
      brand: 'Apple',
      model: 'MacBook Pro 14" M3 Pro',
      slug: 'macbook-pro-14-m3-pro',
      processor: 'Apple M3 Pro',
      processorBrand: 'Apple',
      ram: '18GB',
      storage: '512GB SSD',
      displaySize: '14.2"',
      conditionGrade: 'PRISTINE',
      batteryHealth: 98,
      price: 1699,
      originalPrice: 1999,
      stockQuantity: 5,
      images: JSON.stringify(['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800']),
      description: 'Experience the power of Apple M3 Pro chip in this stunning 14-inch MacBook Pro. Features a Liquid Retina XDR display, all-day battery life, and exceptional performance for creative professionals.',
      warranty: '1 Year',
      featured: 1,
    },
    {
      brand: 'Apple',
      model: 'MacBook Air 13" M2',
      slug: 'macbook-air-13-m2',
      processor: 'Apple M2',
      processorBrand: 'Apple',
      ram: '8GB',
      storage: '256GB SSD',
      displaySize: '13.6"',
      conditionGrade: 'EXCELLENT',
      batteryHealth: 95,
      price: 849,
      originalPrice: 1099,
      stockQuantity: 8,
      images: JSON.stringify(['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800']),
      description: 'Supercharged by M2, the new MacBook Air delivers exceptional performance with all-day battery life. Incredibly thin and light design with a stunning 13.6-inch Liquid Retina display.',
      warranty: '6 Months',
      featured: 1,
    },
    {
      brand: 'Dell',
      model: 'XPS 15 9530',
      slug: 'dell-xps-15-9530',
      processor: 'Intel Core i7-13700H',
      processorBrand: 'Intel',
      ram: '32GB',
      storage: '1TB SSD',
      displaySize: '15.6"',
      conditionGrade: 'EXCELLENT',
      batteryHealth: 92,
      price: 1299,
      originalPrice: 1799,
      stockQuantity: 4,
      images: JSON.stringify(['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800']),
      description: 'A powerful 15.6-inch laptop with Intel 13th gen processor, stunning 3.5K OLED display, and premium build quality. Perfect for creators and professionals.',
      warranty: '1 Year',
      featured: 0,
    },
    {
      brand: 'HP',
      model: 'Spectre x360 16',
      slug: 'hp-spectre-x360-16',
      processor: 'Intel Core i7-1360P',
      processorBrand: 'Intel',
      ram: '16GB',
      storage: '512GB SSD',
      displaySize: '16"',
      conditionGrade: 'GOOD',
      batteryHealth: 88,
      price: 899,
      originalPrice: 1599,
      stockQuantity: 6,
      images: JSON.stringify(['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800']),
      description: 'Versatile 2-in-1 convertible laptop with stunning 3K+ IPS display, long battery life, and premium aluminum design. Includes HP Pen support.',
      warranty: '6 Months',
      featured: 0,
    },
    {
      brand: 'Lenovo',
      model: 'ThinkPad X1 Carbon Gen 11',
      slug: 'lenovo-thinkpad-x1-carbon-gen-11',
      processor: 'Intel Core i7-1365U',
      processorBrand: 'Intel',
      ram: '16GB',
      storage: '512GB SSD',
      displaySize: '14"',
      conditionGrade: 'PRISTINE',
      batteryHealth: 97,
      price: 1199,
      originalPrice: 1649,
      stockQuantity: 3,
      images: JSON.stringify(['https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800']),
      description: 'Business-class ultralight laptop with exceptional keyboard, military-grade durability, and enterprise security features. The ultimate productivity machine.',
      warranty: '1 Year',
      featured: 1,
    },
    {
      brand: 'Apple',
      model: 'MacBook Pro 16" M3 Max',
      slug: 'macbook-pro-16-m3-max',
      processor: 'Apple M3 Max',
      processorBrand: 'Apple',
      ram: '36GB',
      storage: '1TB SSD',
      displaySize: '16.2"',
      conditionGrade: 'EXCELLENT',
      batteryHealth: 96,
      price: 2999,
      originalPrice: 3499,
      stockQuantity: 2,
      images: JSON.stringify(['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800']),
      description: 'The most powerful MacBook ever. M3 Max chip delivers exceptional performance for video editing, 3D rendering, and AI workloads. Liquid Retina XDR display.',
      warranty: '1 Year',
      featured: 1,
    },
    {
      brand: 'Dell',
      model: 'Latitude 5540',
      slug: 'dell-latitude-5540',
      processor: 'Intel Core i5-1345U',
      processorBrand: 'Intel',
      ram: '16GB',
      storage: '256GB SSD',
      displaySize: '15.6"',
      conditionGrade: 'GOOD',
      batteryHealth: 85,
      price: 649,
      originalPrice: 1099,
      stockQuantity: 10,
      images: JSON.stringify(['https://images.unsplash.com/photo-1588872657578-7efdc1c2f085?w=800']),
      description: 'Reliable business laptop with solid performance, excellent security features, and comfortable keyboard. Built for professionals.',
      warranty: '6 Months',
      featured: 0,
    },
    {
      brand: 'Lenovo',
      model: 'Yoga 9i Gen 8',
      slug: 'lenovo-yoga-9i-gen-8',
      processor: 'Intel Core i7-1360P',
      processorBrand: 'Intel',
      ram: '16GB',
      storage: '512GB SSD',
      displaySize: '14"',
      conditionGrade: 'EXCELLENT',
      batteryHealth: 94,
      price: 999,
      originalPrice: 1399,
      stockQuantity: 5,
      images: JSON.stringify(['https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800']),
      description: 'Premium 2-in-1 convertible with stunning OLED display, powerful speakers, and sleek design. Perfect for both work and entertainment.',
      warranty: '1 Year',
      featured: 0,
    },
    {
      brand: 'HP',
      model: 'EliteBook 840 G10',
      slug: 'hp-elitebook-840-g10',
      processor: 'Intel Core i7-1355U',
      processorBrand: 'Intel',
      ram: '32GB',
      storage: '512GB SSD',
      displaySize: '14"',
      conditionGrade: 'FAIR',
      batteryHealth: 78,
      price: 799,
      originalPrice: 1299,
      stockQuantity: 7,
      images: JSON.stringify(['https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=800']),
      description: 'Enterprise-grade business laptop with robust security features, excellent build quality, and reliable performance. Great value option.',
      warranty: '6 Months',
      featured: 0,
    },
    {
      brand: 'ASUS',
      model: 'ROG Zephyrus G14',
      slug: 'asus-rog-zephyrus-g14',
      processor: 'AMD Ryzen 9 7940HS',
      processorBrand: 'AMD',
      ram: '32GB',
      storage: '1TB SSD',
      displaySize: '14"',
      conditionGrade: 'EXCELLENT',
      batteryHealth: 91,
      price: 1399,
      originalPrice: 1899,
      stockQuantity: 4,
      images: JSON.stringify(['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800']),
      description: 'Compact gaming powerhouse with AMD Ryzen processor and NVIDIA RTX graphics. Stunning Mini-LED display with AniMe Matrix LED panel.',
      warranty: '1 Year',
      featured: 1,
    },
  ]

  const insertProduct = db.prepare(`
    INSERT OR REPLACE INTO Product (
      id, brand, model, slug, processor, processorBrand, ram, storage,
      displaySize, conditionGrade, batteryHealth, price, originalPrice,
      stockQuantity, images, description, warranty, featured, isPublished,
      createdAt, updatedAt
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now')
    )
  `)

  for (const product of products) {
    insertProduct.run(
      `product-${product.slug}`,
      product.brand,
      product.model,
      product.slug,
      product.processor,
      product.processorBrand,
      product.ram,
      product.storage,
      product.displaySize,
      product.conditionGrade,
      product.batteryHealth,
      product.price,
      product.originalPrice,
      product.stockQuantity,
      product.images,
      product.description,
      product.warranty,
      product.featured
    )
  }
  console.log(`Created ${products.length} products`)

  console.log('Seeding complete!')
  db.close()
}

seed().catch(console.error)