import { useState } from "react";
import { Link } from 'react-router-dom';
import { GoArrowRight, GoArrowUpRight } from 'react-icons/go';
import profileImg from '../../assets/images/ourteam/Profile 1.jpg';
import userImg from '../../assets/images/ourteam/Profile 2.jpg'; // Add a user profile image

const WhatsAppSupport = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Updated messages with alternating senders
  const chatMessages = [
    {
      id: 1,
      sender: 'admin',
      name: 'GetMazza Support',
      message: 'Hello! Need help planning your event?',
      time: '10:45 AM',
      profile: profileImg
    },
    {
      id: 2,
      sender: 'user',
      name: 'You',
      message: 'Yes, I need help with venue selection',
      time: '10:46 AM',
      profile: userImg
    },
    {
      id: 3,
      sender: 'admin',
      name: 'GetMazza Support',
      message: 'We can help with that! What type of event are you planning?',
      time: '10:47 AM',
      profile: profileImg
    },
    {
      id: 4,
      sender: 'user',
      name: 'You',
      message: 'A corporate gala for about 200 people',
      time: '10:48 AM',
      profile: userImg
    }
  ];

  return (
    <section className="w-full py-16" style={{
      background: 'linear-gradient(155deg,rgba(150, 96, 45, 0.79) 0%, rgba(0, 0, 0, 1) 37%, rgba(0, 0, 0, 1) 67%)'
    }}>
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Left content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-white font-glass text-2xl md:text-3xl lg:text-4xl mb-4">
              Chat Assistance at Your <br /> Fingertips
            </h2>
            <p className="text-gray-400 mb-6">
              Just like messaging a friend, ask anything and arrange details through chat effortlessly.
            </p>
            <Link
              to="https://wa.me/+23775536673"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setIsHovered(true)} 
              onMouseLeave={() => setIsHovered(false)}
              className="px-4 py-2 w-fit h-fit flex items-center justify-center text-white font-sans text-sm md:text-base rounded-full hover:bg-bronze/20 transition-all duration-300"
              style={{
                background: 'linear-gradient(232deg, rgba(184, 115, 51, 1) 17%, rgba(165, 42, 42, 1) 71%)'
              }}>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
              {isHovered ? (
                <GoArrowRight className="ml-2 text-sm md:text-base"/>
              ) : (
                <GoArrowUpRight className="ml-2 text-sm md:text-base"/>
              )}
            </Link>
          </div>

          {/* WhatsApp chat simulation */}
          <div className="w-full md:w-1/2  rounded-xl overflow-hidden ">
            {/* Chat header */}
            <div className="p-3 flex items-center ">
              <img src={profileImg} alt="Support" className="w-8 h-8 rounded-full mr-3"/>
              <div>
                <p className="text-white font-medium">GetMazza Support</p>
                <p className="text-xs text-gray-400">Online</p>
              </div>
            </div>
            
            {/* Chat messages */}
            <div className="p-4 space-y-3 h-[300px] overflow-y-auto">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'admin' ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg relative transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                      msg.sender === 'admin' 
                        ? 'bg-black/15 text-white' 
                        : 'bg-bronze text-white'
                    }`}
                  >
                    {msg.sender === 'admin' && (
                      <div className="flex items-center mb-1">
                        <img src={msg.profile} alt={msg.name} className="w-4 h-4 rounded-full mr-1"/>
                        <span className="text-xs font-medium text-[#a3b5b8]">{msg.name}</span>
                      </div>
                    )}
                    <p className="text-sm">{msg.message}</p>
                    <div className={`text-xs mt-1 text-right ${
                      msg.sender === 'admin' ? 'text-[#a3b5b8]' : 'text-[#84b4b8]'
                    }`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppSupport;