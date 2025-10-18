import React from "react";
import { motion } from "framer-motion";

const features = [
  { title: "Instant Shortening", desc: "Shorten long URLs instantly." },
  { title: "Custom Aliases", desc: "Create memorable custom URLs." },
  { title: "Analytics", desc: "Track clicks and engagement." },
  { title: "Secure & Reliable", desc: "Safe links with high uptime." },
];

// A self-contained particle animation component that reacts to cursor movement.
const CanvasParticles = () => {
  const canvasRef = React.useRef(null);
  const mouse = React.useRef({ x: null, y: null });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleMouseMove = (event) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let shootingStars = [];
    const createShootingStar = () => {
      // Only create stars when the cursor is on the page
      if (mouse.current.x !== null) {
        shootingStars.push({
          x: mouse.current.x,
          y: mouse.current.y,
          radius: Math.random() * 1.5 + 1,
          speed: Math.random() * 3 + 2,
          trailLength: Math.random() * 20 + 15,
          angle: Math.random() * Math.PI * 2, // Shoot in a random direction
          ttl: 80, // time to live reduced for quicker fade
        });
      }
    };
    
    // Create stars more frequently for a smoother trail
    const starInterval = setInterval(createShootingStar, 50);

    const animate = () => {
      // A slightly stronger fade effect for smoother trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      shootingStars.forEach((star, index) => {
        const vx = Math.cos(star.angle) * star.speed;
        const vy = Math.sin(star.angle) * star.speed;
        const trailStartX = star.x - vx * star.trailLength;
        const trailStartY = star.y - vy * star.trailLength;

        // Use the remaining ttl to calculate opacity for a fade-out effect
        const opacity = (star.ttl / 80);
        const gradient = ctx.createLinearGradient(trailStartX, trailStartY, star.x, star.y);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = star.radius;
        ctx.beginPath();
        ctx.moveTo(trailStartX, trailStartY);
        ctx.lineTo(star.x, star.y);
        ctx.stroke();

        star.x += vx;
        star.y += vy;
        star.ttl--;

        if (star.ttl <= 0) {
          shootingStars.splice(index, 1);
        }
      });

      animationFrameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(starInterval);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 w-full h-full" />;
};


const About = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center px-6 py-12 text-white overflow-hidden">
      <CanvasParticles />

      {/* Header */}
      <motion.h1
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-6xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 drop-shadow-lg"
      >
        TinyTrail
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.2 }}
        className="text-lg text-gray-300 max-w-3xl text-center mb-12"
      >
        TinyTrail is a futuristic URL shortening platform. Transform long links into sleek, shareable URLs with analytics, speed, and style.
      </motion.p>

      {/* Features */}
      <h2 className="text-4xl font-semibold text-purple-400 mb-10 drop-shadow-md">Features</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl">
        {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.08, y: -5 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{  duration: 0.15, ease: "easeInOut" }}
              className="bg-white/10 backdrop-blur-md border border-purple-400/30 p-6 rounded-3xl shadow-lg cursor-pointer transition-shadow duration-200 hover:shadow-[0px_10px_30px_rgba(128,90,213,0.4)]"
            >
              <h3 className="text-2xl font-bold mb-2 text-purple-300 drop-shadow-md">{feature.title}</h3>
              <p className="text-gray-200">{feature.desc}</p>
            </motion.div>
        ))}
      </div>

      {/* Mission */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mt-16 bg-white/10 backdrop-blur-md border border-indigo-400/30 p-12 rounded-3xl max-w-4xl text-center shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
      >
        <h2 className="text-3xl font-semibold mb-4 text-indigo-300 drop-shadow-md">Our Mission</h2>
        <p className="text-gray-200 text-lg">
          Our mission is to revolutionize link sharing with a futuristic cosmic experience. TinyTrail makes URLs sleek, trackable, and immersive.
        </p>
      </motion.div>
    </div>
  );
};

export default About;

