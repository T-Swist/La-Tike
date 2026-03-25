import { motion } from 'framer-motion';

const membershipTiers = [
  {
    name: 'Silver',
    price: 29.99,
    period: 'month',
    features: [
      'Early access to event tickets',
      'Member-only events',
      'Exclusive content',
      'Newsletter subscription'
    ],
    color: 'text-white',
    bgColor: 'bg-ash-light'
  },
  {
    name: 'Gold',
    price: 49.99,
    period: 'month',
    features: [
      'All Silver benefits',
      'Priority seating',
      'Meet & greet opportunities',
      'Merchandise discounts',
      'VIP lounge access'
    ],
    color: 'text-bronze',
    bgColor: 'bg-ash'
  },
  {
    name: 'Platinum',
    price: 99.99,
    period: 'month',
    features: [
      'All Gold benefits',
      'Personal event concierge',
      'Complimentary valet parking',
      'Exclusive backstage access',
      'Private event hosting options',
      'Custom event planning services'
    ],
    color: 'text-bronze-light',
    bgColor: 'bg-ash-dark'
  }
];

const Membership = () => {
  return (
    <div className="min-h-screen bg-gradient-ash pt-24">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-display text-bronze mb-4">Become a Member</h1>
          <p className="text-white/80 font-sans max-w-2xl mx-auto">
            Join our exclusive community and unlock premium benefits
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {membershipTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`${tier.bgColor} backdrop-blur-md rounded-lg p-8 border border-bronze/20`}
            >
              <h3 className={`text-3xl font-display ${tier.color} mb-4`}>{tier.name}</h3>
              <div className="flex items-baseline mb-6">
                <span className={`text-4xl font-display ${tier.color}`}>${tier.price}</span>
                <span className="text-white/60 ml-2">/{tier.period}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <motion.li
                    key={featureIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 + featureIndex * 0.1 }}
                    className="flex items-center text-white/80"
                  >
                    <svg
                      className="w-5 h-5 text-bronze mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </motion.li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 bg-auburn text-white rounded-full font-sans hover:bg-bronze transition-colors"
              >
                Select {tier.name}
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
          <h2 className="text-2xl font-display text-bronze-light mb-4">Have Questions?</h2>
          <p className="text-white/60 font-sans mb-6">
            Our membership team is here to help you choose the perfect tier
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 border border-bronze text-bronze rounded-full font-sans hover:bg-bronze hover:text-white transition-all"
          >
            Contact Us
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Membership;
