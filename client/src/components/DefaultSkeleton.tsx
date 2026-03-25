import GetMazza from "../assets/images/GetMazza logo2.png";
import { motion } from "framer-motion";

const DefaultSkeleton = () => {
  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
      {/* Centered Content */}
      <div className="flex flex-col items-center justify-center gap-4">
        <img 
          src={GetMazza} 
          alt="GetMazza" 
          className="w-32 md:w-48 mx-auto" // Adjust size as needed
        />
        <p className="text-white text-lg md:text-xl font-wellston tracking-wider">
          Where Luxury Meets Lifestyle
        </p>
      </div>

      {/* Loading Bar at Bottom */}
      <div className="p-4 lg:w-[30rem] md:w-[20rem] sm:w-[16rem] mt-4">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatType: 'loop',
            ease: "easeInOut"
          }}
          className="h-1 bg-[linear-gradient(90deg,#A52A2A_0%,#8B5E3C_100%)]"
        />
      </div>
    </div>
  );
};

export default DefaultSkeleton;