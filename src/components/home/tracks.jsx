import { motion } from "framer-motion";
import TrackCard from "./trackCards";
import Particles from "./particles";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.25 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Tracks() {
  const tracks = [
  {
    title: "HealthTech",
    desc:
      "This track focuses on the use of technology to support preventive healthcare, long-term health monitoring, and digital care systems. It explores how data from sensors, wearables, and medical records can be combined with AI to support healthier living and better care experiences.",
    tags: [
      "Chronic Care Intelligence",
      "Early Disease Detection",
      "Wearables & AI",
    ],
  },
  {
    title: "Transport & Smart Mobility",
    desc:
      "This track covers intelligent transportation systems aimed at improving everyday urban mobility. It includes the use of data and smart technologies to enhance road safety, traffic flow, parking management, and commuter convenience in cities.",
    tags: [
      "Accident Hotspot Mapping",
      "Smart Parking",
      "Urban Analytics",
    ],
  },
  {
    title: "Robotics & Drone",
    desc:
      "This track explores autonomous robots and drone technologies used for monitoring, inspection, and field operations. It focuses on sensing, navigation, and automation in applications such as disaster response, agriculture, and infrastructure analysis.",
    tags: [
      "Disaster Recon Drones",
      "Autonomous Navigation",
      "Agri Drones",
    ],
  },
  {
    title: "Agriculture & ClimateTech",
    desc:
      "This track is centered on applying data, sensors, and predictive models to agriculture and climate-related challenges. It looks at how technology can support crop health, soil monitoring, water management, and climate-aware farming practices.",
    tags: [
      "Crop Disease Prediction",
      "IoT Soil Sensors",
      "Climate Advisory",
    ],
  },
  {
    title: "Education & SkillTech",
    desc:
      "This track focuses on digital tools that enhance learning and skill development. It includes personalized learning systems, offline-friendly educational platforms, and inclusive technologies designed to support diverse learning needs.",
    tags: [
      "Personalized Learning",
      "Offline Education",
      "Inclusive Tech",
    ],
  },
];

  return (
    <section className="relative py-24 max-w-7xl mx-auto px-6">
      <div className="absolute inset-0 z-0">
        <Particles />
      </div>

      <div className="relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="
            text-4xl md:text-5xl font-extrabold
            bg-gradient-to-r from-white via-green-300 to-green-500
            bg-clip-text text-transparent
            drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]
          "
        >
          Innovation <span className="text-accent">Tracks</span>
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-10"
        >
          {tracks.map((track, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={index === tracks.length - 1 ? "" : ""}
            >
              <TrackCard {...track} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mt-10"
        ><div className="bg-black/50 border border-4 border-dotted border-green-500/40 rounded-xl p-8 hover:shadow-[0_0_30px_#22c55e] hover:border-green-400 transition-all duration-500 flex">
          <h2 className="text-xl font-extrabold text-green-400">Note:</h2>
          <p className="text-gray-400 tracking-widest text-sm ml-5">This is only a preview of the available tracks. The detailed problem statements will be released a few days before the hackathon or on the day of the event. </p>
        </div>
        
        </motion.div>

      </div>
    </section>
  );
}
