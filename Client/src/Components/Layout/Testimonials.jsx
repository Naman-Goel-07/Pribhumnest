import React, { useEffect, useState } from "react";
import { VscChevronLeft, VscChevronRight } from "react-icons/vsc";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import rahul from "../../assets/rahulSharma.jpg"
import sneha from "../../assets/snehaVerma.jpg"
import amit from "../../assets/amitPatel.jpg"


const testimonialsData = [
  {
    name: "Rahul Sharma",
    review:
      "Finding a PG used to be stressful, but PRIBHUM NEST made it so easy. The process was smooth and the property was exactly as shown!",
    location: "Delhi University",
    image: `${rahul}`,
    rating: 5,
  },
  {
    name: "Sneha Verma",
    review:
      "The best PG experience I’ve had! Safe, clean, and budget-friendly. Highly recommended to all working professionals.",
    location: "Noida Sector 62",
    image:`${sneha}`,
    rating: 4,
  },
  {
    name: "Amit Patel",
    review:
      "I moved to Gurgaon recently, and PRIBHUM NEST helped me settle in fast. Their support team is very responsive and friendly.",
    location: "Gurgaon Cyber City",
    image: `${amit}`,
    rating: 5,
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonialsData.length - 1 : prev - 1
    );
  };

  const { name, review, location, image, rating } =
    testimonialsData[currentIndex];

  return (
    <section className="py-24 bg-gradient-to-t from-[#f0fbfa] via-white/80 to-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Hear From Our Happy Users
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
          Join thousands of students & professionals who trust{" "}
          <span className="text-teal-600 font-semibold">PRIBHUM NEST</span> to
          find their perfect accommodation.
        </p>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.6 }}
              className="bg-white/70 backdrop-blur-lg p-10 rounded-3xl shadow-2xl transition-all duration-700 ease-in-out max-w-xl mx-auto border border-white/50"
            >
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md ring-4 ring-teal-500 ring-offset-2">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <FaQuoteLeft className="text-teal-500 text-4xl mt-6 mb-4 opacity-80" />

                <p className="text-gray-700 italic text-lg leading-relaxed">
                  “{review}”
                </p>

                <div className="flex justify-center mt-4 text-yellow-400">
                  {Array.from({ length: rating }).map((_, idx) => (
                    <FaStar key={idx} />
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                  <p className="text-sm text-teal-600">{location}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-10 gap-6">
            <button
              onClick={prevTestimonial}
              className="p-3 bg-white hover:bg-teal-100 border border-gray-200 text-teal-600 rounded-full shadow-lg transition"
            >
              <VscChevronLeft size={22} />
            </button>
            <button
              onClick={nextTestimonial}
              className="p-3 bg-white hover:bg-teal-100 border border-gray-200 text-teal-600 rounded-full shadow-lg transition"
            >
              <VscChevronRight size={22} />
            </button>
          </div>

          <div className="flex justify-center mt-6 gap-3">
            {testimonialsData.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "bg-teal-600 scale-110" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
