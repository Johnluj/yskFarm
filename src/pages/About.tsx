import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Award, CheckCircle2, History } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { TIMELINE, STATS } from '../constants';

export const About: React.FC = () => {
  return (
    <PageWrapper>
      {/* Hero Header */}
      <section className="relative pt-40 pb-24 bg-primary-950 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
           <img src="/src/assets/images/poultry_management_1779029687347.png" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-3xl"
          >
            <span className="text-accent-500 font-bold tracking-widest text-sm uppercase mb-4 block">Our Legacy & Future</span>
            <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-white mb-8 leading-tight">
              A Vision for Sustainable <span className="text-accent-400">Poultry Excellence</span>
            </h1>
            <p className="text-xl text-primary-200 font-light leading-relaxed">
              From our humble beginnings at Akobo to becoming a trusted name in commercial poultry supply across Ibadan, our journey is defined by quality, hygiene, and unwavering commitment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story & Founder */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-accent-600 font-bold tracking-widest text-sm uppercase mb-4 block">The Founder's Story</h2>
              <h3 className="text-4xl font-display font-bold text-primary-950 mb-8">Pioneered by Passion, Led by "Mr Sam"</h3>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  YSK Poultry Farm was born out of a desire to provide Ibadan and its environs with poultry products that meet international standards of hygiene and quality. Our founder, <span className="text-primary-800 font-bold">Mr Sam</span>, envisioned a farm where biosecurity and bird health come first.
                </p>
                <p>
                  Starting in 2023 at Road 5, Lamona, Oluhunda Akobo, the farm was built on the pillars of professional management and commercial scalability. "Healthy birds for healthy people" isn't just a slogan for us—it's the core of our daily operations.
                </p>
                <p>
                  Today, YSK Poultry Farm stands as a testament to what's possible when modern agricultural techniques are applied with a local heart.
                </p>
              </div>
              <div className="mt-10 p-8 glass-card bg-primary-50/50 border-primary-100 italic font-medium text-primary-800">
                "Our goal isn't just to sell chicken; it's to provide peace of mind to every chef, caterer, and household that uses our products." — Mr Sam
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl relative z-10">
                <img 
                  src="/src/assets/images/poultry_management_1779029687347.png" 
                  alt="Founder or Farmer working" 
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-full h-full border-4 border-accent-500 rounded-3xl -z-10 opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div 
               whileHover={{ y: -10 }}
               className="bg-white p-12 rounded-3xl shadow-xl border border-primary-100"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-8">
                <Target className="w-8 h-8 text-primary-700" />
              </div>
              <h3 className="text-3xl font-display font-bold text-primary-950 mb-6">Our Mission</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To provide healthy and quality poultry products through hygienic farming practices, professional management, and reliable commercial supply. We aim to fuel the food industry with excellence.
              </p>
            </motion.div>
            
            <motion.div 
               whileHover={{ y: -10 }}
               className="bg-white p-12 rounded-3xl shadow-xl border border-primary-100"
            >
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mb-8">
                <Eye className="w-8 h-8 text-accent-700" />
              </div>
              <h3 className="text-3xl font-display font-bold text-primary-950 mb-6">Our Vision</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To become one of the most trusted poultry production and supply farms in Nigeria, recognized for our commitment to health standards and commercial reliability.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-primary-950">Our Progress Journey</h2>
            <p className="text-gray-600 mt-4 text-lg">Milestones that define our commitment to growth.</p>
          </div>
          
          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary-100 hidden lg:block -translate-x-1/2" />
            
            <div className="space-y-16">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`flex flex-col lg:flex-row items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className={`lg:w-1/2 ${i % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16'}`}>
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow relative">
                      <span className="text-accent-600 font-display font-black text-4xl opacity-20 absolute top-4 right-4">{item.year}</span>
                      <h4 className="text-2xl font-display font-bold text-primary-900 mb-2">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Dot */}
                  <div className="w-12 h-12 bg-primary-700 rounded-full border-4 border-white shadow-lg z-10 flex items-center justify-center my-6 lg:my-0">
                    <History className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="lg:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Farm Overview Section */}
      <section className="py-24 bg-primary-950 text-white relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/3">
              <h2 className="text-accent-500 font-bold tracking-widest text-sm uppercase mb-4 block">Our Infrastructure</h2>
              <h3 className="text-4xl font-display font-bold mb-8">Modern Facility Overview</h3>
              <p className="text-primary-200 text-lg mb-8 leading-relaxed">
                Located on 10 acres of prime land in Akobo, our farm houses multiple automated structures designed for optimal bird comfort and biosecurity.
              </p>
              <div className="space-y-4">
                {[
                  'Advanced Ventilation Systems',
                  'Clean Water Filtration',
                  'Waste Management Systems',
                  'Cold Storage Processing'
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 text-primary-100">
                    <CheckCircle2 className="w-5 h-5 text-accent-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-2/3 grid grid-cols-2 gap-6">
              <div className="rounded-2xl overflow-hidden h-80 shadow-2xl mt-8">
                 <img src="/src/assets/images/poultry_farm_facility_1779029672411.png" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="rounded-2xl overflow-hidden h-80 shadow-2xl">
                 <img src="/src/assets/images/poultry_farm_hero_1779029633495.png" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};
