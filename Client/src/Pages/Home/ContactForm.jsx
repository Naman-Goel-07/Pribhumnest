import { Helmet } from "react-helmet-async";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelopeOpenText } from "react-icons/fa";

const ContactForm = () => {
  return (
    <>
    <Helmet>
      <title>Contact Us | Pribhumnest</title>
      <link rel="canonical" href="https://pribhumnest.in/contact" />
      <meta
          name="description"
          content="Pribhumnest provides secure and easy PG management.while tenants can browse verified listings effortlessly."
      />
    </Helmet>
    <section className="relative bg-gradient-to-br from-teal-50 to-blue-50 py-20 px-6 overflow-hidden mt-10">
      <div className="absolute top-0 left-0 w-full overflow-hidden -mt-24">
        <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-24">
          <path
            d="M0.00,49.98 C150.00,150.00 349.96,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"
            fill="#99f6e4"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-3">Get in Touch</h2>
          <p className="text-base text-gray-600 max-w-lg mx-auto">
            Reach out to us anytime — we're happy to answer your questions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="bg-white border border-gray-100 rounded-xl shadow-md p-6 text-center transition hover:shadow-lg hover:scale-105">
            <div className="bg-teal-100 text-teal-700 p-3 rounded-full mx-auto w-fit shadow-sm">
              <FaPhoneAlt size={22} />
            </div>
            <h3 className="text-lg font-semibold mt-3">Call Us</h3>
            <p className="text-gray-600 mt-1 text-sm">+91 730-384-7437</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl shadow-md p-6 text-center transition hover:shadow-lg hover:scale-105">
            <div className="bg-teal-100 text-teal-700 p-3 rounded-full mx-auto w-fit shadow-sm">
              <FaEnvelopeOpenText size={22} />
            </div>
            <h3 className="text-lg font-semibold mt-3">Email Us</h3>
            <p className="text-gray-600 mt-1 text-sm">support@pribhumnest.in</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl shadow-md p-6 text-center transition hover:shadow-lg hover:scale-105">
            <div className="bg-teal-100 text-teal-700 p-3 rounded-full mx-auto w-fit shadow-sm">
              <FaMapMarkerAlt size={22} />
            </div>
            <h3 className="text-lg font-semibold mt-3">Visit Us</h3>
            <p className="text-gray-600 mt-1 text-sm"> Azadpur delhi.</p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default ContactForm;
