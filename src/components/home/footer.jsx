import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhoneAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Particles from "./particles";
import sponsorLogo from "../../assets/Logo.png";

const sections = ["timeline", "about", "tracks", "prizes"];

const socialLinks = [
  { icon: FaFacebookF, url: "https://www.facebook.com/SathyabamaOfficial/" },
  {
    icon: FaInstagram,
    url: "https://www.instagram.com/innoverse_26?igsh=amdoamZsYzdodzVm",
  },
  { icon: FaLinkedinIn, url: "https://in.linkedin.com/school/sathyabama/" },
  { icon: FaXTwitter, url: "https://x.com/SathyabamaSIST" },
];

const contacts = [
  { label: "Coordinator", phone: "+91 9080266483", tel: "+919080266483" },
  { label: "Assistant Coordinator", phone: "+91 8248018893", tel: "+918248018893" },
];

export default function Footer() {
  const getNavbarHeight = () =>
    document.querySelector("nav")?.offsetHeight || 0;

  const handleScroll = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const navbarHeight = getNavbarHeight();
    const offset = ["about", "prizes"].includes(sectionId)
      ? navbarHeight + 35
      : navbarHeight;

    const topPos =
      element.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({ top: topPos, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full px-6 pt-10 pb-6">
      <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-t-[3rem] border-t border-l border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]" />
      <Particles />
      <div className="absolute inset-0 rounded-t-[3rem] bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-16">
          <div className="flex flex-col gap-6">
            <h3 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-500 drop-shadow-sm">
              INNOVERSE '26
            </h3>

            <div className="w-full flex flex-col items-start">
              <p className="text-green-100/30 text-[10px] tracking-[0.35em] uppercase mb-3">
                Sponsored By
              </p>

              <div className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(34,197,94,0.12)]">
                <img
                  src={sponsorLogo}
                  alt="Sponsor Logo"
                  className="h-8 md:h-9 w-auto object-contain opacity-90"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-bold text-white tracking-wide uppercase">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3 text-green-100/50 text-sm">
              {sections.map((link) => (
                <li
                  key={link}
                  onClick={() => handleScroll(link)}
                  className="group flex items-center gap-2 hover:text-green-400 transition-all duration-300 cursor-pointer select-none"
                >
                  <span className="w-0 h-[1px] bg-green-400 transition-all duration-300 group-hover:w-4" />
                  {link.charAt(0).toUpperCase() + link.slice(1)}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-lg font-bold text-white tracking-wide uppercase">
              Connect With Us
            </h4>

            <div className="flex gap-5">
              {socialLinks.map(({ icon: Icon, url }, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Social Link"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-green-500/20 hover:border-green-500/50 hover:-translate-y-1 transition-all duration-300 text-green-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {contacts.map((c) => (
                <div
                  key={c.label}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2 text-green-200/80 min-w-[210px]">
                    <FaPhoneAlt size={14} className="text-green-300" />
                    <span className="text-[11px] tracking-[0.28em] uppercase font-semibold">
                      {c.label}
                    </span>
                  </div>

                  <a
                    href={`tel:${c.tel}`}
                    className="text-sm text-green-100/60 hover:text-green-300 transition whitespace-nowrap"
                  >
                    {c.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center">
          <p className="text-green-100/30 text-xs tracking-widest uppercase text-center">
            © {new Date().getFullYear()} INNOVERSE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
