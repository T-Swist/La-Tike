import { useState } from 'react';

import { FaStar } from 'react-icons/fa';

const OurServices = () => {
  const [activeCard, setActiveCard] = useState(0);
  
  const services = [
    {
      title: "Bespoke Event Curation",
      description: "From intimate soirées to grand celebrations, we craft unforgettable moments tailored to your vision.",
      rating: 1 // 1 star
    },
    {
      title: "Luxury Travel Planning",
      description: "Tailored itineraries to the world's most exclusive destinations with VIP treatment at every step.",
      rating: 2 // 2 star
    },
    {
      title: "Gourmet Experiences",
      description: "Access to Michelin-starred chefs, private dining, and rare culinary adventures.",
         rating: 3 // 3 star
    },
    {
      title: "Membership Services",
      description: "Exclusive access to private clubs, events, and a network of like-minded individuals.",
         rating: 4 // 4 star
    }
  ];

  return (
    <section className="w-full py-16 overflow-hidden bg-black relative">
      {/* Radial gradient overlay */}
      <div 
        className="absolute inset-0 opacity-80" 
        style={{
          background: 'radial-gradient(circle at center -20%, rgba(181, 113, 49, 0.5) 0%, rgba(0, 0, 0, 1) 70%)'
        }}
      />

      <div className="container max-w-6xl px-4 mx-auto md:px-6 lg:px-8 relative z-10">
        <h2 className='font-glass text-white text-4xl md:text-5xl text-center mb-16'>
          Our Services
        </h2> 
      
        <div className="relative max-w-4xl mx-auto">
          <div className="relative h-[400px] w-full">
            {services.map((service, index) => (
              <div 
                key={index}
                onClick={() => setActiveCard(index)}
                className={`absolute transition-all duration-500 ease-in-out transform cursor-pointer
                  ${index === activeCard ? 'z-30 w-[80%] md:w-[36%]' : 'md:w-[38%]'}
                  ${index === activeCard ? 'opacity-100' : 'opacity-80'}
                `}
                style={{
                  left: `${50 + (index - activeCard) * 15}%`,
                  transform: `
                    translateX(-50%)
                    rotateY(${(index - activeCard) * 15}deg)
                    scale(${index === activeCard ? 1 : 0.9})
                  `,
                  transformOrigin: 'center',
                  perspective: '1000px',
                }}
              >
                <div 
                  className={`h-full bg-[#111111] rounded-2xl overflow-hidden shadow-2xl ${
                    index === activeCard ? 'border border-gray-400' : 'border border-[#B57131]/20'
                  }`}
                  style={{
                    background: 'linear-gradient(145deg, rgba(181, 113, 49, 0.15) 0%, rgba(0, 0, 0, 0.95) 100%)',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div className="p-8 relative h-full">
                    <h3 className="font-glass text-[#B57131] text-2xl md:text-3xl mb-4">
                      {service.title}
                    </h3>
                    <p className="font-wellston text-gray-300 text-base md:text-lg leading-relaxed mb-8">
                      {service.description}
                    </p>
                  <div className="absolute bottom-6 left-8 flex items-center gap-1">
                      {[...Array(4)].map((_, i) => (
                        <FaStar 
                          key={i}
                          className={`text-${i < service.rating ? 'bronze' : 'gray-600'}`}
                          size={18}
                        />
                      ))}
                      </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServices;

