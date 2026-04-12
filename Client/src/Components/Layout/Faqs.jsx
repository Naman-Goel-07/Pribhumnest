import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqs = [
  {
    question: "How does Pribhum Nest verify properties?",
    answer: "We perform background checks, property inspections, and require ownership documents before approving a listing.",
  },
  {
    question: "How is payment handled?",
    answer: "Payments are securely processed through our platform. Owners receive payments after tenant check-in confirmation.",
  },
  {
    question: "How can I book a PG?",
    answer: "Simply browse listings, schedule a visit or virtual tour, and confirm your booking directly through the website.",
  },
  {
    question: "How can I verify my property?",
    answer: "Register on our platform and upload documents. Our team will reach out for an on-site or virtual inspection.",
  },
  {
    question: "Can I visit the PG before booking?",
    answer: "Yes! You can schedule a visit directly from the app or website to see the PG in person before making a decision.",
  },
];

const Faqs = () => {
     const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  return (
    <div>
    <section className="bg-gradient-to-b from-[#e0f7f5] to-[#fffff] py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl overflow-hidden border transition-all duration-300 ${
                activeIndex === index ? "bg-blue-100 border-blue-300" : "bg-white border-gray-200"
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                <span className="text-blue-600 text-sm">
                  {activeIndex === index ? <FaMinus /> : <FaPlus />}
                </span>
              </button>
              {activeIndex === index && (
                <div className="px-6 pb-5 text-gray-600 animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

       
      </div>
    </section>
    </div>
  )
}

export default Faqs