export default function TrackCard({ title, desc, tags }) {
  return (
    <div className="bg-black/50 border border-green-500/40 rounded-xl p-8 hover:shadow-[0_0_30px_#22c55e] hover:border-green-400 transition-all duration-500">
      <h3 className="text-3xl font-extrabold text-green-400">{title}</h3>
      <p className="text-gray-400 tracking-widest text-sm mt-5 ml-5">{desc}</p>
      <div className="mt-6 flex gap-3 flex-wrap">
        {tags.map((tag) => (
          <span
            key={tag}
            className="border border-green-400/40 px-3 py-1 rounded-full text-xs text-green-400/90 backdrop-blur
            shadow-[0_0_40px_rgba(34,197,94,0.25)] hover:bg-green-500/10 transition-colors duration-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
