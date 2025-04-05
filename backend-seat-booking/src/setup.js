// import { PrismaClient } from '@prisma/client/edge'
// import { withAccelerate } from '@prisma/extension-accelerate'
// import 'dotenv/config';

// export const prisma = new PrismaClient({
//     datasourceUrl: process.env.DATABASE_URL,
// }).$extends(withAccelerate())

// async function main() {
//   console.log('Starting database setup...');

//   // Clear existing data
// //   await prisma.seat.deleteMany({});
// //   await prisma.booking.deleteMany({});
// //   await prisma.user.deleteMany({});

//   console.log('Creating seats...');
  
//   // Create seats: 11 rows with 7 seats each, plus 1 row with 3 seats
//   const seatsToCreate = [];
  
//   for (let row = 1; row <= 11; row++) {
//     for (let seat = 1; seat <= 7; seat++) {
//       seatsToCreate.push({
//         rowNumber: row,
//         seatNumber: seat,
//         isBooked: false
//       });
//     }
//   }
  
//   // Add the last row with 3 seats
//   for (let seat = 1; seat <= 3; seat++) {
//     seatsToCreate.push({
//       rowNumber: 12,
//       seatNumber: seat,
//       isBooked: false
//     });
//   }
  
//   // Create all seats in a batch operation
//   await prisma.seat.createMany({
//     data: seatsToCreate
//   });
  
//   console.log(`Created ${seatsToCreate.length} seats`);
  
//   console.log('Database setup completed successfully');
// }

// main()
//   .catch((e) => {
//     console.error('Error during database setup:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });