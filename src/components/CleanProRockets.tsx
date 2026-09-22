import React, { useEffect, useRef, useState } from 'react';
import { Rocket, Sparkles, RefreshCw, Volume2, VolumeX } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  type: 'flame' | 'smoke' | 'spark' | 'ring' | 'shockwave';
  radius?: number;
  maxRadius?: number;
}

interface CrashNotice {
  x: number;
  y: number;
  text: string;
  alpha: number;
  scale: number;
  color: string;
}

interface RocketData {
  id: number;
  name: string;
  callsign: string;
  accentColor: string;
  finColor: string;
  trailColor: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number; // in radians
  angularVelocity: number;
  targetAngle: number;
  speed: number;
  baseSpeed: number;
  maxSpeed: number;
  radius: number; // collision radius
  state: 'flying' | 'crashed' | 'recovering';
  crashCooldown: number; // frames to stay tumbling
  invincibleTimer: number; // prevent re-colliding immediately
  turnTimer: number;
  wobblePhase: number;
}

const ROCKET_CONFIGS = [
  {
    name: 'Apollo',
    callsign: 'AP-01',
    accentColor: '#2563eb', // Sapphire Blue
    finColor: '#1d4ed8',
    trailColor: '#60a5fa',
  },
  {
    name: 'Falcon',
    callsign: 'FC-02',
    accentColor: '#059669', // Emerald Green
    finColor: '#047857',
    trailColor: '#34d399',
  },
  {
    name: 'Saturn',
    callsign: 'ST-03',
    accentColor: '#dc2626', // Crimson Red
    finColor: '#b91c1c',
    trailColor: '#f87171',
  },
  {
    name: 'Nova',
    callsign: 'NV-04',
    accentColor: '#d97706', // Tuscan Amber
    finColor: '#b45309',
    trailColor: '#fbbf24',
  },
  {
    name: 'Cosmos',
    callsign: 'CS-05',
    accentColor: '#7c3aed', // Royal Violet
    finColor: '#6d28d9',
    trailColor: '#a78bfa',
  },
];

interface CleanProRocketsProps {
  maxRockets?: number;
  interactive?: boolean;
}

export const CleanProRockets: React.FC<CleanProRocketsProps> = ({
  maxRockets = 5,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeCount, setActiveCount] = useState<number>(Math.min(5, Math.max(1, maxRockets)));
  const [crashCount, setCrashCount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);

  // References for mutable animation loop data
  const rocketsRef = useRef<RocketData[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const crashNoticesRef = useRef<CrashNotice[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play synthetic Web Audio chime / thud when crashing
  const playCrashSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      // Pitch drop for bounce impact
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(280 + Math.random() * 80, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.25);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Ignore audio failure
    }
  };

  // Initialize rockets
  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const initialRockets: RocketData[] = [];
    const count = Math.min(5, activeCount);

    for (let i = 0; i < count; i++) {
      const config = ROCKET_CONFIGS[i % ROCKET_CONFIGS.length];
      // Distribute evenly along screen edges or random sectors
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const distFromCenter = Math.min(width, height) * 0.28 + Math.random() * 60;
      const cx = width / 2;
      const cy = height / 2;

      const x = Math.max(80, Math.min(width - 80, cx + Math.cos(angle) * distFromCenter));
      const y = Math.max(80, Math.min(height - 80, cy + Math.sin(angle) * distFromCenter));

      // Velocity facing perpendicular or tangent for nice swirling start
      const flyAngle = angle + Math.PI / 2 + (Math.random() - 0.5) * 0.5;
      const speed = 3.5 + Math.random() * 1.5;

      initialRockets.push({
        id: i,
        name: config.name,
        callsign: config.callsign,
        accentColor: config.accentColor,
        finColor: config.finColor,
        trailColor: config.trailColor,
        x,
        y,
        vx: Math.cos(flyAngle) * speed,
        vy: Math.sin(flyAngle) * speed,
        angle: flyAngle,
        angularVelocity: 0,
        targetAngle: flyAngle,
        speed,
        baseSpeed: speed,
        maxSpeed: 7.5,
        radius: 20, // hit radius
        state: 'flying',
        crashCooldown: 0,
        invincibleTimer: 30, // grace period on start
        turnTimer: Math.floor(Math.random() * 60),
        wobblePhase: Math.random() * Math.PI * 2,
      });
    }

    rocketsRef.current = initialRockets;
  }, [activeCount]);

  // Main Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const crashWords = ['💥 BAM!', '⚡ CLASH!', '💥 CRASH!', '🔥 BOOM!', '💥 OOF!'];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (!isPaused) {
        const rockets = rocketsRef.current;
        const particles = particlesRef.current;
        const notices = crashNoticesRef.current;

        // 1. UPDATE ROCKET PHYSICS & STEERING
        for (let i = 0; i < rockets.length; i++) {
          const r = rockets[i];

          r.wobblePhase += 0.05;
          if (r.invincibleTimer > 0) {
            r.invincibleTimer--;
          }

          if (r.state === 'crashed') {
            // Tumbling and thrown away
            r.crashCooldown--;
            r.angle += r.angularVelocity;
            // High speed thrown away, apply slight air resistance
            r.vx *= 0.965;
            r.vy *= 0.965;
            r.x += r.vx;
            r.y += r.vy;

            // Emit tumbling sparks / smoke
            if (Math.random() < 0.6) {
              particles.push({
                x: r.x + (Math.random() - 0.5) * 10,
                y: r.y + (Math.random() - 0.5) * 10,
                vx: (Math.random() - 0.5) * 2 - r.vx * 0.2,
                vy: (Math.random() - 0.5) * 2 - r.vy * 0.2,
                size: 2.5 + Math.random() * 2.5,
                color: Math.random() > 0.4 ? '#f97316' : '#94a3b8',
                alpha: 0.85,
                decay: 0.035,
                type: 'spark',
              });
            }

            // Recover after crash period
            if (r.crashCooldown <= 0) {
              r.state = 'recovering';
              r.crashCooldown = 25; // recovery burn phase
              // Reignite thruster in current heading or velocity direction
              const moveAngle = Math.atan2(r.vy, r.vx);
              r.targetAngle = moveAngle + (Math.random() - 0.5) * 0.8;
              r.angularVelocity = 0;

              // Burst of restart sparks
              for (let k = 0; k < 12; k++) {
                const sparkAngle = r.angle + Math.PI + (Math.random() - 0.5) * 1.2;
                particles.push({
                  x: r.x - Math.cos(r.angle) * 16,
                  y: r.y - Math.sin(r.angle) * 16,
                  vx: Math.cos(sparkAngle) * (3 + Math.random() * 4),
                  vy: Math.sin(sparkAngle) * (3 + Math.random() * 4),
                  size: 2 + Math.random() * 2,
                  color: '#38bdf8',
                  alpha: 1,
                  decay: 0.04,
                  type: 'spark',
                });
              }
            }
          } else if (r.state === 'recovering') {
            // Re-stabilizing flight computer
            r.crashCooldown--;
            // Smoothly align angle towards targetAngle
            let diff = r.targetAngle - r.angle;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            r.angle += diff * 0.15;

            // Accelerate back up to base speed
            r.speed = Math.min(r.baseSpeed, r.speed + 0.15);
            r.vx = Math.cos(r.angle) * r.speed;
            r.vy = Math.sin(r.angle) * r.speed;
            r.x += r.vx;
            r.y += r.vy;

            // Rocket thrust smoke
            emitExhaust(r, particles);

            if (r.crashCooldown <= 0) {
              r.state = 'flying';
              r.invincibleTimer = 40; // brief immunity so it doesn't instantly re-crash
            }
          } else {
            // Normal Flying State ("flying everywhere")
            r.turnTimer--;
            if (r.turnTimer <= 0) {
              r.turnTimer = 45 + Math.floor(Math.random() * 65);
              // Gently pick new target trajectory wandering everywhere
              const wanderDelta = (Math.random() - 0.5) * 1.5;
              r.targetAngle = r.angle + wanderDelta;
            }

            // Screen boundary steer-in
            const margin = 70;
            if (r.x < margin) {
              r.targetAngle = 0 + (Math.random() - 0.5) * 0.6;
            } else if (r.x > width - margin) {
              r.targetAngle = Math.PI + (Math.random() - 0.5) * 0.6;
            } else if (r.y < margin) {
              r.targetAngle = Math.PI / 2 + (Math.random() - 0.5) * 0.6;
            } else if (r.y > height - margin) {
              r.targetAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
            }

            // Soft steer towards target angle
            let diff = r.targetAngle - r.angle;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            r.angle += diff * 0.055;

            // Add subtle aerodynamic wobble
            const wobble = Math.sin(r.wobblePhase) * 0.03;
            const finalAngle = r.angle + wobble;

            // Update velocity from angle
            r.vx = Math.cos(finalAngle) * r.speed;
            r.vy = Math.sin(finalAngle) * r.speed;

            r.x += r.vx;
            r.y += r.vy;

            // Hard screen wrap / bounce if somehow pushed past boundary
            if (r.x < 20) {
              r.x = 20;
              r.vx = Math.abs(r.vx) * 1.2;
              r.targetAngle = 0;
            } else if (r.x > width - 20) {
              r.x = width - 20;
              r.vx = -Math.abs(r.vx) * 1.2;
              r.targetAngle = Math.PI;
            }
            if (r.y < 20) {
              r.y = 20;
              r.vy = Math.abs(r.vy) * 1.2;
              r.targetAngle = Math.PI / 2;
            } else if (r.y > height - 20) {
              r.y = height - 20;
              r.vy = -Math.abs(r.vy) * 1.2;
              r.targetAngle = -Math.PI / 2;
            }

            // Emit thruster flame & smoke
            emitExhaust(r, particles);
          }
        }

        // 2. COLLISION DETECTION & CRASH RESOLUTION
        // "if rockets crash then after hitting the rockets will thrown away and again the rockets will fly (max: 5 rockets)"
        for (let i = 0; i < rockets.length; i++) {
          for (let j = i + 1; j < rockets.length; j++) {
            const r1 = rockets[i];
            const r2 = rockets[j];

            const dx = r2.x - r1.x;
            const dy = r2.y - r1.y;
            const dist = Math.hypot(dx, dy);
            const minDist = r1.radius + r2.radius;

            // Check if they collide
            if (dist < minDist && r1.invincibleTimer === 0 && r2.invincibleTimer === 0) {
              // Collision confirmed!
              const nx = dx / (dist || 1);
              const ny = dy / (dist || 1);

              // Separate them so they don't overlap
              const overlap = (minDist - dist) * 0.5 + 4;
              r1.x -= nx * overlap;
              r1.y -= ny * overlap;
              r2.x += nx * overlap;
              r2.y += ny * overlap;

              // Violently throw them away in opposite directions with high recoil impulse
              const recoilSpeed1 = 8.5 + Math.random() * 4.5;
              const recoilSpeed2 = 8.5 + Math.random() * 4.5;

              // Direct repulsion along collision normal + perpendicular blast deviation
              const tangentX = -ny;
              const tangentY = nx;
              const spinSign = Math.random() > 0.5 ? 1 : -1;

              r1.vx = -nx * recoilSpeed1 + tangentX * (Math.random() - 0.5) * 4;
              r1.vy = -ny * recoilSpeed1 + tangentY * (Math.random() - 0.5) * 4;
              r2.vx = nx * recoilSpeed2 - tangentX * (Math.random() - 0.5) * 4;
              r2.vy = ny * recoilSpeed2 - tangentY * (Math.random() - 0.5) * 4;

              // Put both rockets into crashed state (thrown away tumbling)
              r1.state = 'crashed';
              r1.crashCooldown = 45 + Math.floor(Math.random() * 20); // ~1 sec tumbling
              r1.angularVelocity = spinSign * (0.28 + Math.random() * 0.18);
              r1.invincibleTimer = 60;

              r2.state = 'crashed';
              r2.crashCooldown = 45 + Math.floor(Math.random() * 20);
              r2.angularVelocity = -spinSign * (0.28 + Math.random() * 0.18);
              r2.invincibleTimer = 60;

              // Spawn Crash Explosion shockwave & sparks at midpoint
              const midX = (r1.x + r2.x) / 2;
              const midY = (r1.y + r2.y) / 2;

              // Shockwave ring
              particles.push({
                x: midX,
                y: midY,
                vx: 0,
                vy: 0,
                size: 2,
                radius: 4,
                maxRadius: 48,
                color: '#38bdf8',
                alpha: 0.9,
                decay: 0.045,
                type: 'shockwave',
              });

              // Fiery spark burst
              const sparkCount = 28 + Math.floor(Math.random() * 10);
              for (let s = 0; s < sparkCount; s++) {
                const sAngle = Math.random() * Math.PI * 2;
                const sSpeed = 2 + Math.random() * 7;
                const colors = ['#f97316', '#ef4444', '#facc15', '#ffffff', '#38bdf8'];
                particles.push({
                  x: midX,
                  y: midY,
                  vx: Math.cos(sAngle) * sSpeed,
                  vy: Math.sin(sAngle) * sSpeed,
                  size: 2 + Math.random() * 3,
                  color: colors[Math.floor(Math.random() * colors.length)],
                  alpha: 1,
                  decay: 0.025 + Math.random() * 0.025,
                  type: 'spark',
                });
              }

              // Smoke puffs from impact
              for (let p = 0; p < 8; p++) {
                const pAngle = Math.random() * Math.PI * 2;
                const pSpeed = 1 + Math.random() * 3;
                particles.push({
                  x: midX,
                  y: midY,
                  vx: Math.cos(pAngle) * pSpeed,
                  vy: Math.sin(pAngle) * pSpeed,
                  size: 6 + Math.random() * 8,
                  color: '#94a3b8',
                  alpha: 0.7,
                  decay: 0.02,
                  type: 'smoke',
                });
              }

              // Crash pop notice
              const word = crashWords[Math.floor(Math.random() * crashWords.length)];
              notices.push({
                x: midX,
                y: midY - 15,
                text: word,
                alpha: 1,
                scale: 1.4,
                color: '#ef4444',
              });

              // Increment crash counter
              setCrashCount((prev) => prev + 1);
              playCrashSound();
            }
          }
        }
      }

      // 3. RENDER PARTICLES (Exhaust trails, sparks, smoke, shockwaves)
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);

        if (p.type === 'shockwave') {
          p.radius = (p.radius || 4) + 2.4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2.5 * p.alpha;
          ctx.stroke();
        } else if (p.type === 'smoke') {
          p.size += 0.35;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else {
          // Flame or Spark
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.type === 'flame' ? 6 : 4;
          ctx.fill();
        }
        ctx.restore();
      }

      // 4. RENDER ROCKETS
      const rockets = rocketsRef.current;
      for (let i = 0; i < rockets.length; i++) {
        drawRocket(ctx, rockets[i]);
      }

      // 5. RENDER CRASH POP NOTICES
      const notices = crashNoticesRef.current;
      for (let i = notices.length - 1; i >= 0; i--) {
        const n = notices[i];
        n.y -= 0.8;
        n.alpha -= 0.025;
        n.scale = Math.max(1, n.scale - 0.015);

        if (n.alpha <= 0) {
          notices.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = n.alpha;
        ctx.translate(n.x, n.y);
        ctx.scale(n.scale, n.scale);

        ctx.font = '900 13px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Text shadow for crisp visibility on light background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(n.text, 0, 1);

        ctx.fillStyle = n.color;
        ctx.fillText(n.text, 0, 0);

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // Global pointerdown listener so canvas doesn't need to block UI controls
    const handleGlobalPointerDown = (e: MouseEvent) => {
      if (!interactive) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        target.closest('button, input, textarea, select, a, [role="button"], [role="tab"], .prevent-rocket-click')
      ) {
        return;
      }

      const clickX = e.clientX;
      const clickY = e.clientY;
      const rockets = rocketsRef.current;
      let clickedRocket: RocketData | null = null;
      let minDist = 48;

      for (let i = 0; i < rockets.length; i++) {
        const r = rockets[i];
        const d = Math.hypot(r.x - clickX, r.y - clickY);
        if (d < minDist) {
          minDist = d;
          clickedRocket = r;
        }
      }

      if (clickedRocket) {
        // Direct rocket tap: Throw it away with a high impulse!
        const pushAngle = Math.atan2(clickedRocket.y - clickY, clickedRocket.x - clickX);
        clickedRocket.vx = Math.cos(pushAngle) * 9;
        clickedRocket.vy = Math.sin(pushAngle) * 9;
        clickedRocket.state = 'crashed';
        clickedRocket.crashCooldown = 40;
        clickedRocket.angularVelocity = (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.2);
        clickedRocket.invincibleTimer = 45;

        // Spawn click starburst
        for (let s = 0; s < 18; s++) {
          const a = (s / 18) * Math.PI * 2;
          particlesRef.current.push({
            x: clickX,
            y: clickY,
            vx: Math.cos(a) * (3 + Math.random() * 4),
            vy: Math.sin(a) * (3 + Math.random() * 4),
            size: 2.5,
            color: clickedRocket.accentColor,
            alpha: 1,
            decay: 0.04,
            type: 'spark',
          });
        }
        playCrashSound();
      } else {
        // Click background: spawn a mini shockwave that gently repels nearby rockets
        particlesRef.current.push({
          x: clickX,
          y: clickY,
          vx: 0,
          vy: 0,
          size: 2,
          radius: 4,
          maxRadius: 42,
          color: '#2563eb',
          alpha: 0.75,
          decay: 0.04,
          type: 'shockwave',
        });

        for (let i = 0; i < rockets.length; i++) {
          const r = rockets[i];
          const dist = Math.hypot(r.x - clickX, r.y - clickY);
          if (dist < 170) {
            const pushAngle = Math.atan2(r.y - clickY, r.x - clickX);
            const force = (170 - dist) / 22;
            r.vx += Math.cos(pushAngle) * force;
            r.vy += Math.sin(pushAngle) * force;
            r.targetAngle = Math.atan2(r.vy, r.vx);
          }
        }
      }
    };

    window.addEventListener('pointerdown', handleGlobalPointerDown);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handleGlobalPointerDown);
    };
  }, [isPaused, soundEnabled, interactive]);

  // Helper: Emit thrust flame and exhaust smoke behind rocket
  const emitExhaust = (r: RocketData, particles: Particle[]) => {
    // Tail nozzle position
    const tailDist = 18;
    const tailX = r.x - Math.cos(r.angle) * tailDist;
    const tailY = r.y - Math.sin(r.angle) * tailDist;

    // Hot Flame core
    const flameSpread = (Math.random() - 0.5) * 0.4;
    const flameAngle = r.angle + Math.PI + flameSpread;
    const flameSpeed = 2.5 + Math.random() * 2.5;

    particles.push({
      x: tailX,
      y: tailY,
      vx: Math.cos(flameAngle) * flameSpeed - r.vx * 0.2,
      vy: Math.sin(flameAngle) * flameSpeed - r.vy * 0.2,
      size: 3.2 + Math.random() * 2,
      color: Math.random() > 0.3 ? '#f97316' : '#facc15',
      alpha: 0.9,
      decay: 0.065,
      type: 'flame',
    });

    // Secondary soft smoke puff (every few frames)
    if (Math.random() < 0.35) {
      particles.push({
        x: tailX + (Math.random() - 0.5) * 4,
        y: tailY + (Math.random() - 0.5) * 4,
        vx: -Math.cos(r.angle) * 0.8 + (Math.random() - 0.5) * 0.8,
        vy: -Math.sin(r.angle) * 0.8 + (Math.random() - 0.5) * 0.8,
        size: 3.5 + Math.random() * 3,
        color: '#cbd5e1',
        alpha: 0.45,
        decay: 0.025,
        type: 'smoke',
      });
    }
  };

  // Helper: Draw detailed rocket on Canvas
  const drawRocket = (ctx: CanvasRenderingContext2D, r: RocketData) => {
    ctx.save();
    ctx.translate(r.x, r.y);
    ctx.rotate(r.angle);

    // Subtle drop shadow for depth over clean light canvas
    ctx.shadowColor = 'rgba(15, 23, 42, 0.15)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;

    // --- Side Wings / Fins ---
    ctx.fillStyle = r.finColor;
    // Left Wing
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    ctx.lineTo(-15, -14);
    ctx.lineTo(-12, -4);
    ctx.closePath();
    ctx.fill();

    // Right Wing
    ctx.beginPath();
    ctx.moveTo(-6, 4);
    ctx.lineTo(-15, 14);
    ctx.lineTo(-12, 4);
    ctx.closePath();
    ctx.fill();

    // --- Rocket Main Body (Fuselage) ---
    // Smooth aerodynamic teardrop/bullet shape
    ctx.beginPath();
    ctx.moveTo(18, 0); // Nose Tip
    ctx.bezierCurveTo(12, -7, -4, -8, -14, -6);
    ctx.lineTo(-14, 6);
    ctx.bezierCurveTo(-4, 8, 12, 7, 18, 0);
    ctx.closePath();

    // Body Fill - Clean Metallic White with gradient
    const bodyGrad = ctx.createLinearGradient(0, -8, 0, 8);
    bodyGrad.addColorStop(0, '#ffffff');
    bodyGrad.addColorStop(0.4, '#f8fafc');
    bodyGrad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // Body border
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.stroke();

    // --- Rocket Nose Cone (Accent colored) ---
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.bezierCurveTo(14, -4.5, 9, -5.5, 6, -6.5);
    ctx.lineTo(6, 6.5);
    ctx.bezierCurveTo(9, 5.5, 14, 4.5, 18, 0);
    ctx.closePath();
    ctx.fillStyle = r.accentColor;
    ctx.fill();

    // --- Cockpit Glass Porthole ---
    ctx.beginPath();
    ctx.arc(1, 0, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = '#0284c7'; // Sky Blue
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Cockpit highlight gleam
    ctx.beginPath();
    ctx.arc(0, -1, 1, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // --- Callsign / Emblem Stripe ---
    ctx.fillStyle = r.accentColor;
    ctx.fillRect(-6, -6, 2, 12);

    // --- Tail Engine Nozzle ---
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(-14, -4);
    ctx.lineTo(-17, -5);
    ctx.lineTo(-17, 5);
    ctx.lineTo(-14, 4);
    ctx.closePath();
    ctx.fill();

    // --- State Indicator Ring if Crashed/Recovering ---
    if (r.state === 'crashed') {
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (r.state === 'recovering') {
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();
  };

  // Trigger mid-air scramble / dogfight (makes all rockets converge towards center to collide!)
  const handleScramble = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    rocketsRef.current.forEach((r) => {
      const angleToCenter = Math.atan2(centerY - r.y, centerX - r.x);
      r.targetAngle = angleToCenter + (Math.random() - 0.5) * 0.3;
      r.angle = r.targetAngle;
      r.speed = 6.5; // speed up into dogfight
      r.vx = Math.cos(r.angle) * r.speed;
      r.vy = Math.sin(r.angle) * r.speed;
      r.invincibleTimer = 0; // ready to crash
      if (r.state === 'crashed') {
        r.state = 'flying';
      }
    });
  };

  return (
    <>
      {/* Fullscreen Interactive Canvas for Flying Rockets */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-10"
      />

      {/* Floating Clean Pro Rockets Command Chip */}
      <div className="fixed bottom-4 left-4 z-20 flex items-center space-x-2">
        {showControls ? (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-white/95 border border-slate-200 shadow-md backdrop-blur-md transition-all text-xs font-medium text-slate-700">
            {/* Rocket Icon & Active Count */}
            <div className="flex items-center space-x-1.5 pr-2 border-r border-slate-200">
              <span className="p-1 rounded-lg bg-blue-50 text-blue-600">
                <Rocket className="w-3.5 h-3.5 animate-pulse" />
              </span>
              <span className="font-bold text-slate-900">
                {activeCount}/5 Rockets
              </span>
            </div>

            {/* Crashes Counter */}
            <div className="hidden sm:flex items-center space-x-1 pr-2 border-r border-slate-200 text-slate-500 font-mono text-[11px]">
              <span>💥</span>
              <span className="font-bold text-slate-800">{crashCount}</span>
              <span className="text-[10px] text-slate-400">crashes</span>
            </div>

            {/* Quick Adjust Count (1 to 5) */}
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setActiveCount(num)}
                  className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                    activeCount === num
                      ? 'bg-blue-600 text-white shadow-xs scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={`Set to ${num} flying rocket${num > 1 ? 's' : ''}`}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Scramble / Collision Button */}
            <button
              type="button"
              onClick={handleScramble}
              className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-semibold transition-all cursor-pointer active:scale-95 ml-1"
              title="Make all rockets fly towards center to collide!"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span className="hidden md:inline">Clash!</span>
            </button>

            {/* Sound FX Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              className={`p-1 rounded-lg border transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-blue-50 border-blue-300 text-blue-600'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
              title={soundEnabled ? 'Crash audio FX enabled' : 'Crash audio FX muted'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Pause / Play */}
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="p-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
              title={isPaused ? 'Resume rocket flight' : 'Pause rockets'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPaused ? '' : 'rotate-180'} transition-transform`} />
            </button>

            {/* Minimize */}
            <button
              type="button"
              onClick={() => setShowControls(false)}
              className="text-slate-400 hover:text-slate-600 text-xs px-1"
              title="Minimize panel"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowControls(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-slate-200 shadow-md backdrop-blur-md text-xs font-bold text-slate-800 hover:bg-slate-50 transition-all cursor-pointer"
            title="Open Rocket Controls"
          >
            <Rocket className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
            <span>{activeCount} Rockets</span>
          </button>
        )}
      </div>
    </>
  );
};
