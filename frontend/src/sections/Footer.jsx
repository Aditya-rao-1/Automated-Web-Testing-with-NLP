import React, { useState } from 'react';
import { socialMedia } from '../constants';

const Footer = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (email) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
     <div className="max-w-960 pricing-head_before relative mx-auto border-l border-r border-s2 bg-s1/50 pb-20 pt-28 max-xl:max-w-4xl max-lg:border-none max-md:pb-32 max-md:pt-16">

      {/* Centered Text Section */}
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold leading-snug text-p4">
          Ready to take your <br /> digital presence to the next level?
        </h1>
        <p className="text-lg md:text-xl mt-8 font-medium text-p3">
          Reach out to me today and let's discuss how I can help you achieve your goals.
        </p>
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-center items-center gap-6 mt-12">
        {socialMedia.map(({ id, icon: Icon, url, copy, email }) => (
          <div key={id} className="relative">
            {copy ? (
              <button
                onClick={() => handleCopy(email)}
                className="w-14 h-14 flex justify-center items-center bg-black/60 border border-gray-700 rounded-xl text-white hover:text-purple-400 transition-all duration-300 shadow-md hover:scale-105"
              >
                <Icon size={28} />
              </button>
            ) : (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 flex justify-center items-center bg-black/60 border border-gray-700 rounded-xl text-white hover:text-purple-400 transition-all duration-300 shadow-md hover:scale-105"
              >
                <Icon size={28} />
              </a>
            )}

            {copy && copied && (
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm text-green-400 font-medium">
                Copied!
              </span>
            )}
          </div>
        ))}
      </div>

    
    </div>
    
  );
};

export default Footer;
