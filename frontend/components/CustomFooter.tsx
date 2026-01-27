import React from 'react';
import { Twitter, Github, Globe, Mail } from 'lucide-react';

const CustomFooter: React.FC = () => {
  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/basebond', label: 'Twitter' },
    { icon: Github, href: 'https://github.com/basebond', label: 'GitHub' },
    { icon: Globe, href: 'https://docs.basebond.xyz', label: 'Docs' },
    { icon: Mail, href: 'mailto:hello@basebond.xyz', label: 'Email' }
  ];

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/Base.jpg" alt="BaseBond Logo" className="w-10 h-10 rounded-lg shadow-sm" />
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">BaseBond</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Revolutionizing events with blockchain technology.
            </p>
          </div>

          {/* Links */}
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'API', 'Documentation'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
            { title: 'Resources', links: ['Help Center', 'Community', 'Contact', 'Status'] }
          ].map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4 text-primary-600 dark:text-primary-400">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#5C7AEA] transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} BaseBond. All rights reserved.
          </div>

          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-white hover:scale-110 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-600 hover:to-primary-400"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CustomFooter;
