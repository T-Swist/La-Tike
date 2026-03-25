import image1 from "../../assets/images/Social club.jpg";
import image2 from "../../assets/images/Plane.jpg";
import image3 from "../../assets/images/Dinning.jpg";
import { Link } from "react-router-dom";
import { GoArrowRight, GoArrowUpRight } from 'react-icons/go';
import { IoTicket } from "react-icons/io5";
import { FaStar, FaRegStar } from "react-icons/fa6";
import { useState } from "react";

const TrendingEvents = () => {
  const eventCategories = ['All', 'Today', 'Tomorrow', 'This Weekend', 'Free'];
  const [activeCategory, setActiveCategory] = useState('All');
  const [isHovered, setIsHovered] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      month: 'July',
      day: '25',
      title: 'Winter Wonderland',
      location: 'San Francisco, CA',
      time: '7PM - 11PM',
      image: image2,
      price: '$15 - $50',
      interested: 89,
      brief: 'Event brief',
      isInterested: false
    },
    {
      id: 2,
      month: 'Dec',
      day: '25',
      title: 'Hour of Celebration',
      location: 'Los Angeles, CA',
      time: '6PM - 10PM',
      image: image1,
      price: '$20 - $75',
      interested: 65,
      brief: 'Event brief',
      isInterested: false
    },
    {
      id: 3,
      month: 'June',
      day: '25',
      title: 'Dinner Special',
      location: 'New York City, NY',
      time: '8PM - 11PM',
      image: image3,
      price: '$30 - $100',
      interested: 42,
      brief: 'Event brief',
      isInterested: false
    },
    {
      id: 4,
      month: 'Jan',
      day: '25',
      title: 'Education and Business',
      location: 'Chicago, IL',
      time: '9AM - 5PM',
      image: image1,
      price: '$25 - $80',
      interested: 73,
      brief: 'Event brief',
      isInterested: false
    }
  ]);

  const handleInterestClick = (eventId: number) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        const wasInterested = event.isInterested;
        return {
          ...event,
          isInterested: !wasInterested,
          interested: wasInterested ? event.interested - 1 : event.interested + 1
        };
      }
      return event;
    }));
  };

  return (
    <section className="bg-black w-full py-8 md:py-12 lg:py-16">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-white font-glass text-2xl md:text-3xl lg:text-4xl mb-6 md:mb-8">
          GetMazza Pulse
        </h2>
        <abbr title="Become a Member" style={{ textDecoration: 'none' }}>
          <Link to="/become-a-member" className="text-white font-wellston text-sm md:text-base lg:text-lg">
            Get exclusive access and unbeatable deals on the hottest events across Europe - <span className="text-bronze">for members only.</span>
          </Link>
        </abbr>    
        {/* Event Categories */}
        <div className="flex flex-wrap gap-2 md:gap-4 my-6 md:my-8">
          {eventCategories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm ${
                activeCategory === category
                  ? 'bg-bronze/20 text-white'
                  : 'border border-gray-600 text-gray-400 hover:border-bronze hover:text-bronze'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gradient-to-br from-[#1a1a1a] to-black rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-40 sm:h-48 md:h-52">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/80 px-2 py-1 rounded text-xs md:text-sm">
                  <span className="text-white">{event.location}</span>
                </div>
                <button 
                  onClick={() => handleInterestClick(event.id)}
                  className="absolute top-3 right-3 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-bronze to-auburn"
                >
                  {event.isInterested ? (
                    <FaStar className="text-white text-sm md:text-base"/>
                  ) : (
                    <FaRegStar className="text-white text-sm md:text-base"/>
                  )}
                </button>
                <div className="absolute bottom-0 left-0 bg-bronze px-2 py-1 rounded-tr-md text-xs md:text-sm">
                  <span className="text-black">Entertainment</span>
                </div>
              </div>
              <div className="p-4 md:p-5 flex">
                <div className="flex flex-col items-center text-gray-400 mr-3 text-xs md:text-sm">
                  <span className="text-bronze font-bold font-glass">{event.month}</span>
                  <span className="text-gray-400 font-wellston">{event.day}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold font-glass text-sm md:text-base lg:text-lg mb-1 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 font-wellston text-xs md:text-sm mb-2 line-clamp-2">
                    {event.brief}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
                    <span className="text-gray-400 font-wellston flex items-center gap-1">
                      <IoTicket className="text-bronze"/>
                      {event.price}
                    </span>
                    <span className="text-gray-400 font-wellston flex items-center gap-1">
                      <FaStar className="text-bronze"/>
                      {event.interested} interested
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end mt-6 md:mt-8">
          <Link 
            to="/events" 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
            className="px-4 py-2 w-fit flex items-center justify-center text-white font-sans text-sm md:text-base rounded-full hover:bg-bronze/20 transition-all duration-300"
            style={{
              background: 'linear-gradient(232deg, rgba(184, 115, 51, 1) 17%, rgba(165, 42, 42, 1) 71%)'
            }}
          >
            See More
            {isHovered ? (
              <GoArrowRight className="ml-2 text-sm md:text-base"/>
            ) : (
              <GoArrowUpRight className="ml-2 text-sm md:text-base"/>
            )}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingEvents;