import React, { useState, useEffect } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import axios from 'axios';
import LoadingButton from '../Components/LoadingButton';
import SeatsSkeleton from '../Components/SeatsSkeleton';

const TicketBooking = () => {
  const [numberOfSeats, setNumberOfSeats] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [availableSeats, setAvailableSeats] = useState(80);
  const [bookedSeats, setBookedSeats] = useState(0);
  const [confirmBookedSeats, setConfirmBookedSeats] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [ResetLoading, setResetLoading] = useState(false);
  const [BookBtnLoading, setBookBtnLoading] = useState(false);


  const [seats, setSeats] = useState([]);




  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);


  async function allSeatsStatusFn() {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/booking/allSeatsBookingStatus`);
      setLoading(false);
      setSeats({ ...res.data.seats })
      setBookedSeats(res.data.stats.booked);
      setAvailableSeats(res.data.stats.available)
      showToast(res.data.message, 'success');
    } catch (e) {
      setLoading(false);
      console.log(e);
      showToast(e.response.data.error, 'error');
      return;
    }
  }
  useEffect(() => {
    allSeatsStatusFn();
  }, []);
  const bookTicketsFn = async (e) => {
    e.preventDefault();
    try {
      setBookBtnLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/booking/bookSeats`, { numberOfSeats }, {
        headers: {
          'authorization': localStorage.getItem('token')
        }
      });
      setBookBtnLoading(false);
      allSeatsStatusFn();
      setConfirmBookedSeats(res.data.booking.seats)
      showToast(res.data.message, 'success');
    } catch (e) {
      setBookBtnLoading(false);
      showToast(e.response.data.error, 'error');
      return;
    }
  }


  const resetBookingsFn = async (e) => {
    e.preventDefault();
    try {
      setResetLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/booking/resetAllBookings`);
      setResetLoading(false);
      allSeatsStatusFn();
      showToast(res.data.message, 'success');
    } catch (e) {
      setResetLoading(false);
      showToast(e.response.data.error, 'error');
      return;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Ticket Booking</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Seats Grid */}
          {/* <SeatsSkeleton /> */}
          {Loading ? <SeatsSkeleton /> :
            <div className="flex-1">
              <div>
                {Object.keys(seats).map(seat =>
                  <div className="grid grid-cols-7 gap-2 mt-1.5" id={seat}>
                    {seats[seat].map((obj) =>
                      <button
                        key={obj.id}
                        className={`
                          py-2 px-4 rounded-md text-center transition-colors text-black ${obj.isBooked ? `bg-yellow-500 hover:bg-yellow-600` : `  bg-green-500  hover:bg-green-600 `}
                        `}
                      >
                        {obj.id}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <div className="bg-yellow-400 p-2 rounded-md text-center flex-1">
                  Booked Seats = {bookedSeats}
                </div>
                <div className="bg-green-500 p-2 rounded-md text-center flex-1">
                  Available Seats = {availableSeats}
                </div>
              </div>
            </div>
          }

          {/* Booking Form */}
          <div className="md:w-64 lg:w-80">
            <div className="bg-white rounded p-4">
              <h2 className="text-lg font-semibold mb-4">Book Seats</h2>
              <div>
                {confirmBookedSeats.map((obj)=>
                <button
                  key={obj.seat}
                  className={`
                          py-2 px-4 my-2 mx-1 rounded-md text-center transition-colors text-black bg-yellow-500
                        `}
                >
                 {obj.seat}
                </button>)}
              </div>
              <input
                type="number"
                placeholder="Enter number of seats"
                className="w-full p-2 border rounded mb-4"
                value={numberOfSeats}
                onChange={(e) => setNumberOfSeats(e.target.value)}
                min="1"
                max={availableSeats}
              />
              {BookBtnLoading ? <LoadingButton label='Book' /> :
                <button
                  onClick={bookTicketsFn}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-2"
                >
                  Book
                </button>}
              {ResetLoading ? <LoadingButton label='Reset Booking' /> :
                <button
                  onClick={resetBookingsFn}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-500"
                >
                  Reset Booking
                </button>}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-4 right-4 max-w-md p-4 rounded-md shadow-lg flex items-center gap-3 transition-opacity ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}>
          {toast.type === 'error' ?
            <AlertCircle className="h-5 w-5" /> :
            <Check className="h-5 w-5" />
          }
          <p>{toast.message}</p>
        </div>
      )}
    </div>
  );
};

export default TicketBooking;