import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const Preloader: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-[100] bg-white flex items-center justify-center font-sans"
        >
          <div className="flex flex-col items-center">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 bg-primary-700 rounded-2xl flex items-center justify-center shadow-xl"
            >
              <span className="text-white font-display font-bold text-3xl">Y</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 font-display font-bold text-primary-900 tracking-widest text-sm"
            >
              YSK POULTRY FARM
            </motion.p>
            <div className="mt-4 w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-full h-full bg-primary-600"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

