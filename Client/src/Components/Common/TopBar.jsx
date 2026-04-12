import { BsFillTelephoneFill } from "react-icons/bs";
import { IoMail } from "react-icons/io5";
import { FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";

export const TopBar = () => {
  return (
    <div className="bg-[#71C0BB] hidden px-4 md:px-10 py-2 md:block ">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
        
        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 items-center">
          <h1 className="flex items-center text-white text-sm sm:text-base font-semibold gap-2">
            <BsFillTelephoneFill className="text-lg" /> +91 730-384-7437
          </h1>
          <h1 className="flex items-center text-white text-sm sm:text-base font-semibold gap-2">
            <IoMail className="text-lg" /> support@pribhumnest.in
          </h1>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-2 text-white text-xl mt-1 md:mt-0">
            <a
        href="https://www.instagram.com/pribhumnest?igsh=MThsam9kMm9ydTJjNg=="
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaInstagramSquare />
      </a>
          <FaSquareXTwitter />
          <FaFacebookSquare />
        </div>
      </div>
    </div>
  );
};
