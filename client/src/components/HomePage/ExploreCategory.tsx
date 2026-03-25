import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import Img1 from "../../assets/images/Hotel.jpg";
import Img2 from "../../assets/images/Dinning.jpg";
import Img3 from "../../assets/images/Social club.jpg";
import Img4 from "../../assets/images/Plane 2.jpg";
import Img5 from "../../assets/images/Social club.jpg";
import Img6 from "../../assets/images/Dinning.jpg";

const ExploreCategory = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Extended categories for infinite loop
  const categories = [
    { name: "Hotels", image: Img1 },
    { name: "Restaurants", image: Img2 },
    { name: "Events", image: Img3 },
    { name: "Travel", image: Img4 },
    { name: "Nightlife", image: Img5 },
    { name: "Shopping", image: Img6 },
  ];

  // Create infinite loop by duplicating categories
  const extendedCategories = [...categories, ...categories, ...categories];

  // Determine how many items to show based on screen width
  const itemsToShow = typeof window !== 'undefined' ? 
    (window.innerWidth < 768 ? 3 : 6) : 6;

  const handlePrev = () => {
    setAutoScroll(false);
    setCurrentIndex(prev => 
      prev <= 0 ? extendedCategories.length - itemsToShow : prev - 1
    );
    setTimeout(() => setAutoScroll(true), 5000);
  };

  const handleNext = () => {
    setAutoScroll(false);
    setCurrentIndex(prev => 
      prev >= extendedCategories.length - itemsToShow ? 0 : prev + 1
    );
    setTimeout(() => setAutoScroll(true), 5000);
  };

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => 
        prev >= extendedCategories.length - itemsToShow ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [autoScroll, extendedCategories.length, itemsToShow]);

  // Get visible categories with infinite loop logic
  const getVisibleCategories = () => {
    let endIndex = currentIndex + itemsToShow;
    if (endIndex > extendedCategories.length) {
      const overflow = endIndex - extendedCategories.length;
      return [
        ...extendedCategories.slice(currentIndex),
        ...extendedCategories.slice(0, overflow)
      ];
    }
    return extendedCategories.slice(currentIndex, endIndex);
  };

  const visibleCategories = getVisibleCategories();

  return (
    <section className="bg-black w-full py-12 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between container max-w-6xl px-4 mx-auto md:px-6 lg:px-8 mb-10"> {/* Increased mb-8 to mb-10 */}
        <h3 className='font-glass text-white text-xl md:text-2xl mb-4 md:mb-0'>
          Explore Category
        </h3>
        <div className='flex space-x-4'>
            <button 
                onClick={handlePrev}
                className="group bg-bronze/10 text-bronze w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors relative overflow-hidden"
            >
                <motion.span
                className="absolute inset-0 flex items-center justify-center"
                whileHover={{ x: -16 }}
                whileTap={{ scale: 0.95 }}
                >
                <FaArrowLeft className="text-bronze z-30"/>
                </motion.span>
            </button>
            
            <button 
                onClick={handleNext}
                className="group bg-bronze/10 text-bronze w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors relative overflow-hidden"
            >
                <motion.span
                className="absolute inset-0 flex items-center justify-center"
                whileHover={{ x: 16 }}
                whileTap={{ scale: 0.95 }}
                >
                <FaArrowRight className="text-bronze z-30"/>
                </motion.span>
            </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex justify-start md:justify-center space-x-4 md:space-x-6 lg:space-x-8 px-4 md:px-6 overflow-x-auto pb-6 pt-2" // Added pt-2 for top padding
      >
        {visibleCategories.map((category, index) => (
          <motion.div
            key={`${category.name}-${index}`}
            whileHover={{ scale: 1.05, y: -5 }} // Added upward movement on hover
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="flex-shrink-0 py-3" // Added pb-2 for bottom padding
          >
            <Link to='' className="flex flex-col items-center space-y-3">
              <motion.div 
                className="w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden border-2 border-bronze/30 hover:border-bronze relative"
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover absolute top-0 left-0"
                />
              </motion.div>
              <p className="text-white font-wellston text-sm md:text-base whitespace-nowrap">
                {category.name}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ExploreCategory;