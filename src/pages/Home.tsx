import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { ChevronRight, ArrowRight, ShieldCheck, HeartPulse, Truck, Sprout, Star, Users, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { STATS, FEATURES, SERVICES, CONTACT_INFO } from '../constants';

const CountUp: React.FC<{ end: number; suffix?: string; label: string; showBorder?: boolean }> = ({ end, suffix = '', label, showBorder = true }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, end]);

  return (
    <div ref={ref} className={`text-center flex flex-col items-center ${showBorder ? 'border-r border-white/10' : ''}`}>
      <div className="text-3xl font-black text-accent-400">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-70">
        {label}
      </p>
    </div>
  );
};

const IconComponent: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  switch (name) {
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'HeartPulse': return <HeartPulse className={className} />;
    case 'Truck': return <Truck className={className} />;
    case 'Sprout': return <Sprout className={className} />;
    case 'Star': return <Star className={className} />;
    case 'Users': return <Users className={className} />;
    default: return null;
  }
};

export const Home: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/poultry_1.jpg"
            alt="Poultry Farm Hero"
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-900/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full border border-primary-100 mb-6">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Premium Quality Supply In Ibadan</span>
            </span>
            <h1 className="font-display font-black text-5xl lg:text-7xl text-white leading-tight mb-8">
              World-Class <span className="text-accent-400">Poultry</span> & Sustainable Agriculture
            </h1>
            <p className="text-lg lg:text-xl text-gray-200 mb-10 leading-relaxed font-light max-w-lg">
              Sustainably raised broilers under strict biosecurity alongside premium Maize and Cashew grain operations in Akobo, Ibadan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="px-8 py-4 bg-primary-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-800 shadow-xl transition-transform active:scale-95 text-sm uppercase tracking-wider">
                Contact Us Now
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/services" className="px-8 py-4 border-2 border-white/20 text-white rounded-xl font-bold hover:border-accent-400 hover:text-accent-400 transition-all flex items-center justify-center text-sm uppercase tracking-wider">
                View Services
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Bar Section (Updated to Sleek Interface style) */}
      <section className="h-40 md:h-32 bg-primary-900 grid grid-cols-2 md:grid-cols-4 items-center px-4 md:px-10 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none"><path d="M0 50 Q 25 10, 50 50 T 100 50" fill="none" stroke="white" strokeWidth="0.5"/></svg>
        </div>
        <CountUp end={20000} suffix="+" label="Birds Managed" />
        <CountUp end={10} suffix=" Acres" label="Farm Facility" />
        <CountUp end={2016} label="Established" />
        <CountUp end={100} suffix="%" label="Hygienic Control" showBorder={false} />
      </section>

      {/* About Preview Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/images/poultry_3.jpg"
                  alt="Farmer examining birds" 
                  className="w-full h-auto hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-accent-500 rounded-2xl -z-10 opacity-10" />
              <div className="absolute top-1/2 -left-12 -translate-y-1/2 p-6 glass-card border-primary-100 hidden sm:block">
                <p className="text-primary-800 font-bold text-lg mb-1">Commercial Scale</p>
                <p className="text-gray-500 text-xs">Ready for bulk supply demands</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <span className="text-accent-600 font-bold tracking-widest text-sm uppercase mb-4 block">About YSJ Farm Limited</span>
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-primary-900 mb-8 leading-tight">
                Setting New Standards in <span className="text-primary-600">Poultry Excellence</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Founded in 2016, YSJ Farm Limited has quickly grown into a leading name in Ibadan's agricultural sector. We combine agricultural expertise with modern scientific management to produce top-tier broilers and commercial crops like Maize and Cashew.
              </p>
              <ul className="space-y-4 mb-10">
                {['Direct farm-to-table supply', 'Fully automated processing line', 'Expert veterinary supervision'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700 font-medium">
                    <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                      <ChevronRight className="w-3 h-3 text-primary-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/about" className="btn-primary">
                Learn Our Story
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-primary-950 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">Why Industry Leaders Choose Us</h2>
            <p className="text-primary-200 text-lg">We don't just farm; we engineer quality into every stage of our production cycle to ensure your business gets only the best.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-primary-900/40 border border-white/5 hover:bg-white/[0.08] hover:border-accent-500/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent name={feature.icon} className="w-7 h-7 text-accent-400" />
                </div>
                <h3 className="text-xl font-display font-bold mb-4">{feature.title}</h3>
                <p className="text-primary-200/70 leading-relaxed font-light">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-accent-600 font-bold tracking-widest text-sm uppercase mb-4 block">Our Specialties</span>
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-primary-950 leading-tight">
                Comprehensive Poultry Solutions for Commercial Supply
              </h2>
            </div>
            <Link to="/services" className="text-primary-700 font-bold flex items-center hover:text-primary-900 group transition-colors lg:mb-4">
              Explore All Services
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {SERVICES.map((service, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-3xl h-[400px]"
              >
                <img 
                  src={service.imageUrl} 
                  alt={service.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-900/40 to-transparent" />
                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  <h3 className="text-2xl font-display font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-primary-100/90 mb-6 line-clamp-2 text-sm">{service.description}</p>
                  <Link 
                    to={`/services#${service.id}`}
                    className="inline-flex items-center text-accent-400 font-bold hover:text-white transition-colors"
                  >
                    Details
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section Preview */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-primary-950 mb-4">Our Farm Gallery</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Take a look inside our modern facility at Akobo, Ibadan.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-2 rounded-3xl overflow-hidden h-96 relative group border border-slate-100 shadow-md">
                <img src="/images/poultry_8.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="absolute bottom-6 left-6 text-white z-10 glass-card bg-primary-950/60 px-4 py-2 border-primary-800">
                  <p className="text-xs font-black uppercase tracking-widest text-accent-400">Exterior View</p>
                  <h3 className="text-sm font-bold">YSJ Farm Pens at Night</h3>
                </div>
             </div>
             <div className="rounded-3xl overflow-hidden h-96 relative group border border-slate-100 shadow-md">
                <img src="/images/poultry_2.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="absolute bottom-6 left-6 text-white z-10 glass-card bg-primary-950/60 px-4 py-2 border-primary-800">
                  <p className="text-xs font-black uppercase tracking-widest text-[#fbbf24]">Quality Breed</p>
                  <h3 className="text-sm font-bold">Healthy Broiler Chick</h3>
                </div>
             </div>
             <div className="rounded-3xl overflow-hidden h-96 relative group border border-slate-100 shadow-md">
                <img src="/images/maize_farm.webp" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="absolute bottom-6 left-6 text-white z-10 glass-card bg-primary-950/60 px-4 py-2 border-primary-800">
                  <p className="text-xs font-black uppercase tracking-widest text-accent-400">Maize Production</p>
                  <h3 className="text-sm font-bold">Commercial Yellow Corn</h3>
                </div>
             </div>
             <div className="md:col-span-2 rounded-3xl overflow-hidden h-96 relative group border border-slate-100 shadow-md">
                <img src="/images/cashew_nuts.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="absolute bottom-6 left-6 text-white z-10 glass-card bg-primary-950/60 px-4 py-2 border-primary-800">
                  <p className="text-xs font-black uppercase tracking-widest text-[#fbbf24]">Cashew Cultivation</p>
                  <h3 className="text-sm font-bold">Premium Raw Cashew Nuts</h3>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-800" />
        <div className="absolute inset-0 opacity-20">
           <img src="/images/poultry_9.jpg" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto glass-card p-12 lg:p-20 bg-primary-950/80 border-primary-800"
          >
            <h2 className="text-4xl lg:text-6xl font-display font-extrabold text-white mb-8">
              Looking for a Reliable Poultry Supply Partner?
            </h2>
            <p className="text-primary-200 text-xl mb-12 max-w-2xl mx-auto font-light">
              We specialize in bulk supply for hotels, restaurants, and wholesale distributors. Let's discuss how we can fuel your growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href={`tel:${CONTACT_INFO.phone}`} className="btn-accent px-12 py-5 text-lg">
                Call Us Now
              </a>
              <a href={`https://wa.me/${CONTACT_INFO.whatsapp}`} className="btn-primary border-2 border-white/20 bg-transparent hover:bg-white/10 px-12 py-5 text-lg">
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
};
