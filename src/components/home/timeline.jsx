import { useEffect } from "react";
import Particles from "./particles";
import AOS from "aos";
import "aos/dist/aos.css";

const events = [
  { title: "Registration Opens", date: "Feb 10th, 2026" },
  { title: "Registration Closes", date: "Feb 17th, 2026" },
  { title: "Problem Statement Selection", date: "6PM Feb 25th, 2026" },
  { title: "Entry Timing", date: "Feb 27th, 2026 • 8:00 AM" },
  { title: "Hackathon Starts", date: "Feb 27th, 2026 • 11:00 AM" },
  { title: "Level 1 Evaluation", date: "Feb 27th, 2026 • 4:00 PM" },
  { title: "Level 2 Evaluation", date: "Feb 27th, 2026 • 9:00 PM" },
  { title: "Final Presentation", date: "Feb 28th, 2026 • 11:00 AM" },
];

export default function Timeline() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,    
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
