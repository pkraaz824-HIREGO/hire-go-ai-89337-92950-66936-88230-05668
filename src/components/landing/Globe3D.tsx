import { Card } from "@/components/ui/card";
import { Link2 } from "lucide-react";

const Globe3D = () => {
  // Mock candidate data
  const candidates = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    name: `Candidate ${i + 1}`,
    color: i % 3 === 0 ? "from-cyan-500 to-blue-500" : i % 3 === 1 ? "from-purple-500 to-pink-500" : "from-green-500 to-teal-500",
    hasLink: i % 4 === 0,
  }));

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      {/* Central Globe */}
      <div className="relative">
        {/* Main Globe Sphere */}
        <div 
          className="w-72 h-72 rounded-full relative"
          style={{
            background: "radial-gradient(circle at 30% 30%, hsl(217 91% 70%), hsl(217 91% 50%), hsl(191 97% 77%))",
            boxShadow: "0 0 80px hsl(217 91% 60% / 0.4), inset -20px -20px 60px rgba(0, 0, 0, 0.3), inset 20px 20px 40px rgba(255, 255, 255, 0.1)",
            animation: "float3D 6s ease-in-out infinite",
          }}
        >
          {/* Glowing Ring 1 */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 opacity-30"
            style={{
              borderColor: "hsl(191 97% 77%)",
              animation: "pulseGlow 3s ease-in-out infinite",
            }}
          />
          
          {/* Glowing Ring 2 */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border opacity-20"
            style={{
              borderColor: "hsl(191 97% 77%)",
              animation: "pulseGlow 3s ease-in-out infinite 1.5s",
            }}
          />
        </div>
      </div>

      {/* Candidate Avatars Positioned Around Globe */}
      <div className="absolute inset-0">
        {candidates.map((candidate, index) => {
          const angle = (index * 360) / candidates.length;
          const radius = 220;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <div
              key={candidate.id}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                animation: `orbitCandidate 3s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`,
              }}
            >
              <Card 
                className="w-12 h-12 rounded-xl border-2 overflow-hidden relative group cursor-pointer"
                style={{
                  borderColor: "hsl(191 97% 77%)",
                  boxShadow: "0 0 15px hsl(191 97% 77% / 0.3)",
                }}
              >
                <div className={`w-full h-full bg-gradient-to-br ${candidate.color}`} />
                {candidate.hasLink && (
                  <div className="absolute top-1 right-1 bg-white rounded-full p-0.5">
                    <Link2 className="w-3 h-3 text-cyan-500" />
                  </div>
                )}
              </Card>
            </div>
          );
        })}
      </div>

      {/* Decorative Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(217 91% 60% / 0.15), transparent 70%)",
        }}
      />
    </div>
  );
};

export default Globe3D;
