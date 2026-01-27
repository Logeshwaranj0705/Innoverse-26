import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TARGET_DATE = new Date("2026-02-27T09:00:00"); 

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const diff = TARGET_DATE - new Date();
    if (diff <= 0) return null;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <p className="text-green-400 text-xl text-center">
        🚀 Hackathon Started!
      </p>
    );
  }

  return (
    <section className="bg-black py-20 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="
          text-4xl md:text-5xl font-extrabold
          bg-gradient-to-r from-white via-green-300 to-green-500
          bg-clip-text text-transparent mb-12
        "
      >
        COUNTDOWN TO INNOVERSE ’26
      </motion.h2>

      <div className="flex flex-wrap justify-center gap-8">
        {Object.entries(timeLeft).map(([label, value]) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="
              w-28 h-28 rounded-xl
              border border-green-400/40
              shadow-[0_0_30px_rgba(34,197,94,0.3)]
              flex flex-col items-center justify-center
            "
          >
            <span className="text-4xl font-black text-green-400">
              {value}
            </span>
            <span className="text-xs tracking-widest text-gray-400 uppercase">
              {label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
