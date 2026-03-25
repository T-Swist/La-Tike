import { motion } from 'framer-motion';
import { useState } from 'react';

const products = [
  {
    id: 1,
    name: 'GetMazza Classic Tee',
    price: 29.99,
    image: 'https://source.unsplash.com/random/400x500?tshirt',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Bronze']
  },
  {
    id: 2,
    name: 'Event Hoodie',
    price: 59.99,
    image: 'https://source.unsplash.com/random/400x500?hoodie',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray', 'Auburn']
  },
  {
    id: 3,
    name: 'Premium Cap',
    price: 24.99,
    image: 'https://source.unsplash.com/random/400x500?cap',
    sizes: ['One Size'],
    colors: ['Black', 'White', 'Bronze']
  },
  {
    id: 4,
    name: 'Limited Edition Jacket',
    price: 129.99,
    image: 'https://source.unsplash.com/random/400x500?jacket',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Auburn']
  }
];

const Merch = () => {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-ash pt-24">
      <div className="container mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-display text-bronze mb-12 text-center"
        >
          GetMazza Merchandise
        </motion.h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-ash/50 backdrop-blur-md rounded-lg overflow-hidden group"
            >
              <div className="relative aspect-w-3 aspect-h-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-dark opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-display text-bronze-light mb-2">{product.name}</h3>
                <p className="text-white/90 font-display mb-4">${product.price}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="px-3 py-1 text-sm text-white/80 bg-ash-dark rounded-full"
                    >
                      {size}
                    </span>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedProduct(product.id)}
                  className="w-full px-6 py-2 bg-auburn text-white rounded-full font-sans hover:bg-bronze transition-colors"
                >
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="bg-ash rounded-lg p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-display text-bronze mb-4">
                {products.find(p => p.id === selectedProduct)?.name}
              </h2>
              <p className="text-white/80 mb-4">Select your preferences to continue</p>
              {/* Add size and color selection here */}
              <div className="flex justify-end mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-auburn text-white rounded-full font-sans hover:bg-bronze transition-colors"
                >
                  Add to Cart
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Merch;
