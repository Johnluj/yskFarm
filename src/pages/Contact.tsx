import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';
import { CONTACT_INFO } from '../constants';

export const Contact: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Commercial Broilers',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Construct WhatsApp message
    const text = `*New Inquiry for YSJ Farm Limited*%0A%0A` +
      `*Name:* ${formData.name}%0A` +
      `*Email:* ${formData.email}%0A` +
      `*Phone:* ${formData.phone}%0A` +
      `*Service:* ${formData.service}%0A` +
      `*Message:* ${formData.message}`;
    
    const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${text}`;

    setTimeout(() => {
      setFormStatus('success');
      window.open(whatsappUrl, '_blank');
    }, 1000);
  };

  return (
    <PageWrapper>
      {/* Header Section */}
      <section className="relative pt-40 pb-24 bg-primary-950">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <span className="text-accent-500 font-bold tracking-widest text-sm uppercase mb-4 block">Get In Touch</span>
            <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-white mb-8">
              Connect With <span className="text-accent-400">Our Experts</span>
            </h1>
            <p className="text-xl text-primary-200 font-light leading-relaxed">
              Have questions about our supply capacity or want to visit our farm? We're here to help you grow your poultry business.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Contact Info Cards */}
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="lg:w-1/3 space-y-8"
            >
              <div className="group p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                  <Phone className="w-6 h-6 text-primary-700" />
                </div>
                <h3 className="text-xl font-display font-bold text-primary-950 mb-2">Call/WhatsApp</h3>
                <p className="text-gray-600 mb-4 text-sm">Direct line for inquiries and orders.</p>
                <a href={`tel:${CONTACT_INFO.phone}`} className="text-primary-700 font-bold text-lg block hover:text-primary-900 transition-colors">
                  {CONTACT_INFO.phone}
                </a>
                <a href={`https://wa.me/${CONTACT_INFO.whatsapp}`} className="text-green-600 font-bold text-sm flex items-center mt-2 hover:text-green-700 transition-colors">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Chat on WhatsApp
                </a>
              </div>

              <div className="group p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-accent-100 rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="w-6 h-6 text-accent-700" />
                </div>
                <h3 className="text-xl font-display font-bold text-primary-950 mb-2">Email Address</h3>
                <p className="text-gray-600 mb-4 text-sm">For official proposals and bulk supply contracts.</p>
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary-700 font-bold text-lg block break-all hover:text-primary-900 transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </div>

              <div className="group p-8 rounded-3xl bg-primary-900 text-white relative overflow-hidden">
                <Clock className="w-12 h-12 text-accent-500/20 absolute -right-2 -top-2" />
                <h3 className="text-lg font-display font-bold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-accent-500" />
                  Business Hours
                </h3>
                <p className="text-primary-100 font-medium">{CONTACT_INFO.hours}</p>
                <div className="mt-4 pt-4 border-t border-primary-800 text-xs text-primary-300">
                  Closed on Sundays and Public Holidays
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="lg:w-2/3"
            >
              <div className="glass-card p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-3xl font-display font-bold text-primary-950 mb-8">Send Us a Message</h2>
                  
                  {formStatus === 'success' ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-20"
                    >
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-primary-900 mb-2">Redirecting to WhatsApp...</h3>
                      <p className="text-gray-600">Your inquiry has been processed. We are opening WhatsApp for direct communication.</p>
                      <button 
                        onClick={() => setFormStatus('idle')}
                        className="mt-8 text-primary-700 font-bold hover:underline"
                      >
                        Send another message
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-primary-900 uppercase tracking-wider ml-1">Full Name</label>
                          <input 
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            type="text" 
                            className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-primary-900 uppercase tracking-wider ml-1">Email Address</label>
                          <input 
                            required
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email" 
                            className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-primary-900 uppercase tracking-wider ml-1">Phone Number</label>
                          <input 
                            required
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            type="tel" 
                            className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                            placeholder="080 1234 5678"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-primary-900 uppercase tracking-wider ml-1">Service Required</label>
                          <select 
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer"
                          >
                            <option>Commercial Broilers</option>
                            <option>Frozen Chicken</option>
                            <option>Brooding Services</option>
                            <option>Wholesale Supply</option>
                            <option>General Inquiry</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-primary-900 uppercase tracking-wider ml-1">Your Message</label>
                        <textarea 
                          required
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={6}
                          className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all resize-none"
                          placeholder="How can we help your poultry business today?"
                        ></textarea>
                      </div>

                      <button 
                        disabled={formStatus === 'submitting'}
                        className="w-full btn-primary py-5 text-lg shadow-xl shadow-primary-900/20 disabled:opacity-70"
                      >
                        {formStatus === 'submitting' ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <MessageCircle className="w-5 h-5" />
                            <span>Send via WhatsApp</span>
                          </div>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
             <motion.div 
               initial={{ x: -50, opacity: 0 }}
               whileInView={{ x: 0, opacity: 1 }}
               viewport={{ once: true }}
               className="lg:w-1/2"
             >
                <h2 className="text-4xl font-display font-bold text-primary-950 mb-6">Visit Our Facility</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  We are strategically located at Akobo, Ibadan, making us accessible for pickups and logistics. Schedule a visit to see our hygienic processes in action.
                </p>
                <div className="space-y-6">
                   <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                         <MapPin className="w-5 h-5 text-primary-700" />
                      </div>
                      <div>
                         <p className="font-bold text-primary-900">Registered Address</p>
                         <p className="text-gray-600">Road 5, Lamona, Oluhunda Akobo Ibadan, Nigeria</p>
                      </div>
                   </div>
                </div>
             </motion.div>
             
             <motion.div 
               initial={{ x: 50, opacity: 0 }}
               whileInView={{ x: 0, opacity: 1 }}
               viewport={{ once: true }}
               className="lg:w-1/2 w-full h-[450px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white p-2"
             >
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15822.427771746206!2d3.9558489000000003!3d7.4913214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1039f37c39384813%3A0x6b4be933390c9181!2sAkobo%2C%20Ibadan!5e0!3m2!1sen!2sng!4v1715950000000!5m2!1sen!2sng" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="YSJ Farm Limited Location"
                ></iframe>
             </motion.div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};
