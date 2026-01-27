import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import Particles from "./particles";

export default function Footer() {
  return (
    <footer className="relative w-full  px-6 py-8 ">
      <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-t-[3rem] border-t border-l border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]" />
      <Particles />
      {/* Subtle Inner Glow Overlay */}
      <div className="absolute inset-0 rounded-t-[3rem] bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 z-10">
        
        {/* Logo & About */}
        <div className="flex flex-col gap-6">
          <h3 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 drop-shadow-sm">
            INNOVERSE
          </h3>
          <p className="text-green-100/60 text-sm md:text-base leading-relaxed max-w-xs">
            Bringing together innovators, developers, and problem-solvers to ideate and build impactful solutions.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-bold text-white tracking-wide uppercase">Quick Links</h4>
          <ul className="flex flex-col gap-3 text-green-100/50 text-sm">
            {["Timeline", "About", "Tracks","Prizes"].map((link) => (
              <li 
                key={link} 
                className="group flex items-center gap-2 hover:text-green-400 transition-all duration-300 cursor-pointer"
              >
                <span className="w-0 h-[1px] bg-green-400 transition-all duration-300 group-hover:w-4" />
                {link}
              </li>
            ))}
          </ul>
        </div>

        {/* Social & Contact */}
        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-bold text-white tracking-wide uppercase">Connect With Us</h4>
          <div className="flex gap-5">
            {[FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter].map((Icon, index) => (
              <div 
                key={index}
                className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-green-500/20 hover:border-green-500/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer text-green-300"
              >
                <Icon size={18} />
              </div>
            ))}
          </div>
          <div className="mt-4 pt-6 border-t border-white/5">
            <p className="text-green-100/30 text-xs tracking-widest uppercase">
              © {new Date().getFullYear()} INNOVERSE. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}