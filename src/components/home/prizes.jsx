import { motion } from "framer-motion"
import { FaTrophy } from "react-icons/fa"
import Particles from "./particles"

const prizes = [
  {
    place: "1ST PLACE",
    amount: "₹8,000",
    glow: "shadow-[0_0_45px_rgba(34,197,94,1)]",
  },
  {
    place: "2ND PLACE",
    amount: "₹5,000",
    glow: "shadow-[0_0_30px_rgba(34,197,94,0.8)]",
  },
  {
    place: "3RD PLACE",
    amount: "₹3,000",
    glow: "shadow-[0_0_20px_rgba(34,197,94,0.6)]",
  },
]

export default function Prizes() {
  return (
    <section className="relative min-h-[40vh] bg-black text-white flex flex-col items-center justify-center px-10 mb-5">
      <Particles />

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="
          text-5xl md:text-6xl font-extrabold
          bg-gradient-to-b from-white via-green-300 to-green-500
          bg-clip-text text-transparent
          drop-shadow-[0_0_20px_rgba(34,197,94,0.9)]
          mb-16
        "
      >
        Prizes
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-[1600px] justify-items-center mb-10">
        {prizes.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ scale: 1.08 }}
            className={`
              relative
              w-80 md:w-90 lg:w-100
              h-72
              rounded-2xl
              border border-green-400/60
              bg-white/5
              backdrop-blur-xl
              flex flex-col items-center justify-center
              text-center
              ${p.glow}
            `}
          >
            <FaTrophy className="text-4xl text-green-400 mb-4" />

            <p className="text-sm tracking-[0.3em] text-green-300 mb-2">
              {p.place}
            </p>

            <p className="text-4xl font-extrabold text-green-400">
              {p.amount}
            </p>

            <div className="absolute inset-0 rounded-2xl border border-green-400/20 blur-md pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
