import { motion } from "framer-motion";
import { FaArrowRight, FaCalendarAlt, FaUsers } from "react-icons/fa";
import Countdown from "./countdown";
import Particles from "./particles";
import { FaCreditCard, FaMoneyBillWave, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export default function Hero() {
  const navigate= useNavigate();
    const handleRegisterClick = async () => {
        navigate('/register');
    };
  return (
    <section className="relative min-h-[90%] overflow-hidden bg-black text-white">
      <Particles />
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      <div className="relative z-20 px-6 sm:px-10 lg:px-20 pt-20 sm:pt-24 lg:pt-28">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -1080 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full lg:w-auto"
          >
            <h1 className="
              text-5xl sm:text-6xl md:text-7xl lg:text-8xl
              font-extrabold
              bg-gradient-to-b from-white via-green-300 to-green-500
              bg-clip-text text-transparent
              drop-shadow-[0_0_18px_rgba(34,197,94,0.9)]
            ">
              INNOVERSE <span className="text-green-400">'26</span>
            </h1>

            <motion.p
              className="mt-5 ml-2 tracking-[0.3em] text-sm text-gray-300"
            >
              24-HOUR INTRA-COLLEGE HACKATHON
            </motion.p>

            <div className="mt-14">
              <Countdown />
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="
              flex flex-col items-center lg:items-end
              gap-6 mt-2 w-full lg:w-auto
            "
          >
            <motion.button className="
              flex items-center gap-3
              px-10 py-3 rounded-lg font-semibold text-black
              bg-green-500
              shadow-[0_0_30px_rgba(34,197,94,0.9)] cursor-pointer
            " onClick={handleRegisterClick}>
              Register Now! <FaArrowRight />
            </motion.button>

            <div className="w-full sm:w-80 mt-10 lg:mt-20">
              {/* DATE */}
              <div className="mb-6 px-6 py-4 rounded-xl bg-white/5 border border-green-300 text-center">
                <FaCalendarAlt className="mx-auto mb-2 text-xl" />
                <p className="text-xs tracking-widest text-gray-400">DATE</p>
                <p className="text-lg font-semibold">27th Feb - 28th Feb</p>
              </div>

              {/* TEAM */}
              <div className="mb-6 px-6 py-4 rounded-xl bg-white/5 border border-green-300 text-center">
                <FaUsers className="mx-auto mb-2 text-xl" />
                <p className="text-xs tracking-widest text-gray-400">TEAM SIZE</p>
                <p className="text-lg font-semibold">2 – 4 Members</p>
              </div>

              <div className="px-6 py-4 rounded-xl bg-white/5 border border-green-300 text-center">
                <FaCreditCard className="mx-auto mb-2 text-xl" />
                <p className="text-xs tracking-widest text-gray-400">ENTRY FEE PER TEAM</p>
                <p className="text-lg font-semibold">₹300</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
