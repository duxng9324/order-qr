import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1️⃣ Tạo người dùng
  const passwordHash = await bcrypt.hash('123456', 10)

  const [admin, staff, customer] = await Promise.all([
    prisma.user.create({
      data: { name: 'Admin', password: passwordHash, role: 'ADMIN' },
    }),
    prisma.user.create({
      data: { name: 'Staff', password: passwordHash, role: 'STAFF' },
    }),
    prisma.user.create({
      data: { name: 'Customer', password: passwordHash, role: 'CUSTOMER' },
    }),
  ])

  // 2️⃣ Tạo bàn ăn
  const tables = await prisma.table.createMany({
    data: [
      { name: 'Bàn 1', qrCodeUrl: '/qrcodes/table1.png' },
      { name: 'Bàn 2', qrCodeUrl: '/qrcodes/table2.png' },
      { name: 'Bàn 3', qrCodeUrl: '/qrcodes/table3.png' },
    ],
  })

  // 3️⃣ Tạo danh mục
  const [doUong, monChinh, monTrangMieng] = await Promise.all([
    prisma.category.create({
      data: { name: 'Đồ uống', description: 'Các loại nước uống giải khát' },
    }),
    prisma.category.create({
      data: { name: 'Món chính', description: 'Các món ăn chính trong thực đơn' },
    }),
    prisma.category.create({
      data: { name: 'Tráng miệng', description: 'Các món ngọt sau bữa ăn' },
    }),
  ])

  // 4️⃣ Tạo món ăn
  const bunCha = await prisma.menuItem.create({
    data: {
      name: 'Bún chả Hà Nội',
      price: 45000,
      images: {
        create: [
          { url: 'https://res.cloudinary.com/demo/image/upload/buncha1.jpg' },
          { url: 'https://res.cloudinary.com/demo/image/upload/buncha2.jpg' },
        ],
      },
      categories: {
        create: [
          { category: { connect: { id: monChinh.id } } },
        ],
      },
    },
  })

  const caPhe = await prisma.menuItem.create({
    data: {
      name: 'Cà phê sữa đá',
      price: 25000,
      images: {
        create: [
          { url: 'https://res.cloudinary.com/demo/image/upload/caphe1.jpg' },
          { url: 'https://res.cloudinary.com/demo/image/upload/caphe2.jpg' },
        ],
      },
      categories: {
        create: [
          { category: { connect: { id: doUong.id } } },
        ],
      },
    },
  })

  const kem = await prisma.menuItem.create({
    data: {
      name: 'Kem vani',
      price: 20000,
      images: {
        create: [
          { url: 'https://res.cloudinary.com/demo/image/upload/kem1.jpg' },
        ],
      },
      categories: {
        create: [
          { category: { connect: { id: monTrangMieng.id } } },
        ],
      },
    },
  })

  // 5️⃣ Tạo order mẫu
  const order = await prisma.order.create({
    data: {
      table: { connect: { name: 'Bàn 1' } },
      user: { connect: { id: staff.id } },
      status: 'COOKING',
      items: {
        create: [
          { menuItem: { connect: { id: bunCha.id } }, quantity: 2 },
          { menuItem: { connect: { id: caPhe.id } }, quantity: 1 },
        ],
      },
    },
  })

  console.log('✅ Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
