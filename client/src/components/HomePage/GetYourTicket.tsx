import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import TicketImg from '../../assets/images/Ticket_Style-removebg-preview.png';

const GetYourTicket = () => {
  // Set your target date (e.g., April 30, 2025 at 23:59:59)
  const targetDate = new Date('2025-06-30T23:59:59').getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="bg-black w-full">
      <div className="rounded-br-[3rem] rounded-bl-[3rem] md:rounded-br-[4rem] md:rounded-bl-[4rem] h-28 md:h-28 bg-auburn">
        <div className="flex flex-col md:flex-row items-center justify-between h-full container max-w-6xl px-4 mx-auto md:px-6 lg:px-8 py-2 md:py-0">
          {/* Left Section - Ticket Info */}
          <motion.div 
            className="flex items-center space-x-3 md:space-x-5 mb-2 md:mb-0"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src={TicketImg} 
              alt="VIP Ticket"  
              className='w-10 md:w-20 lg:w-24 h-auto object-contain'
            />
            <h3 className='text-white font-glass text-lg sm:text-xl md:text-2xl leading-tight'>
              Grab Yourself a <br className="hidden sm:inline" /> VIP Ticket
            </h3>
          </motion.div>

          {/* Right Section - Countdown */}
          <motion.div 
            className="flex space-x-3 sm:space-x-4 md:space-x-5"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CountdownBox value={timeLeft.days} label="Days" />
            <CountdownBox value={timeLeft.hours} label="Hours" />
            <CountdownBox value={timeLeft.minutes} label="Minutes" />
            <CountdownBox value={timeLeft.seconds} label="Seconds" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Separate component for animated countdown numbers
const CountdownBox = ({ value, label }: { value: number; label: string }) => {
  return (
    <div className='text-center min-w-[50px] sm:min-w-[60px]'>
      <motion.h4 
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className='text-black font-bold text-lg sm:text-2xl md:text-3xl font-glass'
      >
        {Math.floor(value)}
      </motion.h4>
      <p className='text-white text-xs sm:text-sm md:text-base font-wellston'>{label}</p>
    </div>
  );
};

export default GetYourTicket;