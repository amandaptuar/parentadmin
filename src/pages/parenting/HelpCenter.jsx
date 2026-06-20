import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, Mail, Phone, Clock, ChevronDown, ChevronUp,
  ShieldCheck, Info, MessageCircle, MapPin
} from 'lucide-react';

const faqsList = [
  {
    question: "What is Vigil?",
    answer: "Vigil is a state-of-the-art parental monitoring platform designed to keep children safe in the digital world. It allows parents to monitor calls, SMS, location, screen time, app usage, and get AI-driven alerts for potential risks, cyberbullying, or online predators."
  },
  {
    question: "How do I install the child application?",
    answer: "To set up tracking, you need physical access to your child's Android device. Download the Vigil Kids application, install it, and use the unique 6-character pairing code generated from your parent dashboard to link the child device securely."
  },
  {
    question: "Does Vigil run invisibly on my child's device?",
    answer: "Vigil Kids operates discreetly in the background to ensure it is not easily disabled or bypassed. While it runs without obtrusive alerts, we strongly advocate for open communication and transparency with your children regarding digital safety rules."
  },
  {
    question: "Which devices are compatible with Vigil?",
    answer: "The Parent Dashboard is accessible on any modern device (Android, iOS, PC, Mac) via web browsers or the Parent App. The Vigil Kids monitoring client currently supports Android devices running Android 7.0 and above."
  },
  {
    question: "How does real-time location tracking work?",
    answer: "Vigil uses GPS and cell-tower/Wi-Fi triangulation to provide precise real-time location updates. You can view the live location of your child on the map or review their historical routes and timelines over any custom date range."
  },
  {
    question: "What are Geofences and how do they help?",
    answer: "Geofences are customizable virtual perimeters you set up around crucial areas like home, school, or a friend's house. Vigil sends instant push notifications and email alerts when your child enters or exits these predefined safe zones."
  },
  {
    question: "Can I monitor WhatsApp and other social media chats?",
    answer: "Yes, Vigil utilizes accessibility services to read and analyze messaging logs from WhatsApp, Instagram, Snapchat, Facebook, and Telegram, flagging keywords related to bullying, self-harm, or inappropriate content."
  },
  {
    question: "What kind of safety alerts will I receive?",
    answer: "You will receive real-time notifications for critical battery levels, geofence entries/exits, prohibited app installations, screen time limits exceeded, and critical AI alerts for high-risk text messages or calls."
  },
  {
    question: "How secure is the data collected by Vigil?",
    answer: "Security is our highest benchmark. All child data is encrypted in transit using SSL/TLS and stored with advanced AES-256 encryption at rest. Only authorized parent accounts can decrypt and view this tracking data; it is never shared or sold."
  },
  {
    question: "How do I manage my subscription or add devices?",
    answer: "You can modify your subscription tier, view billing statements, or change payment details under the 'Profile -> Manage Plan' section. Upgrading your plan will allow you to add and monitor additional child devices instantly."
  }
];

export const HelpCenter = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="page-content-wrapper">
      <div className="container-fluid pt-4">
        
        {/* Page Title */}
        <div className="row mb-4 animate-fade-in">
          <div className="col-12">
            <h4 className="page-title m-0 d-flex align-items-center gap-2">
              <HelpCircle className="text-primary" /> Help & Support Center
            </h4>
          </div>
        </div>

        {/* Hero Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div 
              className="card shadow-sm border-0 rounded-lg text-white"
              style={{ 
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                borderRadius: '16px',
                overflow: 'hidden'
              }}
            >
              <div className="card-body p-4 p-md-5 position-relative">
                <div style={{ position: 'absolute', top: 0, right: 0, opacity: 0.1, pointerEvents: 'none' }}>
                  <ShieldCheck size={200} />
                </div>
                <div className="row align-items-center">
                  <div className="col-lg-8">
                    <span className="badge badge-pill badge-light text-primary font-weight-bold mb-3 px-3 py-2">Vigil Protection Platform</span>
                    <h2 className="font-weight-bold text-white mb-3">Your partner in digital parenting</h2>
                    <p className="lead text-white-50 m-0" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                      Welcome to the Vigil Help Center. Vigil is designed to bridge the gap between parenting and digital freedom. Explore our documentation below, check out our FAQs, or reach out to our dedicated support channels if you need immediate assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact and Info Cards */}
        <div className="row mb-5">
          <div className="col-md-6 mb-4 mb-md-0">
            <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <h5 className="font-weight-bold mb-3 text-dark d-flex align-items-center gap-2">
                  <Info className="text-primary" size={20} /> About Vigil Safety
                </h5>
                <p className="text-muted" style={{ lineHeight: '1.6', fontSize: '14.5px' }}>
                  Vigil is a robust parental intelligence suite engineered by cybersecurity and child safety professionals. The platform monitors incoming and outgoing cellular/social traffic, device statistics, real-time geography, and screen time to generate proactive safety recommendations for parents.
                </p>
                <div className="mt-4 p-3 bg-light rounded-lg border-left border-primary" style={{ borderLeftWidth: '4px' }}>
                  <p className="m-0 text-dark font-weight-bold" style={{ fontSize: '13px' }}>Digital Protection Rating</p>
                  <p className="m-0 text-muted small">Vigil adheres to COPPA and SOC2 level standards for student/child data protection.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <h5 className="font-weight-bold mb-3 text-dark d-flex align-items-center gap-2">
                  <MessageCircle className="text-primary" size={20} /> Contact Support
                </h5>
                <p className="text-muted mb-4" style={{ fontSize: '14.5px' }}>
                  Need help setting up a child device, upgrading your subscription, or troubleshooting geofencing? Our support team is online 24/7.
                </p>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-lg">
                    <div className="rounded-circle bg-primary-light p-2 text-primary">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="m-0 text-muted small font-weight-bold">Email Support</p>
                      <a href="mailto:support@vigilsafety.com" className="m-0 text-primary font-weight-bold">support@vigilsafety.com</a>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-lg">
                    <div className="rounded-circle bg-success-light p-2 text-success">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="m-0 text-muted small font-weight-bold">Phone Support (Toll-Free)</p>
                      <a href="tel:+18005550199" className="m-0 text-success font-weight-bold">+1 (800) 555-0199</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="row mb-5">
          <div className="col-12">
            <h5 className="font-weight-bold mb-4 text-dark d-flex align-items-center gap-2">
              <HelpCircle className="text-primary" size={22} /> Frequently Asked Questions
            </h5>

            <div className="accordion-wrapper d-flex flex-column gap-3">
              {faqsList.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div 
                    key={index} 
                    className="card shadow-sm border-0 overflow-hidden" 
                    style={{ borderRadius: '12px', border: '1px solid #f1f1f1' }}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="btn text-left p-3 d-flex align-items-center justify-content-between w-100 bg-white border-0"
                      style={{ outline: 'none' }}
                    >
                      <span className="font-weight-bold text-dark" style={{ fontSize: '15.5px' }}>
                        {index + 1}. {faq.question}
                      </span>
                      {isOpen ? <ChevronUp className="text-muted" size={18} /> : <ChevronDown className="text-muted" size={18} />}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="card-body bg-light border-top p-3 text-muted" style={{ lineHeight: '1.6', fontSize: '14.5px' }}>
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
