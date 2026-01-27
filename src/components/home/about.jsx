import { motion } from "framer-motion";
import Particles from "../home/particles";

export default function About() {
  return (
    <section className="relative bg-black overflow-hidden py-20 lg:h-[55vh]">
      <Particles />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <p
            className="
              text-[27px] md:text-4xl font-extrabold
              bg-gradient-to-r from-white via-green-300 to-green-500
              bg-clip-text text-transparent
              drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]
              mb-10
            "
          >
            ABOUT_INNOVERSE
          </p>

          <h2
            className="
              text-4xl md:text-5xl font-extrabold
              bg-gradient-to-r from-white via-green-300 to-green-500
              bg-clip-text text-transparent
              drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]
            "
          >
            Where Innovation Meets Execution.
          </h2>

          <p className="mt-6 text-gray-300 leading-relaxed text-sm">
            <span className="text-green-400 font-semibold">INNOVERSE ’26</span> is a
            24-hour intra-college hackathon organized by the{" "}
            <span className="text-green-300">
              Department of Information Technology
            </span>
            , Sathyabama Institute of Science and Technology.
            <br />
            <br />
            The event brings together innovators, developers, and problem-solvers
            to ideate and build impactful solutions that bridge the physical and
            digital worlds.
          </p>
        </motion.div>

        {/* RIGHT STATS CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          viewport={{ once: true }}
          className="
            border border-green-400/30 rounded-2xl
            p-10 backdrop-blur
            shadow-[0_0_40px_rgba(34,197,94,0.25)]
            w-full
          "
        >
          <div className="space-y-8">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-extrabold text-green-400">
                24 Hrs
              </h3>
              <p className="text-gray-400 tracking-widest text-sm">
                NON-STOP INNOVATION
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-extrabold text-green-400">
                40+
              </h3>
              <p className="text-gray-400 tracking-widest text-sm">
                TEAM COUNTS
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-extrabold text-green-400">
                INTRA-COLLEGE
              </h3>
              <p className="text-gray-400 tracking-widest text-sm">
                COLLEGE LEVEL
              </p>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
