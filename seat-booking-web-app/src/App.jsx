import { lazy, Suspense } from 'react';
const TicketBooking = lazy(() => import('./Pages/TicketBooking'));
const Signin = lazy(() => import('./Pages/Signin'));
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import BookingSkeleton from './Components/BookingSkeleton';
import Signup from './Pages/Signup';

function App() {

 return <>
 <BrowserRouter>
   <Routes>
     <Route path='/' element={
       <Navigate replace to={`/signin`}/>
     } />
     <Route path='/signup' element={<Signup />} />
     <Route path='/signin' element={<Signin />} />
     
     <Route path='/ticket-booking' element={
       <Suspense fallback={
         <BookingSkeleton />
       }>
         <TicketBooking />
       </Suspense>
     } />
    
   </Routes>
 </BrowserRouter>
</>
}

export default App
