import { motion } from 'framer-motion';
import { useState } from 'react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    { url: 'https://source.unsplash.com/random/800x600?event', title: 'Summer Festival 2024' },
    { url: 'https://source.unsplash.com/random/800x600?concert', title: 'Live Music Night' },
    { url: 'https://source.unsplash.com/random/800x600?party', title: 'VIP Launch Party' },
    { url: 'https://source.unsplash.com/random/800x600?celebration', title: 'New Year Gala' },
    { url: 'https://source.unsplash.com/random/800x600?wedding', title: 'Wedding Showcase' },
    { url: 'https://source.unsplash.com/random/800x600?corporate', title: 'Corporate Summit' },
  ];

  return (
    <div className="min-h-screen bg-gradient-ash pt-24">
      <div className="container mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-display text-bronze mb-12 text-center"
        >
          Event Gallery
        </motion.h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
              onClick={() => setSelectedImage(image.url)}
            >
              <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-dark opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-2xl font-display text-bronze text-center px-4">{image.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={selectedImage}
              alt="Selected event"
              className="max-w-full max-h-[90vh] rounded-lg"
            />
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
