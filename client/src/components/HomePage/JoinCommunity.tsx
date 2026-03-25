// import { useState } from "react";
// import imgTicket from "../../assets/images/Get Mazza Icon 1-18.svg"
// import { Link } from 'react-router-dom'
// import { GoArrowRight, GoArrowUpRight } from 'react-icons/go';


// const JoinCommunity = () => {

//   const [isHovered, setIsHovered] = useState(false);
//   return (
//     <section className="bg-black w-full py-16">
//       <div className="container max-w-6xl mx-auto px-4">
//         <div className="flex flex-col md:flex-row items-center justify-between gap-8">
//           <div className="w-full md:w-1/2">
//             <div className="relative">
//               <img
//                 src={imgTicket}
//                 alt="Event Tickets"
//                 className="w-40 h-auto"
//               />
//             </div>
//           </div>
//            <div className="w-full md:w-1/2 flex justify-between items-center">
//              <h2 className="text-white font-glass text-xl md:text-2xl lg:text-4xl mb-4 ">
//               Join our community and enjoy premium access to exclusive events, travel perks, hospitality deals, and much more.
//              </h2>
//              <Link 
//              to="/events" 
//              onMouseEnter={() => setIsHovered(true)} 
//              onMouseLeave={() => setIsHovered(false)}
//              className="px-4 py-2 w-fit h-fit flex items-center justify-center text-white font-sans text-sm md:text-base rounded-full hover:bg-bronze/20 transition-all duration-300"
//              style={{
//                background: 'linear-gradient(232deg, rgba(184, 115, 51, 1) 17%, rgba(165, 42, 42, 1) 71%)'
//              }}
//            >
//              Become a Member
//              {isHovered ? (
//                <GoArrowRight className="ml-2 text-sm md:text-base"/>
//              ) : (
//                <GoArrowUpRight className="ml-2 text-sm md:text-base"/>
//              )}
//           </Link>
//           </div>
         
//          </div>
//        </div>
//      </section>
//   );
// };

// export default JoinCommunity;

import { useState } from "react";
import imgTicket from "../../assets/images/Get Mazza Icon 1-18.svg";
import { Link } from 'react-router-dom';
import { GoArrowRight, GoArrowUpRight } from 'react-icons/go';

const JoinCommunity = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <section className="bg-black w-full py-12 md:py-16 lg:py-20">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 lg:gap-12">
          {/* Image Section */}
          <div className="w-full md:w-auto flex justify-center md:justify-start">
            <div className="relative">
              <img
                src={imgTicket}
                alt="Event Tickets"
                className="w-32 sm:w-36 md:w-40 lg:w-44 h-auto"
              />
            </div>
          </div>
          
          {/* Content Section */}
          <div className="w-full md:flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <h2 className="text-white font-glass text-xl sm:text-2xl md:text-2xl lg:text-3xl leading-tight md:leading-normal lg:leading-relaxed">
              Join our community and enjoy premium access to exclusive events, travel perks, hospitality deals, and much more.
            </h2>
            
            <div className="flex justify-center md:justify-end mt-4 md:mt-0">
            <Link 
                to="/events" 
                onMouseEnter={() => setIsHovered(true)} 
                onMouseLeave={() => setIsHovered(false)}
                className="px-3 py-4 sm:px-4 sm:py-2.5 flex items-center justify-center text-white font-sans text-base sm:text-lg md:text-base lg:text-md rounded-full hover:bg-bronze/20 transition-all duration-300 whitespace-nowrap"
                style={{
                  background: 'linear-gradient(232deg, rgba(184, 115, 51, 1) 17%, rgba(165, 42, 42, 1) 71%)'
                }}
              >
                Become a Member
                {isHovered ? (
                  <GoArrowRight className="ml-2 "/>
                ) : (
                  <GoArrowUpRight className="ml-2 "/>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinCommunity;