import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  await prisma.checkIn.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.order.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing data');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@latike.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'CUSTOMER',
      isVerified: true,
    },
  });

  const hostUser = await prisma.user.create({
    data: {
      email: 'host@latike.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'HOST',
      isVerified: true,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@latike.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true,
    },
  });

  console.log('👥 Created users:', { customer: customerUser.email, host: hostUser.email, admin: adminUser.email });

  // Create events with ticket types
  const events = await Promise.all([
    prisma.event.create({
      data: {
        hostId: hostUser.id,
        title: 'Summer Music Festival',
        description: 'Join us for an unforgettable evening of live music featuring top artists from around the world. Experience amazing performances, great food, and an electric atmosphere under the stars.',
        category: 'Music',
        location: 'Warsaw',
        address: 'National Stadium, Warsaw, Poland',
        city: 'Warsaw',
        country: 'Poland',
        startDate: new Date('2024-06-15T18:00:00Z'),
        endDate: new Date('2024-06-16T02:00:00Z'),
        status: 'PUBLISHED',
        isFeatured: true,
        totalCapacity: 1200,
        tags: ['music', 'festival', 'outdoor', 'summer'],
        images: [],
        ticketTypes: {
          create: [
            {
              name: 'VIP Pass',
              description: 'VIP access with premium seating and backstage pass',
              price: 150,
              quantity: 200,
              sold: 120,
              maxPerOrder: 4,
            },
            {
              name: 'General Admission',
              description: 'Standard entry ticket',
              price: 75,
              quantity: 1000,
              sold: 430,
              maxPerOrder: 10,
            },
          ],
        },
      },
    }),
    prisma.event.create({
      data: {
        hostId: hostUser.id,
        title: 'Art Gallery Opening',
        description: 'Experience contemporary art at its finest. Join us for the opening of our new exhibition featuring works from emerging and established artists.',
        category: 'Arts',
        location: 'Krakow',
        address: 'National Museum, Krakow, Poland',
        city: 'Krakow',
        country: 'Poland',
        startDate: new Date('2024-06-20T19:00:00Z'),
        endDate: new Date('2024-06-20T23:00:00Z'),
        status: 'PUBLISHED',
        totalCapacity: 350,
        tags: ['art', 'gallery', 'culture', 'free'],
        images: [],
        ticketTypes: {
          create: [
            {
              name: 'Free Entry',
              description: 'Complimentary admission',
              price: 0,
              quantity: 350,
              sold: 120,
              maxPerOrder: 5,
            },
          ],
        },
      },
    }),
    prisma.event.create({
      data: {
        hostId: hostUser.id,
        title: 'Food & Wine Tasting',
        description: 'Indulge in a culinary journey featuring the best Polish cuisine paired with exquisite wines. A perfect evening for food enthusiasts.',
        category: 'Food',
        location: 'Gdansk',
        address: 'Old Town Market, Gdansk, Poland',
        city: 'Gdansk',
        country: 'Poland',
        startDate: new Date('2024-05-10T17:00:00Z'),
        endDate: new Date('2024-05-10T22:00:00Z'),
        status: 'COMPLETED',
        totalCapacity: 80,
        tags: ['food', 'wine', 'tasting', 'gourmet'],
        images: [],
        ticketTypes: {
          create: [
            {
              name: 'Premium Tasting',
              description: 'Premium wine and food pairing experience',
              price: 200,
              quantity: 80,
              sold: 80,
              maxPerOrder: 2,
            },
          ],
        },
      },
    }),
    prisma.event.create({
      data: {
        hostId: adminUser.id,
        title: 'Outdoor Yoga Session',
        description: 'Start your day with a refreshing yoga session in the beautiful park. Suitable for all levels, from beginners to advanced practitioners.',
        category: 'Wellness',
        location: 'Wroclaw',
        address: 'Szczytnicki Park, Wroclaw, Poland',
        city: 'Wroclaw',
        country: 'Poland',
        startDate: new Date('2024-07-01T07:00:00Z'),
        endDate: new Date('2024-07-01T08:30:00Z'),
        status: 'PUBLISHED',
        totalCapacity: 50,
        tags: ['yoga', 'outdoor', 'fitness', 'morning'],
        images: [],
        ticketTypes: {
          create: [
            {
              name: 'Single Session',
              description: 'One yoga session with equipment provided',
              price: 50,
              quantity: 50,
              sold: 15,
              maxPerOrder: 3,
            },
          ],
        },
      },
    }),
    prisma.event.create({
      data: {
        hostId: adminUser.id,
        title: 'Tech Conference 2024',
        description: 'Join industry leaders and innovators for a day of insights, networking, and cutting-edge technology discussions.',
        category: 'Technology',
        location: 'Poznan',
        address: 'Poznan International Fair, Poznan, Poland',
        city: 'Poznan',
        country: 'Poland',
        startDate: new Date('2024-08-15T09:00:00Z'),
        endDate: new Date('2024-08-15T18:00:00Z'),
        status: 'PUBLISHED',
        isFeatured: true,
        totalCapacity: 500,
        tags: ['tech', 'conference', 'networking', 'innovation'],
        images: [],
        ticketTypes: {
          create: [
            {
              name: 'Early Bird',
              description: 'Discounted early registration',
              price: 250,
              quantity: 100,
              sold: 85,
              maxPerOrder: 5,
            },
            {
              name: 'Standard Pass',
              description: 'Full conference access',
              price: 350,
              quantity: 400,
              sold: 165,
              maxPerOrder: 5,
            },
          ],
        },
      },
    }),
  ]);

  console.log('🎉 Created events:', events.length);

  // Get events with their ticket types
  const eventsWithTicketTypes = await prisma.event.findMany({
    include: {
      ticketTypes: true,
    },
  });

  // Create orders and tickets
  const orders = await Promise.all([
    // Order for Summer Music Festival (VIP)
    prisma.order.create({
      data: {
        userId: customerUser.id,
        eventId: eventsWithTicketTypes[0].id,
        totalAmount: 150,
        serviceFee: 7.5,
        platformFee: 7.5,
        status: 'COMPLETED',
        tickets: {
          create: {
            eventId: eventsWithTicketTypes[0].id,
            ticketTypeId: eventsWithTicketTypes[0].ticketTypes[0].id,
            qrCode: 'LAT-2024-000001',
            qrHash: crypto.createHash('sha256').update('LAT-2024-000001').digest('hex'),
            holderName: 'John Doe',
            holderEmail: 'customer@latike.com',
          },
        },
        payment: {
          create: {
            amount: 165,
            status: 'SUCCEEDED',
            stripePaymentId: 'pi_test_123',
            paymentMethod: 'card',
          },
        },
      },
    }),
    // Order for Art Gallery Opening (Free)
    prisma.order.create({
      data: {
        userId: customerUser.id,
        eventId: eventsWithTicketTypes[1].id,
        totalAmount: 0,
        serviceFee: 0,
        platformFee: 0,
        status: 'COMPLETED',
        tickets: {
          create: {
            eventId: eventsWithTicketTypes[1].id,
            ticketTypeId: eventsWithTicketTypes[1].ticketTypes[0].id,
            qrCode: 'LAT-2024-000002',
            qrHash: crypto.createHash('sha256').update('LAT-2024-000002').digest('hex'),
            holderName: 'John Doe',
            holderEmail: 'customer@latike.com',
          },
        },
      },
    }),
    // Order for Food & Wine Tasting (Used)
    prisma.order.create({
      data: {
        userId: customerUser.id,
        eventId: eventsWithTicketTypes[2].id,
        totalAmount: 200,
        serviceFee: 10,
        platformFee: 10,
        status: 'COMPLETED',
        tickets: {
          create: {
            eventId: eventsWithTicketTypes[2].id,
            ticketTypeId: eventsWithTicketTypes[2].ticketTypes[0].id,
            qrCode: 'LAT-2024-000003',
            qrHash: crypto.createHash('sha256').update('LAT-2024-000003').digest('hex'),
            status: 'USED',
            holderName: 'John Doe',
            holderEmail: 'customer@latike.com',
            scannedAt: new Date('2024-05-10T18:30:00Z'),
          },
        },
        payment: {
          create: {
            amount: 220,
            status: 'SUCCEEDED',
            stripePaymentId: 'pi_test_456',
            paymentMethod: 'card',
          },
        },
      },
    }),
    // Additional order for Summer Music Festival (General)
    prisma.order.create({
      data: {
        userId: customerUser.id,
        eventId: eventsWithTicketTypes[0].id,
        totalAmount: 75,
        serviceFee: 3.75,
        platformFee: 3.75,
        status: 'COMPLETED',
        tickets: {
          create: {
            eventId: eventsWithTicketTypes[0].id,
            ticketTypeId: eventsWithTicketTypes[0].ticketTypes[1].id,
            qrCode: 'LAT-2024-000004',
            qrHash: crypto.createHash('sha256').update('LAT-2024-000004').digest('hex'),
            holderName: 'John Doe',
            holderEmail: 'customer@latike.com',
          },
        },
        payment: {
          create: {
            amount: 82.5,
            status: 'SUCCEEDED',
            stripePaymentId: 'pi_test_789',
            paymentMethod: 'card',
          },
        },
      },
    }),
  ]);

  console.log('🎫 Created orders and tickets:', orders.length);

  // Get orders with tickets to create check-ins
  const ordersWithTickets = await prisma.order.findMany({
    where: {
      id: { in: orders.map(order => order.id) },
    },
    include: {
      tickets: true,
    },
  });

  // Create some check-ins
  await prisma.checkIn.create({
    data: {
      ticketId: ordersWithTickets[2].tickets[0].id,
      scannedBy: hostUser.id,
      scannedAt: new Date('2024-05-10T18:30:00Z'),
      location: 'Main Entrance',
      deviceInfo: 'iPhone 14 Pro',
    },
  });

  console.log('✅ Created check-ins');

  // Update ticket type sold counts
  for (const event of eventsWithTicketTypes) {
    for (const ticketType of event.ticketTypes) {
      const soldCount = await prisma.ticket.count({
        where: {
          ticketTypeId: ticketType.id,
        },
      });

      await prisma.ticketType.update({
        where: { id: ticketType.id },
        data: { sold: soldCount },
      });
    }
  }

  console.log('📊 Updated ticket type statistics');

  // Print summary
  console.log('\n✅ Database seeding completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`   Users: ${3}`);
  console.log(`   Events: ${events.length}`);
  console.log(`   Orders: ${orders.length}`);
  console.log(`   Ticket Types: ${events.reduce((acc, event) => acc + event.ticketTypes.length, 0)}`);
  console.log('\n🔑 Test Accounts:');
  console.log(`   Customer: customer@latike.com / password123`);
  console.log(`   Host: host@latike.com / password123`);
  console.log(`   Admin: admin@latike.com / password123`);
  console.log('\n🎯 Ready to test the application!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
