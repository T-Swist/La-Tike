// import { Link } from 'react-router-dom';

// import AppStoreImg from "../../assets/images/apple-removebg-preview.png";
// import GooglePlayImg from "../../assets/images/playstore-removebg-preview.png";
// import GetMazzaLogo from "../../assets/images/GetMazza logo2.png"
// import { FaEnvelope, FaInstagram, FaFacebook } from 'react-icons/fa';
// import { FaX } from 'react-icons/fa6';

// const Footer = () => {
//   return (
//     <footer className="pt-16 pb-8" style={{ background: 'linear-gradient(9deg,rgba(3, 3, 3, 1) 55%, rgba(165, 42, 49, 1) 100%)'}}>
     
//         <div className=" mx-auto md:px-12 sm:px-4 px-4">
//           <div className="grid grid-cols-1 md:grid-cols-4 space-x-12 mb-12">
//             <div>
//               <Link to="/">
//                 <img src={GetMazzaLogo} className="w-44 mb-8" />
//               </Link>
              
//               <p className="text-gray-400 font-wellston md:w-60">Premium online ticketing and event curation platform for luxury experiences.</p>
//               <div className="flex gap-4 mt-20">
//                 <Link to="" className='text-gray-400 text-xl hover:text-bronze transition-colors'>
//                   <FaEnvelope />
//                 </Link>
//                 <Link to="" className='text-gray-400 text-xl hover:text-bronze transition-colors'>
//                   <FaX />
//                 </Link>
//                 <Link to="" className='text-gray-400 text-xl hover:text-bronze transition-colors'>
//                   <FaFacebook />
//                 </Link>
//                 <Link to="" className='text-gray-400 text-xl hover:text-bronze transition-colors'>
//                   <FaInstagram />
//                 </Link>
//               </div>
//             </div>
//             <div className='grid grid-cols-2 md:grid-cols-2 space-x-8 w-36'>
//               <div>
//                 <h4 className="text-lg font-display text-white mb-4">Quick Links</h4>
//                 <ul className="space-y-3 font-sans">
//                   <li><Link to="/our-story" className="text-gray-400 hover:text-bronze transition-colors">Our Story</Link></li>
//                   <li><Link to="/services" className="text-gray-400 hover:text-bronze transition-colors">Services</Link></li>
//                   <li><Link to="/social-club" className="text-gray-400 hover:text-bronze transition-colors">Social Club</Link></li>
//                 </ul>
//               </div>
              
//               <div>
//                 <h4 className="text-lg font-display text-white mb-4">Legal</h4>
//                 <ul className="space-y-3 font-sans">
//                 <li><Link to="/terms" className="text-gray-400 hover:text-bronze transition-colors">Contact Us</Link></li>
//                 <li><Link to="/privacy" className="text-gray-400 hover:text-bronze transition-colors">FAQs</Link></li>
//                   <li><Link to="/terms" className="text-gray-400 hover:text-bronze transition-colors">Terms of Service</Link></li>
//                   <li><Link to="/privacy" className="text-gray-400 hover:text-bronze transition-colors">Privacy Policy</Link></li>
//                   <li><Link to="/refund" className="text-gray-400 hover:text-bronze transition-colors">Refund Policy</Link></li>
//                 </ul>
//               </div>
//             </div>
            
            
//             <div className="">
//               <h4 className="text-lg font-display text-white mb-4">Newsletter</h4>
//               <p className="text-gray-400 mb-4 font-sans">Join our community for exclusive updates</p>
//               <div className="flex">
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   className="bg-black/30 text-white px-2 py-2 rounded-l-md border border-gray-800 outline-none flex-1 font-sans"
//                 />
//                 <button className="bg-bronze px-2 py-2 rounded-r-md font-sans hover:bg-auburn transition-colors">
//                   Subscribe
//                 </button>
//               </div>
//             </div>
//           </div>


          
//           <div className="border-t border-gray-800 pt-8">
//             <div className="flex flex-col md:flex-row justify-between items-center">
//               <p className="text-gray-400 text-sm font-sans">© 2024 GetMazza. All rights reserved.</p>
//               <div className="sm:flex sm:space-x-6 space-x-4 items-center mt-4 md:mt-0">
//                 <p className="text-gray-400 text-center font-wellston sm:mb-0 mb-3">Download The App</p>
//                 <div className="flex sm:space-x-5 space-x-20">
//                   <button className='flex items-center text-gray-400 border-2 border-auburn rounded-md p-2'>
//                     <img src={GooglePlayImg} alt="Google Play Store" className='w-4 h-4'/><span className='font-bold text-xs ml-2'>Playstore</span>
//                   </button>
//                   <button className='flex items-center text-gray-400 border-2 border-auburn rounded-md p-2'>
//                     <img src={AppStoreImg} alt="App Store" className='w-4 h-4'/><span className='font-bold text-xs sm:ml-2'>App Store</span>
//                   </button>
//                 </div>
                  
//               </div>
//             </div>
//           </div>
//         </div>
      
//     </footer>
//   );
// };

// export default Footer;

import { Link } from 'react-router-dom';
import AppStoreImg from "../../assets/images/apple-removebg-preview.png";
import GooglePlayImg from "../../assets/images/playstore-removebg-preview.png";
import GetMazzaLogo from "../../assets/images/GetMazza logo2.png"
import { FaEnvelope, FaInstagram, FaFacebook } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="pt-16 pb-8" style={{ background: 'linear-gradient(9deg,rgba(3, 3, 3, 1) 55%, rgba(165, 42, 49, 1) 100%)'}}>
      <div className="mx-auto px-4 sm:px-6 lg:pl-12 lg:pr-20 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Column 1 - Logo and Social */}
          <div className="space-y-6">
            <Link to="/">
              <img src={GetMazzaLogo} className="w-44" alt="GetMazza Logo" />
            </Link>
            
            <p className="text-gray-400 font-wellston md:max-w-[260px]">
              Premium online ticketing and event curation platform for luxury experiences.
            </p>
            
            <div className="flex gap-4 pt-8">
              <Link to="" className='text-gray-400 text-xl hover:text-bronze transition-colors duration-200'>
                <FaEnvelope />
              </Link>
              <Link to="" className='text-gray-400 text-xl hover:text-bronze transition-colors duration-200'>
                <FaX />
              </Link>
              <Link to="" className='text-gray-400 text-xl hover:text-bronze transition-colors duration-200'>
                <FaFacebook />
              </Link>
              <Link to="" className='text-gray-400 text-xl hover:text-bronze transition-colors duration-200'>
                <FaInstagram />
              </Link>
            </div>
          </div>

          {/* Column 2 & 3 - Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h4 className="text-lg font-display text-white mb-4">Quick Links</h4>
              <ul className="space-y-3 font-sans">
                <li><Link to="/our-story" className="text-gray-400 hover:text-bronze transition-colors duration-200">Our Story</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-bronze transition-colors duration-200">Services</Link></li>
                <li><Link to="/social-club" className="text-gray-400 hover:text-bronze transition-colors duration-200">Social Club</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-display text-white mb-4">Legal</h4>
              <ul className="space-y-3 font-sans">
                <li><Link to="/terms" className="text-gray-400 hover:text-bronze transition-colors duration-200">Contact Us</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-bronze transition-colors duration-200">FAQs</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-bronze transition-colors duration-200">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-bronze transition-colors duration-200">Privacy Policy</Link></li>
                <li><Link to="/refund" className="text-gray-400 hover:text-bronze transition-colors duration-200">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Column 4 - Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-display text-white">Newsletter</h4>
            <p className="text-gray-400 font-sans">Join our community for exclusive updates</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-black/30 text-white px-4 py-3 rounded-l-md border border-gray-800 outline-none flex-1 font-sans text-sm"
              />
              <button className="bg-bronze px-4 py-3 rounded-r-md font-sans hover:bg-auburn transition-colors duration-200 text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm font-sans order-2 md:order-1">
              © 2024 GetMazza. All rights reserved.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 order-1 md:order-2 w-full md:w-auto">
              <p className="text-gray-400 font-wellston">Download The App</p>
              <div className="flex gap-4">
                <button className='flex items-center text-gray-400 border border-auburn rounded-md px-3 py-2 hover:bg-auburn/10 transition-colors duration-200'>
                  <img src={GooglePlayImg} alt="Google Play Store" className='w-4 h-4'/>
                  <span className='font-bold text-xs ml-2'>Playstore</span>
                </button>
                <button className='flex items-center text-gray-400 border border-auburn rounded-md px-3 py-2 hover:bg-auburn/10 transition-colors duration-200'>
                  <img src={AppStoreImg} alt="App Store" className='w-4 h-4'/>
                  <span className='font-bold text-xs ml-2'>App Store</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;