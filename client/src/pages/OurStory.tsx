import { motion, AnimatePresence } from 'framer-motion';
import Team1Img from "../assets/images/ourteam/Profile 1.jpg";
import Team2Img from "../assets/images/ourteam/Profile 2.jpg";
import Team3Img from "../assets/images/ourteam/User.jpg";
import Team4Img from "../assets/images/ourteam/Profile 4.jpg";
import Team5Img from "../assets/images/ourteam/Profile 5.jpg";
import Team6Img from "../assets/images/ourteam/Prodile 5.jpg";
import Team7Img from "../assets/images/ourteam/Team6.jpg"
import { FaFacebook, FaLinkedinIn, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Ticket from '../assets/images/Ticket_Style-removebg-preview.png'
import { useState } from 'react';

interface Specialist {
  name: string;
  role: string;
  description: string;
  image: string;
  email: string;
  socials: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

const specialists: Specialist[] = [
  {
    name: 'Judy Doe',
    role: 'Virtual Event Moderator',
    description: 'Ensures smooth flow of online events by managing speakers, engaging the audience.',
    image: Team1Img,
    email: 'virtualmoderator@gmail.com',
    socials: {
      facebook: '#',
      linkedin: '#',
      twitter: '#',
      instagram: '#'
    }
  },
  {
    name: 'Abraham Moses',
    role: 'Virtual Event Moderator',
    description: 'Ensures smooth flow of online events by managing speakers, engaging the audience.',
    image: Team2Img,
    email: 'virtualmoderator@gmail.com',
    socials: {
      facebook: '#',
      linkedin: '#',
      twitter: '#',
      instagram: '#'
    }
  },
  {
    name: 'Abraham Moses',
    role: 'Virtual Event Moderator',
    description: 'Ensures smooth flow of online events by managing speakers, engaging the audience.',
    image: Team3Img,
    email: 'virtualmoderator@gmail.com',
    socials: {
      facebook: '#',
      linkedin: '#',
      twitter: '#',
      instagram: '#'
    }
  },
  {
    name: 'Abraham Moses',
    role: 'Virtual Event Moderator',
    description: 'Ensures smooth flow of online events by managing speakers, engaging the audience.',
    image: Team4Img,
    email: 'virtualmoderator@gmail.com',
    socials: {
      facebook: '#',
      linkedin: '#',
      twitter: '#',
      instagram: '#'
    }
  },
  {
    name: 'Abraham Moses',
    role: 'Virtual Event Moderator',
    description: 'Ensures smooth flow of online events by managing speakers, engaging the audience.',
    image: Team5Img,
    email: 'virtualmoderator@gmail.com',
    socials: {
      facebook: '#',
      linkedin: '#',
      twitter: '#',
      instagram: '#'
    }
  },
  {
    name: 'Abraham Moses',
    role: 'Virtual Event Moderator',
    description: 'Ensures smooth flow of online events by managing speakers, engaging the audience.',
    image: Team6Img,
    email: 'virtualmoderator@gmail.com',
    socials: {
      facebook: '#',
      linkedin: '#',
      twitter: '#',
      instagram: '#'
    }
  }
];

const OurStory = () => {
  // Remove the single isHover state and manage hover per card
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative text-white h-96">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(14, 14, 15, 0.6), rgba(14, 14, 15, 0.5)), url(${Team7Img})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:4px_4px]"></div>
        </div>
        <div className="flex items-center justify-center z-10 px-4 h-full">
        <div className="w-full max-w-xl mx-auto lg:mt-16 md:mt-12 sm:mt-8 mt-12"> {/* Reduced max-width */}
          <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center"
              >
                {/* Smaller overlay with lighter opacity */}
            <div className="bg-black/15 backdrop-blur-sm rounded-2xl p-6 md:p-8 lg:p-8"> {/* Reduced padding and opacity */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl md:text-3xl lg:text-4xl text-left font-display text-white mb-6 leading-tight"
                >
                  Our Inspiring Story <br />
                  over the Time
                </motion.h1>
                </div>
              </motion.div>
          </AnimatePresence>
        </div>
        </div>
      </div>

      {/* Story Section */}
      <section className='w-full' style={{ background: 'linear-gradient(348deg,rgba(150, 96, 45, 0.79) 0%, rgba(0, 0, 0, 1) 37%, rgba(0, 0, 0, 1) 67%)'}}>
         <div className="container mx-auto max-w-6xl px-4 py-12" >
            <div className='md:flex flex-col items-center justify-between gap-8 lg:gap-x-32 w-full'>
              <div className='w-full lg:w-1/2'>
                <h2 className="text-2xl font-bold text-bronze mb-8">Our Story</h2>
                <div className="text-white/90 max-w-3xl space-y-6">
                  <p className="font-wellston">
                    At GetMazza, we believe that events, virtual or hybrid should be more than just links and screens. They should be experiences. Born out of a passion for bringing people together in meaningful ways, we set out to build a platform that makes hosting and attending events seamless, engaging, and truly human.
                  </p>
                  <p className="font-wellston">
                    What started as a small idea during a time of disconnection quickly grew into a full-scale platform powered by curious minds and innovative technology. Through countless virtual conferences, intimate workshops and community hangouts, we've helped creators, teams, and brands craft events that leave lasting impressions.
                  </p>
                </div>
              </div>
              <div className='w-full lg:w-1/2 mt-8 md:mt-0'>
                <img src={Ticket} alt="" className='w-full lg:w-1/2' />
              </div>
            </div>
          </div>
      </section>
     

      {/* Platform Support Section */}
      <div className="container mx-auto max-w-6xl px-4 p-12 bg-black">
        <h2 className="text-2xl font-brent text-bronze mb-8">Meet Our Team</h2>
        <p className="text-white/90 mb-12 max-w-3xl font-wellston">
          At Getmazza, we believe that personalized service begins with a dedicated team. Each of our members brings unique expertise and a deep understanding of what it takes to deliver unparalleled experiences.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto gap-8">
          {specialists.map((specialist, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-black overflow-hidden group"
              style={{
                background: '',
                padding: '1px'
              }}
              transition={{ delay: 0.1 * index }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{ scale: 1.03 }}
            >
              {/* Social Icons - Only show for hovered card */}
              <div 
                className={`absolute top-0 right-0 z-30 flex justify-end items-center gap-2 p-2 bg-black transition-opacity duration-300 ${
                  hoveredCard === index ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ 
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 30% 100%)",
                  width: '140px'
                }}
              >
                {specialist.socials.facebook && (
                  <a href={specialist.socials.facebook} target="_blank" rel="noopener noreferrer">
                    <FaFacebook className="text-bronze hover:text-auburn transition-colors cursor-pointer" />
                  </a>
                )}
                {specialist.socials.linkedin && (
                  <a href={specialist.socials.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedinIn className="text-bronze hover:text-auburn transition-colors cursor-pointer" />
                  </a>
                )}
                {specialist.socials.twitter && (
                  <a href={specialist.socials.twitter} target="_blank" rel="noopener noreferrer">
                    <FaTwitter className="text-bronze hover:text-auburn transition-colors cursor-pointer" />
                  </a>
                )}
                {specialist.socials.instagram && (
                  <a href={specialist.socials.instagram} target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="text-bronze hover:text-auburn transition-colors cursor-pointer" />
                  </a>
                )}
              </div>

              {/* Content */}
              <div className="bg-black h-full">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={specialist.image}
                    alt={specialist.name}
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  <div className="absolute bottom-0 p-6 z-20 w-full text-left">
                    <h3 className="text-lg font-glass text-bronze mb-1">{specialist.name}</h3>
                    <p className="text-white/90 text-sm mb-2 font-wellston">{specialist.role}</p>
                    <Link to={`mailto:${specialist.email}`} className="cursor-pointer flex justify-start space-x-3 group-hover:text-auburn">
                      <FaEnvelope className="text-bronze hover:text-auburn transition-colors cursor-pointer" />
                      <p className="text-white/70 text-xs mb-2 hover:text-auburn transition-colors">{specialist.email}</p>
                    </Link>
                    <p className="text-white/90 text-sm font-wellston font-normal">{specialist.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 p-12 flex flex-col items-center justify-center bg-black">
        <h2 className="text-2xl font-brent text-white mb-8">Want to become a member?</h2>
        <p className="text-gray-400 mb-12 max-w-2xl text-center font-wellston">
        We are always on the lookout for passionate individuals and partners who share our dedication to exceptional service. If you are driven, detail-oriented, and thrive in a fast-paced environment, we would love to hear from you.
        </p>
        <a href="mailto:@mazzaindaloft.com" className="font-sans text-bronze hover:text-bronze-dark transition-colors">
          @mazzaindaloft
        </a>
      </div>
    </div>
  );
};

export default OurStory;