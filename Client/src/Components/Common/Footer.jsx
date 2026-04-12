import { NavLink } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
// import logo from "../../assets/Logo.png";

const Footer = () => {
  return (
 <footer className="bg-gradient-to-br from-[#014d4b] to-[#002f2e] text-white pt-16 pb-10 px-6 sm:px-10 md:px-20 ">
  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">

    {/* Brand Info */}
    <div>
      <h2 className="text-2xl font-bold mb-4">PRIBHUM NEST</h2>
      <p className="text-sm text-gray-300">
        Azadpur delhi.
      </p>
      <p className="mt-4 text-gray-400 text-sm">📍 Delhi, India</p>
      <p className="text-gray-400 text-sm">✉️ support@pribhumnest.in</p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
      <ul className="space-y-3 text-sm">
        <li><a href="/" className="hover:text-teal-300">Home</a></li>
        <li><a href="/about" className="hover:text-teal-300">About Us</a></li>
        <li><a href="/contact" className="hover:text-teal-300">Contact</a></li>
      </ul>
    </div>

    {/* Support */}
    <div>
      <h3 className="text-lg font-semibold mb-4">Support</h3>
      <ul className="space-y-3 text-sm">
        <li><NavLink to="termConditions" className="hover:text-teal-300">Terms & Conditions</NavLink></li>
        <li><NavLink to="/privacyPolicy" className="hover:text-teal-300">Privacy Policy</NavLink></li>
      </ul>
    </div>

    {/* Newsletter + Socials */}
    <div>
      <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
      <p className="text-sm text-gray-300 mb-3">Join our newsletter for updates and deals</p>
      <form className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          className="px-4 py-2 rounded-lg bg-white text-black focus:outline-none w-full sm:w-auto"
        />
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded-lg text-white font-semibold transition"
        >
          Subscribe
        </button>
      </form>

      {/* Social Icons */}
      <div className="flex gap-4 mt-5 text-xl text-gray-300">
        <a href="#" className="hover:text-blue-400"><i className="fab fa-facebook-f"></i></a>
        <a href="#" className="hover:text-pink-400"><i className="fab fa-instagram"></i></a>
        <a href="#" className="hover:text-sky-400"><i className="fab fa-twitter"></i></a>
        <a href="#" className="hover:text-blue-600"><i className="fab fa-linkedin-in"></i></a>
      </div>
    </div>
  </div>

  {/* Bottom */}
  <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400 text-sm">
    © {new Date().getFullYear()} PRIBHUM NEST. All rights reserved.
  </div>
</footer>

  );
};

export default Footer;
