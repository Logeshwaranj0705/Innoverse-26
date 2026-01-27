import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import image from "../../assets/innoverse-logo.png";

const sections = ["home", "timeline", "about", "tracks", "prizes"];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const getNavbarHeight = () =>
    document.querySelector("nav")?.offsetHeight || 0;

  const handleScroll = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    setOpen(false);

    setTimeout(() => {
      const navbarHeight = getNavbarHeight();
      const offset = ["about", "prizes"].includes(sectionId)
        ? navbarHeight + 40
        : navbarHeight;

      const topPos =
        element.getBoundingClientRect().top +
        window.pageYOffset -
        offset;

      window.scrollTo({
        top: topPos,
        behavior: "smooth",
      });
    }, 250);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="
        fixed top-0 w-full z-50
        bg-black/80 backdrop-blur-md
        border-b border-white/10
      "
    >
      <div className="px-3 md:px-5 flex justify-between items-center py-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => handleScroll("home")}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <img
            src={image}
            alt="INNOVERSE logo"
            className="h-8 w-8 md:h-12 md:w-17"
          />

          <span className="
            text-xl md:text-2xl font-extrabold tracking-widest leading-none
            bg-gradient-to-r from-green-300 to-green-500
            bg-clip-text text-transparent
            drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]
          ">
            INNOVERSE
          </span>

          <span className="
            text-xl md:text-2xl font-extrabold leading-none text-white relative -top-[1px]
          ">
            ’26
          </span>
        </motion.div>

        <ul className="hidden md:flex gap-10 text-xs tracking-[0.25em] text-gray-300">
          {sections.slice(1).map((section, i) => (
            <motion.li
              key={section}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              onClick={() => handleScroll(section)}
              className="
                relative cursor-pointer transition hover:text-green-400
                after:absolute after:left-0 after:-bottom-1 after:h-[1px]
                after:w-0 after:bg-green-400 after:transition-all after:duration-300
                hover:after:w-full
              "
            >
              {section.toUpperCase()}
            </motion.li>
          ))}
        </ul>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-green-400 text-xl z-50"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="
              md:hidden overflow-hidden
              bg-black/95 backdrop-blur-md
              border-t border-white/10
            "
          >
            <ul className="flex flex-col items-center gap-6 py-8 text-sm tracking-[0.3em] text-gray-300">
              {sections.slice(1).map((section) => (
                <li
                  key={section}
                  onClick={() => handleScroll(section)}
                  className="cursor-pointer hover:text-green-400 transition"
                >
                  {section.toUpperCase()}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
