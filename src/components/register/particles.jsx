import { useEffect, useState } from "react";

const PARTICLE_COUNT = 60;

export default function Particles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const createdParticles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      id: crypto.randomUUID(),
      size: Math.random() * 4 + 2,      
      x: Math.random() * 100,             
      y: Math.random() * 100,             
      driftX: Math.random() * 200 - 100,  
      driftY: Math.random() * 200 - 100,  
      duration: Math.random() * 15 + 10,  
      delay: Math.random() * 5,
    }));

    setParticles(createdParticles);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            "--dx": `${p.driftX}px`,
            "--dy": `${p.driftY}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
