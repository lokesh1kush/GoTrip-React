import React from 'react'

function Footer() {
  return (
    <footer className="bg-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
          {/* Contact Info */}
          <div className="text-white font-semibold text-center md:text-left">
            <h2 className="text-xl sm:text-2xl mb-4">Contact Info</h2>
            <div className="space-y-2">
              <p className="text-sm sm:text-base">Email: imlokeshji@gmail.com</p>
              <p className="text-sm sm:text-base">Mobile: +919672979716</p>
              <p className="text-sm sm:text-base">Address: Jaipur, Rajasthan (India)</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <a 
              href="https://www.linkedin.com/in/kush666" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
            >
              <img src="/linkedin_logo.png" alt="LinkedIn" className="w-8 sm:w-10"/>
            </a>

            <a 
              href="https://github.com/lokesh1kush" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
            >
              <img src="/github_logo.png" alt="GitHub" className="w-7 sm:w-9"/>
            </a>

            <a 
              href="https://x.com/kusssh666" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
            >
              <img src="/twitter_logo.png" alt="Twitter" className="w-7 sm:w-9"/>
            </a>

            <a 
              href="https://www.instagram.com/kusssh666" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
            >
              <img src="/instagram_logo.png" alt="Instagram" className="w-6 sm:w-8"/>
            </a>

            <a 
              href="mailto:imlokeshji@gmail.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform duration-200"
            >
              <img src="/email_logo.png" alt="Email" className="w-10 sm:w-12"/>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 