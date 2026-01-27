import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import image from "../../assets/innoverse-logo.png";
import { useNavigate } from "react-router-dom";

export default function RegisterNav() {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="
        fixed top-0 w-full z-50
        bg-black/70 backdrop-blur-xl
        border-b border-white/10
        shadow-[0_10px_40px_-10px_rgba(34,197,94,0.25)]
      "
    >
      <div className="mx-auto px-4 md:px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <img
            src={image}
            alt="INNOVERSE logo"
            className="h-8 w-8 md:h-11 md:w-11 drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]"
          />

          <div className="flex items-baseline gap-1">
            <span
              className="
                text-lg sm:text-xl md:text-2xl
                font-extrabold tracking-widest
                bg-gradient-to-r from-green-300 via-green-400 to-green-500
                bg-clip-text text-transparent
              "
            >
              INNOVERSE
            </span>

            <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-white">
              ’26
            </span>
          </div>
        </motion.div>

        {/* BACK BUTTON */}
        <motion.button
          whileHover={{
            boxShadow: "0 0 20px rgba(34,197,94,0.6)",
            scale: 1.04,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="
            flex items-center justify-center
            h-9 w-9 sm:h-10 sm:w-10 md:h-auto md:w-auto
            md:px-5 md:py-2
            rounded-full
            text-green-300
            border border-green-400/40
            bg-black/40
            backdrop-blur-md
            transition-all duration-300
            hover:text-black hover:bg-green-400 cursor-pointer
          "
        >
          <FaArrowLeft className="text-sm md:text-base" />

          <span className="hidden md:inline ml-2 text-xs md:text-sm font-semibold tracking-[0.25em]">
            HOME
          </span>
        </motion.button>

      </div>
    </motion.nav>
  );
}
