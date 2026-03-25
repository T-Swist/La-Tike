import { motion } from 'framer-motion';
import { FaWhatsapp } from "react-icons/fa";
import { useState } from 'react';

const WhatsAppButton = () => {
  const [isHover, setIsHover] = useState(false);
  const handleClick = () => {
    window.open('https://wa.me/+231775536673', '_blank');
  };

  return (
    <motion.div
      className="fixed z-50 bottom-16 right-8 bg-[#0e7835] text-white rounded-full shadow-lg flex items-center justify-center overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {/* Circular Icon Button (default state) */}
      {!isHover && (
        <motion.div
          className="p-3"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <FaWhatsapp size={32} />
        </motion.div>
      )}

      {/* Expanded "Chat on Us" Button (hover state) */}
      {isHover && (
        <motion.div
          className="px-4 py-3 flex items-center"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
        >
          <FaWhatsapp className="mr-2" size={20} />
          <span className="whitespace-nowrap">Chat With Us</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WhatsAppButton;