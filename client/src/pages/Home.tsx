import { motion } from 'framer-motion';
import GetYourTicket from '../components/HomePage/GetYourTicket';
// import ExploreCategory from '../components/HomePage/ExploreCategory';
// import VideoSlider from '../components/HomePage/VideoSlider';
import CreatingMoment from '../components/HomePage/CreatingMoment';
import EventsCurated from '../components/HomePage/EventsCurated';
import OurServices from '../components/HomePage/OurServices';
import TrendingEvents from '../components/HomePage/TrendingEvents';
import WhatsAppSupport from '../components/HomePage/WhatsAppSupport';
import JoinCommunity from '../components/HomePage/JoinCommunity';
import ImageSlider from '../components/HomePage/ImageSlider';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-hidden"
    >
      {/* Hero Section */}
      <section className="relative h-screen overflow-y-hidden">
        <ImageSlider />
      </section>
      {/* Get Your Ticket */}
      <GetYourTicket />
      {/* Explore Category */}
      {/* <ExploreCategory /> */}
      {/* Creating Moment */}
      <CreatingMoment />
      {/* Events Curated */}
      <EventsCurated />
      {/* Our Services */}
      <OurServices />
      {/* Trending Events */}
      <TrendingEvents />
      {/* WhatsApp Support */}
      <WhatsAppSupport />
      {/* Join Community */}
      <JoinCommunity />
    </motion.div>
  );
};

export default Home;