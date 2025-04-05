import { prisma } from "../client.js";
// Initialize seats
export async function initializeSeatsFn (req, res) {
    try {
      // Check if seats are already initialized
      const seatCount = await prisma.seat.count();
      
      if (seatCount === 0) {
        // Define our seat layout: 11 rows with 7 seats each, plus 1 row with 3 seats
        const seatsToCreate = [];
        
        for (let row = 1; row <= 11; row++) {
          for (let seat = 1; seat <= 7; seat++) {
            seatsToCreate.push({
              rowNumber: row,
              seatNumber: seat,
              isBooked: false
            });
          }
        }
        
        // Add the last row with 3 seats
        for (let seat = 1; seat <= 3; seat++) {
          seatsToCreate.push({
            rowNumber: 12,
            seatNumber: seat,
            isBooked: false
          });
        }
        
        // Create all seats in a batch operation
        await prisma.seat.createMany({
          data: seatsToCreate
        });
        
        return res.status(201).json({ message: 'Seats initialized successfully', count: seatsToCreate.length });
      }
      
      return res.status(200).json({ message: 'Seats already initialized', count: seatCount });
    } catch (error) {
      console.error('Error initializing seats:', error);
      return res.status(500).json({ error: 'Failed to initialize seats' });
    }
  };
  
  // Get all seats with their booking status
export async function allSeatsBookingStatus (req, res) {
    try {
      const seats = await prisma.seat.findMany({
        orderBy: [
          { rowNumber: 'asc' },
          { seatNumber: 'asc' }
        ]
      });
      
      // Group seats by row for easier frontend rendering
      const seatsByRow = seats.reduce((acc, seat) => {
        if (!acc[seat.rowNumber]) {
          acc[seat.rowNumber] = [];
        }
        acc[seat.rowNumber].push(seat);
        return acc;
      }, {});
      
      const totalSeats = seats.length;
      const bookedSeats = seats.filter(seat => seat.isBooked).length;
      const availableSeats = totalSeats - bookedSeats;
      
      return res.status(200).json({
        seats: seatsByRow,
        stats: {
          total: totalSeats,
          booked: bookedSeats,
          available: availableSeats
        }
      });
    } catch (error) {
      console.error('Error fetching seats:', error);
      return res.status(500).json({ error: 'Failed to fetch seats' });
    }
  }
  
  // Book seats
  export async function bookSeatsFn (req, res) {
    const { numberOfSeats } = req.body;
    const userId = req.user.id;
    
    if (!numberOfSeats || numberOfSeats <= 0) {
      return res.status(400).json({ error: 'Please provide a valid number of seats' });
    }
    if(numberOfSeats > 7) return res.status(400).json({error: 'Atmost 7 seats can be booked at a time!'})
    
    try {
      // Start a transaction to ensure data consistency
      return await prisma.$transaction(async (prisma) => {
        // Get all available seats ordered by row and seat number
        const availableSeats = await prisma.seat.findMany({
          where: { isBooked: false },
          orderBy: [
            { rowNumber: 'asc' },
            { seatNumber: 'asc' }
          ]
        });
        
        if (availableSeats.length < numberOfSeats) {
          return res.status(400).json({ 
            error: `Not enough seats available. Only ${availableSeats.length} seats left.` 
          });
        }
        
        // Find the optimal seating arrangement (try to keep seats in the same row)
        const seatsToBook = findOptimalSeats(availableSeats, numberOfSeats);
        
        if (!seatsToBook.length) {
          return res.status(400).json({ error: 'Could not find suitable seats' });
        }
        
        // Create a booking record
        const booking = await prisma.booking.create({
          data: {
            userId
          }
        });
        
        // Update the seat records
        for (const seat of seatsToBook) {
          await prisma.seat.update({
            where: { id: seat.id },
            data: {
              isBooked: true,
              bookingId: booking.id
            }
          });
        }
        
        return res.status(200).json({
          message: `Successfully booked ${seatsToBook.length} seats`,
          booking: {
            id: booking.id,
            seats: seatsToBook.map(seat => ({ row: seat.rowNumber, seat: seat.id }))
          }
        });
      });
    } catch (error) {
      console.error('Error booking seats:', error);
      return res.status(500).json({ error: 'Failed to book seats' });
    }
  };
  
  // Reset all bookings (for testing/admin purposes)
  export async function resetAllBookings(req, res) {
    try {
      // Delete all bookings
      await prisma.booking.deleteMany({});
      
      // Reset all seats to not booked
      await prisma.seat.updateMany({
        data: {
          isBooked: false,
          bookingId: null
        }
      });
      
      return res.status(200).json({ message: 'All bookings have been reset' });
    } catch (error) {
      console.error('Error resetting bookings:', error);
      return res.status(500).json({ error: 'Failed to reset bookings' });
    }
  };
  
  // Helper function to find optimal seats
  function findOptimalSeats(availableSeats, numberOfSeats) {
    // Group available seats by row
    const seatsByRow = availableSeats.reduce((acc, seat) => {
      if (!acc[seat.rowNumber]) {
        acc[seat.rowNumber] = [];
      }
      acc[seat.rowNumber].push(seat);
      return acc;
    }, {});
    
    // First try: Find a single row with enough consecutive seats
    for (const rowNumber in seatsByRow) {
      const rowSeats = seatsByRow[rowNumber];
      if (rowSeats.length >= numberOfSeats) {
        // Found a row with enough seats
        return rowSeats.slice(0, numberOfSeats);
      }
    }
    
    // Second try: Find seats spread across adjacent rows
    let remainingSeats = numberOfSeats;
    let selectedSeats = [];
    
    const rows = Object.keys(seatsByRow).sort((a, b) => a - b);
    for (let i = 0; i < rows.length && remainingSeats > 0; i++) {
      const rowSeats = seatsByRow[rows[i]];
      const seatsToTake = Math.min(remainingSeats, rowSeats.length);
      
      selectedSeats = [...selectedSeats, ...rowSeats.slice(0, seatsToTake)];
      remainingSeats -= seatsToTake;
    }
    
    return selectedSeats;
  }
  