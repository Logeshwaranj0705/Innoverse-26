import { useEffect } from "react";
import Particles from "./particles";
import AOS from "aos";
import "aos/dist/aos.css";

const events = [
  { title: "Registration Opens", date: "Nov 30, 2025" },
  { title: "Round 1 Closes", date: "Jan 15, 2026" },
  { title: "Round 1 Results", date: "Jan 21, 2026" },
  { title: "Hackathon Starts", date: "Jan 30, 2026" },
  { title: "Final Presentations", date: "Jan 31, 2026" },
];

export default function Timeline() {
  useEffect(() => {
    AOS.init({
      duration: 800, // animation duration
      once: true,    // only animate once
      easing: "ease-in-out",
    });
  }, []);

  return (
    <section className="relative bg-black py-32 overflow-hidden">
      <Particles />

      <div className="max-w-5xl mx-auto px-6 relative">
        <h2
          data-aos="fade-up"
          className="
            text-4xl md:text-5xl font-extrabold text-center mb-24
            bg-gradient-to-r from-white via-green-300 to-green-500
            bg-clip-text text-transparent
          "
        >
          EVENT TIMELINE
        </h2>

        {/* Vertical Line */}
        <div className="absolute left-1/2 top-24 bottom-0 w-[2px] bg-green-500/40 -translate-x-1/2" />

        <div className="space-y-20">
          {events.map((event, i) => (
            <div
              key={i}
              data-aos={i % 2 === 0 ? "fade-right" : "fade-left"}
              className={`relative flex flex-col md:flex-row ${
                i % 2 === 0 ? "md:justify-start" : "md:justify-end"
              }`}
            >
              {/* Dot */}
              <div className="
                hidden md:block
                absolute left-1/2 top-3
                w-4 h-4 bg-green-400 rounded-full
                shadow-[0_0_12px_#22c55e]
                -translate-x-1/2
              " />

              {/* Card */}
              <div className="
                md:w-[45%] w-full
                border border-green-400/30 rounded-xl
                p-6 backdrop-blur
                shadow-[0_0_30px_rgba(34,197,94,0.25)]
              ">
                <h3 className="text-lg font-bold text-white uppercase">
                  {event.title}
                </h3>
                <p className="text-green-400 font-mono text-sm mt-2">
                  {event.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
