import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FAQs.css';

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Are your components genuine?",
      answer: "Absolutely. We strictly enforce a zero grey-market policy. Every component in our catalog is sourced directly from verified manufacturer channels or authorized master distributors. We guarantee the authenticity of every part we ship."
    },
    {
      question: "What is your shipping cutoff time?",
      answer: "Orders placed before 3:00 PM (UK time) Monday through Friday for parts marked 'PRESSURISED' will be dispatched the same working day."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we only ship within the United Kingdom. We are working on expanding our logistics network to support European deliveries in the near future."
    },
    {
      question: "How do you handle moisture-sensitive devices (MSD)?",
      answer: "Moisture-sensitive devices are stored in climate-controlled environments according to JEDEC J-STD-033 standards. Prior to shipping, they are baked (if necessary) and vacuum-sealed in moisture barrier bags with desiccant and a humidity indicator card."
    },
    {
      question: "Can I request a part you don't stock?",
      answer: "Our inventory is heavily curated for performance engineering. However, if you are working on a prototype and need a specific reel, you can contact our sourcing team. We do not do one-off special orders for single chips."
    },
    {
      question: "What is the difference between PRESSURISED and VENTING status?",
      answer: "'PRESSURISED' indicates healthy stock levels (plenty of units available). 'VENTING' indicates that stock is running low (typically under 10 units remaining) and you should order immediately before it becomes 'DEPLETED'."
    }
  ];

  return (
    <div className="faqs-page">
      <hr className="pressure-rule" />
      <div className="container faqs-container">
        
        <div className="faqs-header">
          <h1 className="text-h1">Frequently Asked Questions</h1>
          <p className="text-steel-400">Everything you need to know about our sourcing, shipping, and component handling.</p>
        </div>

        <div className="faqs-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
              <button 
                className="faq-question" 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-h3">{faq.question}</span>
                <ChevronDown size={20} className="faq-icon" />
              </button>
              <div className="faq-answer">
                <div className="faq-answer-content prose">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
