import type React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-10">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Taly Booking. All rights reserved.
        </p>
        <div className="mt-4 flex justify-center space-x-6">
          <a href="/privacy" className="cursor-pointer hover:text-gray-400">
            Privacy Policy
          </a>
          <a href="/terms" className="cursor-pointer hover:text-gray-400">
            Terms of Service
          </a>
          <a href="/contact" className="cursor-pointer hover:text-gray-400">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
