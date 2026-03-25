import { motion } from 'framer-motion';

const services = [
  {
    title: 'Event Planning',
    description: 'Comprehensive event planning services tailored to your vision',
    icon: '🎯'
  },
  {
    title: 'Venue Selection',
    description: 'Access to exclusive venues that match your event needs',
    icon: '🏛️'
  },
  {
    title: 'Entertainment',
    description: 'Premium entertainment options for any occasion',
    icon: '🎭'
  },
  {
    title: 'Catering',
    description: 'Curated dining experiences from top-tier providers',
    icon: '🍽️'
  }
];

const Services = () => {
  return (
    <div className="min-h-screen bg-gradient-ash pt-24">
      <div className="container mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-display text-bronze mb-12 text-center"
        >
          Our Services
        </motion.h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-ash/50 backdrop-blur-md rounded-lg p-8 hover:bg-ash-light transition-all duration-300"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-display text-bronze-light mb-4">{service.title}</h3>
              <p className="text-white/80 font-sans">{service.description}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-6 py-2 bg-auburn text-white rounded-full font-sans hover:bg-bronze transition-colors"
              >
                Learn More
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-display text-bronze-light mb-6">Ready to Create Something Special?</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-auburn text-white rounded-full font-sans text-lg hover:bg-bronze transition-colors"
          >
            Contact Us
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
