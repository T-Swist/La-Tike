import { motion } from 'framer-motion';

const episodes = [
  {
    id: 1,
    title: 'The Future of Events',
    description: 'Exploring how technology is reshaping the event industry',
    duration: '45:30',
    date: 'Apr 10, 2024',
    image: 'https://source.unsplash.com/random/400x400?podcast'
  },
  {
    id: 2,
    title: 'Behind the Scenes',
    description: 'A look at what goes into creating unforgettable events',
    duration: '38:15',
    date: 'Apr 3, 2024',
    image: 'https://source.unsplash.com/random/400x400?microphone'
  },
  {
    id: 3,
    title: 'Event Planning 101',
    description: 'Essential tips for planning your next big event',
    duration: '42:00',
    date: 'Mar 27, 2024',
    image: 'https://source.unsplash.com/random/400x400?planning'
  }
];

const Podcast = () => {
  return (
    <div className="min-h-screen bg-gradient-ash pt-24">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-display text-bronze mb-4">GetMazza Podcast</h1>
          <p className="text-white/80 font-sans max-w-2xl mx-auto">
            Join us as we explore the world of events, entertainment, and culture
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {episodes.map((episode, index) => (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-ash/50 backdrop-blur-md rounded-lg p-6 mb-8 hover:bg-ash-light transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden">
                  <img
                    src={episode.image}
                    alt={episode.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-display text-bronze-light">{episode.title}</h3>
                    <span className="text-white/60 font-sans text-sm">{episode.date}</span>
                  </div>
                  <p className="text-white/80 font-sans mb-6">{episode.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 font-sans">{episode.duration}</span>
                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-auburn text-white rounded-full font-sans hover:bg-bronze transition-colors"
                      >
                        Listen Now
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 border border-bronze text-bronze rounded-full font-sans hover:bg-bronze hover:text-white transition-all"
                      >
                        Download
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <h2 className="text-2xl font-display text-bronze-light mb-4">Subscribe to Our Podcast</h2>
          <div className="flex justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-ash-light text-white rounded-full font-sans hover:bg-ash transition-colors flex items-center gap-2"
            >
              <span>Spotify</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-ash-light text-white rounded-full font-sans hover:bg-ash transition-colors flex items-center gap-2"
            >
              <span>Apple Podcasts</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Podcast;
