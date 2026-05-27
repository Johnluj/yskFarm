import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ChevronRight, Phone, MessageCircle } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { SERVICES, CONTACT_INFO } from '../constants';

export const Services: React.FC = () => {
  return (
    <PageWrapper>
      {/* Hero Header */}
      <section className="relative pt-40 pb-24 bg-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-5">
           <div className="grid grid-cols-6 grid-rows-6 h-full w-full">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border border-primary-900" />
              ))}
           </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="text-accent-600 font-bold tracking-widest text-sm uppercase mb-4 block">What We Offer</span>
            <h1 className="text-5xl lg:text-7xl font-display font-black text-primary-950 mb-8 tracking-tight">
              Commercial <span className="text-primary-700">Poultry Solutions</span>
            </h1>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              We provide professional-grade poultry products and services tailored for the Nigerian commercial food market.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Detailed List */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="space-y-32">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${i % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-24`}
              >
                {/* Image Side */}
                <div className="lg:w-1/2 relative group">
                  <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                    <img 
                      src={service.imageUrl} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Decorative Elements */}
                  <div className={`absolute -top-6 -left-6 w-32 h-32 bg-primary-100 rounded-3xl -z-10 ${i % 2 !== 0 ? 'lg:left-auto lg:-right-6' : ''}`} />
                  <div className={`absolute -bottom-6 -right-6 w-48 h-48 bg-accent-100 rounded-3xl -z-10 ${i % 2 !== 0 ? 'lg:right-auto lg:-left-6' : ''}`} />
                  
                  {/* Floating Badge */}
                  <div className={`absolute bottom-8 right-8 z-20 glass-card bg-primary-800/90 text-white p-6 ${i % 2 !== 0 ? 'lg:right-auto lg:left-8' : ''}`}>
                    <p className="font-display font-bold text-lg mb-1">Standardized</p>
                    <p className="text-primary-100 text-xs">Quality Guaranteed</p>
                  </div>
                </div>

                {/* Content Side */}
                <div className="lg:w-1/2">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-primary-700 font-display font-black text-6xl opacity-10">0{i + 1}</span>
                    <div className="h-px w-12 bg-primary-200" />
                  </div>
                  <h2 className="text-4xl font-display font-bold text-primary-950 mb-6 leading-tight group-hover:text-primary-700 transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-10 leading-relaxed font-light">
                    {service.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-12">
                    {service.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center space-x-3 group/item">
                        <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center group-hover/item:bg-primary-700 transition-colors">
                          <CheckCircle2 className="w-4 h-4 text-primary-700 group-hover/item:text-white transition-colors" />
                        </div>
                        <span className="text-gray-700 font-medium group-hover/item:text-primary-900 transition-colors">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href={`tel:${CONTACT_INFO.phone}`} className="btn-primary">
                      Inquire Monthly Supply
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Process Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl font-display font-bold text-primary-950"
            >
              Our Operational Process
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 mt-4 max-w-2xl mx-auto"
            >
              How we ensure quality remains consistent from farm to delivery.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Health Screening', desc: 'Every bird undergoes rigorous health checks at day one.' },
              { step: '02', title: 'Managed Growth', desc: 'Professional feeding and biosecurity during the growth cycle.' },
              { step: '03', title: 'Clean processing', desc: 'Hygienic slaughtering and processing in our facility.' },
              { step: '04', title: 'Supply & Logistics', desc: 'Timely delivery in our specialized supply network.' },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <span className="text-8xl font-black text-primary-900/5 absolute -top-4 -right-4">{p.step}</span>
                <h4 className="text-xl font-display font-bold text-primary-900 mb-4">{p.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-primary-900 p-12 lg:p-20 relative overflow-hidden"
          >
             <div className="absolute inset-0 opacity-10">
                <img src="/src/assets/images/poultry_pens_night_1779879694966.png" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             </div>
             <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="max-w-2xl">
                  <h2 className="text-4xl font-display font-bold text-white mb-6">Need Large Scale Poultry Supply?</h2>
                  <p className="text-primary-100 text-lg font-light leading-relaxed">
                    We specialize in high-volume, consistent supply for industrial clients, large caterers, and chain restaurants. Contact us for wholesale pricing.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-6">
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={`https://wa.me/${CONTACT_INFO.whatsapp}`} 
                    className="btn-accent px-10 py-5"
                  >
                    <MessageCircle className="mr-2 w-5 h-5" />
                    Discuss Wholesale
                  </motion.a>
                </div>
             </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
};
