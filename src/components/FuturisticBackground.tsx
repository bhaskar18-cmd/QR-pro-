import React, { useEffect, useRef } from 'react';

export type BackgroundTheme = 'liquid-gold' | 'deep-space' | 'cyber-neon' | 'ocean-aurora';

interface FuturisticBackgroundProps {
  theme?: BackgroundTheme;
  interactive?: boolean;
}

export const FuturisticBackground: React.FC<FuturisticBackgroundProps> = ({
  theme = 'liquid-gold',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: -1000, y: -1000, active: false };
    let ripples: { x: number; y: number; radius: number; maxRadius: number; opacity: number }[] = [];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initElements();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.active = false;
    };

    const handleClick = (e: MouseEvent) => {
      if (!interactive) return;
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: Math.min(width, height) * 0.35,
        opacity: 0.8,
      });
    };

    // ==========================================
    // GOLD DUST / MAGMA PARTICLES
    // ==========================================
    class EmberParticle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      baseSpeedY: number;
      wobble: number;
      wobbleSpeed: number;
      opacity: number;
      baseOpacity: number;
      hue: number;
      lightness: number;
      twinkleSpeed: number;
      phase: number;

      constructor(initRandomY = true) {
        this.x = Math.random() * width;
        this.y = initRandomY ? Math.random() * height : height + 10 + Math.random() * 20;
        this.size = Math.random() * 2.5 + 0.8;
        this.baseSpeedY = -(Math.random() * 0.6 + 0.2);
        this.speedY = this.baseSpeedY;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02 + 0.01;
        this.baseOpacity = Math.random() * 0.6 + 0.25;
        this.opacity = this.baseOpacity;
        // Warm gold / amber palette (40-48 deg hue = rich 24k gold, 30 deg = amber)
        this.hue = Math.random() > 0.3 ? Math.random() * 10 + 38 : Math.random() * 8 + 25;
        this.lightness = Math.random() * 25 + 55;
        this.twinkleSpeed = Math.random() * 0.03 + 0.015;
        this.phase = Math.random() * Math.PI * 2;
      }

      update(time: number) {
        this.phase += this.twinkleSpeed;
        this.opacity = this.baseOpacity + Math.sin(this.phase) * 0.25;
        if (this.opacity < 0.1) this.opacity = 0.1;

        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 0.5 + this.speedX;
        this.y += this.speedY;

        // Mouse gravitational repel / swirl
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130;
          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 3;
            this.x += (dx / dist) * force;
            this.y += (dy / dist) * force;
          }
        }

        // Wrap around vertically and horizontally
        if (this.y < -20) {
          this.y = height + 20;
          this.x = Math.random() * width;
        }
        if (this.x < -20) this.x = width + 20;
        else if (this.x > width + 20) this.x = -20;
      }

      draw() {
        if (!ctx) return;
        // Radial glow for molten appearance
        const glowRadius = this.size * 3.5;
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
        grad.addColorStop(0, `hsla(${this.hue}, 95%, ${this.lightness}%, ${this.opacity})`);
        grad.addColorStop(0.35, `hsla(${this.hue}, 90%, 50%, ${this.opacity * 0.5})`);
        grad.addColorStop(1, `hsla(${this.hue}, 90%, 40%, 0)`);

        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // White-hot metallic core
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 250, 220, ${Math.min(1, this.opacity * 1.3)})`;
        ctx.arc(this.x, this.y, this.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ==========================================
    // OBSIDIAN CRYSTALLINE SHARDS
    // ==========================================
    class ObsidianShard {
      x: number;
      y: number;
      size: number;
      rotation: number;
      rotSpeed: number;
      speedX: number;
      speedY: number;
      points: { x: number; y: number }[];
      opacity: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 36 + 18;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.006;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = -Math.random() * 0.15 - 0.05;
        this.opacity = Math.random() * 0.25 + 0.12;

        // Generate irregular faceted polygon
        const sides = Math.floor(Math.random() * 3) + 4; // 4 to 6 sides
        this.points = [];
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2;
          const r = this.size * (0.6 + Math.random() * 0.5);
          this.points.push({
            x: Math.cos(angle) * r,
            y: Math.sin(angle) * r,
          });
        }
      }

      update() {
        this.rotation += this.rotSpeed;
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y < -this.size * 2) {
          this.y = height + this.size * 2;
          this.x = Math.random() * width;
        }
        if (this.x < -this.size * 2) this.x = width + this.size * 2;
        else if (this.x > width + this.size * 2) this.x = -this.size * 2;
      }

      draw() {
        if (!ctx || this.points.length < 3) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();

        // Dark obsidian smoky glass body with gold metallic edge
        ctx.fillStyle = `rgba(12, 11, 15, ${this.opacity * 0.85})`;
        ctx.fill();

        ctx.strokeStyle = `rgba(245, 158, 11, ${this.opacity * 1.5})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Facet reflection line
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        ctx.lineTo(this.points[Math.floor(this.points.length / 2)].x, this.points[Math.floor(this.points.length / 2)].y);
        ctx.strokeStyle = `rgba(251, 191, 36, ${this.opacity * 0.6})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.restore();
      }
    }

    // ==========================================
    // LIQUID GOLD MOLTEN WAVE ENGINE
    // ==========================================
    interface WaveLayer {
      yPercent: number;
      amplitude: number;
      wavelength: number;
      speed: number;
      phase: number;
      colorStart: string;
      colorEnd: string;
      alpha: number;
    }

    const waves: WaveLayer[] = [
      {
        yPercent: 0.82,
        amplitude: 65,
        wavelength: 0.0014,
        speed: 0.0009,
        phase: 0,
        colorStart: 'rgba(217, 119, 6, ',
        colorEnd: 'rgba(245, 158, 11, ',
        alpha: 0.08,
      },
      {
        yPercent: 0.88,
        amplitude: 50,
        wavelength: 0.0022,
        speed: -0.0012,
        phase: 1.5,
        colorStart: 'rgba(245, 158, 11, ',
        colorEnd: 'rgba(251, 191, 36, ',
        alpha: 0.12,
      },
      {
        yPercent: 0.94,
        amplitude: 40,
        wavelength: 0.0018,
        speed: 0.0015,
        phase: 3.2,
        colorStart: 'rgba(180, 83, 9, ',
        colorEnd: 'rgba(217, 119, 6, ',
        alpha: 0.14,
      },
    ];

    const drawMoltenWave = (wave: WaveLayer, time: number) => {
      if (!ctx) return;
      const baseHeight = height * wave.yPercent;
      const currentPhase = wave.phase + time * wave.speed;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height);

      // Start on left edge
      const startY = baseHeight + Math.sin(currentPhase) * wave.amplitude;
      ctx.lineTo(0, startY);

      // Draw smooth wave along width
      const step = 20;
      for (let x = 0; x <= width + step; x += step) {
        const y =
          baseHeight +
          Math.sin(x * wave.wavelength + currentPhase) * wave.amplitude +
          Math.cos(x * wave.wavelength * 0.5 - currentPhase * 0.7) * (wave.amplitude * 0.35);
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();

      // Liquid gold gradient fill
      const grad = ctx.createLinearGradient(0, baseHeight - wave.amplitude, width, height);
      grad.addColorStop(0, `${wave.colorStart}${wave.alpha * 1.5})`);
      grad.addColorStop(0.5, `${wave.colorEnd}${wave.alpha})`);
      grad.addColorStop(1, `rgba(10, 8, 14, 0.95)`);

      ctx.fillStyle = grad;
      ctx.fill();

      // Shimmering golden crest line
      ctx.beginPath();
      for (let x = 0; x <= width + step; x += step) {
        const y =
          baseHeight +
          Math.sin(x * wave.wavelength + currentPhase) * wave.amplitude +
          Math.cos(x * wave.wavelength * 0.5 - currentPhase * 0.7) * (wave.amplitude * 0.35);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(254, 240, 138, ${wave.alpha * 2.2})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.restore();
    };

    // ==========================================
    // GOLDEN CONSTELLATION FILAMENTS
    // ==========================================
    const drawConstellations = (particles: EmberParticle[]) => {
      if (!ctx) return;
      const maxDistance = 110;
      const maxDistSq = maxDistance * maxDistance;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxDistance) * 0.22;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(245, 158, 11, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // ==========================================
    // EXPANDING MOLTEN RIPPLE WAVES
    // ==========================================
    const drawRipples = () => {
      if (!ctx || ripples.length === 0) return;

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 4.5;
        r.opacity *= 0.96;

        if (r.radius > r.maxRadius || r.opacity < 0.01) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(251, 191, 36, ${r.opacity * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(0, r.radius - 12), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(217, 119, 6, ${r.opacity * 0.35})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }
    };

    // ==========================================
    // FLYING COSMIC ROCKET WITH GOLDEN JET EXHAUST
    // ==========================================
    interface RocketExhaustParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      hue: number;
      life: number;
      maxLife: number;
    }

    class CosmicRocket {
      x: number;
      y: number;
      vx: number;
      vy: number;
      angle: number; // heading angle in radians
      speed: number;
      scale: number;
      state: 'flying' | 'waiting';
      waitTimer: number;
      exhaust: RocketExhaustParticle[];
      curvePhase: number;
      curveSpeed: number;
      thrustPulse: number;

      constructor(initInstant = true) {
        this.exhaust = [];
        this.scale = 1.0;
        this.curvePhase = 0;
        this.curveSpeed = 0.015;
        this.thrustPulse = 0;
        this.state = 'flying';
        this.waitTimer = 0;

        if (initInstant) {
          // Immediately visible on load soaring across screen
          this.x = width * 0.15;
          this.y = height * 0.72;
          this.angle = -Math.PI / 3.8; // heading approx 50 degrees upward to the right
          this.speed = 2.5;
          this.vx = Math.cos(this.angle) * this.speed;
          this.vy = Math.sin(this.angle) * this.speed;
        } else {
          this.respawn();
        }
      }

      respawn() {
        this.exhaust = [];
        this.state = 'flying';
        this.waitTimer = 0;
        this.curvePhase = Math.random() * Math.PI * 2;
        this.scale = Math.random() * 0.25 + 0.9; // 0.9x to 1.15x
        this.speed = Math.random() * 0.9 + 2.1;

        // Choose trajectory:
        const mode = Math.random();
        if (mode < 0.45) {
          // Soar from bottom-left to upper-right
          this.x = -80;
          this.y = height * (0.6 + Math.random() * 0.3);
          this.angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.2;
        } else if (mode < 0.75) {
          // Soar across center-left in a sweeping arc to upper-right
          this.x = -80;
          this.y = height * (0.35 + Math.random() * 0.3);
          this.angle = -Math.PI / 5.5 + (Math.random() - 0.5) * 0.15;
        } else {
          // Soar steep ascent from bottom
          this.x = width * (0.15 + Math.random() * 0.35);
          this.y = height + 70;
          this.angle = -Math.PI / 2.7 + (Math.random() - 0.5) * 0.2;
        }

        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
      }

      update(time: number) {
        // Update exhaust trail particles
        for (let i = this.exhaust.length - 1; i >= 0; i--) {
          const p = this.exhaust[i];
          p.x += p.vx;
          p.y += p.vy;
          p.size *= 0.97;
          p.life++;
          p.opacity = (1 - p.life / p.maxLife) * 0.75;
          if (p.life >= p.maxLife || p.opacity <= 0.01) {
            this.exhaust.splice(i, 1);
          }
        }

        if (this.state === 'waiting') {
          this.waitTimer--;
          if (this.waitTimer <= 0) {
            this.respawn();
          }
          return;
        }

        // Flying state dynamics
        this.thrustPulse += 0.22;
        this.curvePhase += this.curveSpeed;

        // Subtle aerodynamic trajectory sway
        const sway = Math.sin(this.curvePhase) * 0.007;
        this.angle += sway;

        // Gentle interactive repulsion/steering when mouse is close
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160 && dist > 10) {
            const steer = (160 - dist) / 160;
            this.x += (dx / dist) * steer * 1.5;
            this.y += (dy / dist) * steer * 1.5;
          }
        }

        // Forward motion
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.x += this.vx;
        this.y += this.vy;

        // Emit exhaust trail particles at engine nozzle
        const nozzleDist = 24 * this.scale;
        const nozzleX = this.x - Math.cos(this.angle) * nozzleDist;
        const nozzleY = this.y - Math.sin(this.angle) * nozzleDist;

        // Add 2-3 glowing magma spark particles per frame
        for (let i = 0; i < 3; i++) {
          const spread = (Math.random() - 0.5) * 0.45;
          const particleAngle = this.angle + Math.PI + spread;
          const particleSpeed = (Math.random() * 2.2 + 1.2) * this.scale;
          this.exhaust.push({
            x: nozzleX + (Math.random() - 0.5) * 4,
            y: nozzleY + (Math.random() - 0.5) * 4,
            vx: Math.cos(particleAngle) * particleSpeed + (Math.random() - 0.5) * 0.4,
            vy: Math.sin(particleAngle) * particleSpeed + (Math.random() - 0.5) * 0.4,
            size: (Math.random() * 5.5 + 3.5) * this.scale,
            opacity: 0.85,
            hue: Math.random() > 0.35 ? 42 : 28, // 42 = pure gold, 28 = volcanic amber
            life: 0,
            maxLife: Math.floor(Math.random() * 22 + 28),
          });
        }

        // Check if rocket has flown past screen boundaries
        if (
          this.x > width + 100 ||
          this.y < -100 ||
          this.x < -100 ||
          this.y > height + 100
        ) {
          this.state = 'waiting';
          this.waitTimer = Math.floor(Math.random() * 90 + 75); // ~1.2 to 2.8 seconds pause before next flight
        }
      }

      draw() {
        if (!ctx) return;

        // 1. Draw Exhaust Trail Particles
        for (const p of this.exhaust) {
          ctx.save();
          const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          pGrad.addColorStop(0, `hsla(${p.hue}, 100%, 75%, ${p.opacity})`);
          pGrad.addColorStop(0.35, `hsla(${p.hue - 8}, 95%, 55%, ${p.opacity * 0.7})`);
          pGrad.addColorStop(1, `hsla(15, 90%, 45%, 0)`);
          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // If waiting between flights, do not draw body
        if (this.state === 'waiting') return;

        ctx.save();
        ctx.translate(this.x, this.y);
        // Rotate so that the rocket's upward nose aligns with velocity vector
        ctx.rotate(this.angle + Math.PI / 2);
        ctx.scale(this.scale, this.scale);

        // ---- THRUSTER FLAME JET ----
        const flamePulse = Math.sin(this.thrustPulse) * 4 + 17;
        const flameWidth = 7 + Math.sin(this.thrustPulse * 1.4) * 1.5;

        // Outer fiery flame
        const flameGrad = ctx.createLinearGradient(0, 14, 0, 14 + flamePulse);
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.2, '#fef08a'); // luminous gold yellow
        flameGrad.addColorStop(0.55, '#f59e0b'); // amber flame
        flameGrad.addColorStop(0.85, '#ea580c'); // volcanic orange
        flameGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');

        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(-flameWidth, 14);
        ctx.quadraticCurveTo(-flameWidth * 0.6, 14 + flamePulse * 0.6, 0, 14 + flamePulse);
        ctx.quadraticCurveTo(flameWidth * 0.6, 14 + flamePulse * 0.6, flameWidth, 14);
        ctx.closePath();
        ctx.fill();

        // Inner white-hot core
        const coreGrad = ctx.createLinearGradient(0, 14, 0, 14 + flamePulse * 0.55);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.6, '#fef08a');
        coreGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.moveTo(-flameWidth * 0.45, 14);
        ctx.quadraticCurveTo(0, 14 + flamePulse * 0.55, flameWidth * 0.45, 14);
        ctx.closePath();
        ctx.fill();

        // ---- THRUSTER NOZZLE ----
        ctx.fillStyle = '#1e1b2e';
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-6, 11);
        ctx.lineTo(-7.5, 15);
        ctx.lineTo(7.5, 15);
        ctx.lineTo(6, 11);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // ---- AERODYNAMIC BOOSTER FINS (LEFT & RIGHT) ----
        // Left Fin
        ctx.beginPath();
        ctx.moveTo(-7, 2);
        ctx.lineTo(-17, 13);
        ctx.lineTo(-13, 16);
        ctx.lineTo(-6, 12);
        ctx.closePath();
        ctx.fillStyle = '#0e1017';
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Right Fin
        ctx.beginPath();
        ctx.moveTo(7, 2);
        ctx.lineTo(17, 13);
        ctx.lineTo(13, 16);
        ctx.lineTo(6, 12);
        ctx.closePath();
        ctx.fillStyle = '#0e1017';
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // ---- MAIN ROCKET FUSELAGE ----
        ctx.beginPath();
        ctx.moveTo(0, -26); // Nose cone tip
        ctx.bezierCurveTo(9, -15, 9, 5, 6, 13); // Right hull curve
        ctx.lineTo(-6, 13); // Bottom hull seam
        ctx.bezierCurveTo(-9, 5, -9, -15, 0, -26); // Left hull curve
        ctx.closePath();

        // Titanium obsidian metallic gradient
        const bodyGrad = ctx.createLinearGradient(-8, 0, 8, 0);
        bodyGrad.addColorStop(0, '#11121a');
        bodyGrad.addColorStop(0.35, '#222536');
        bodyGrad.addColorStop(0.65, '#2d3047');
        bodyGrad.addColorStop(1, '#0c0d14');
        ctx.fillStyle = bodyGrad;
        ctx.fill();

        // 24K Gold Glowing Hull Edge
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.3;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.55)';
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // ---- GOLD NOSE CONE ACCENT ----
        ctx.beginPath();
        ctx.moveTo(0, -26);
        ctx.bezierCurveTo(4, -20, 5, -17, 5, -14);
        ctx.lineTo(-5, -14);
        ctx.bezierCurveTo(-5, -17, -4, -20, 0, -26);
        ctx.closePath();
        const noseGrad = ctx.createLinearGradient(0, -26, 0, -14);
        noseGrad.addColorStop(0, '#fef08a');
        noseGrad.addColorStop(0.5, '#f59e0b');
        noseGrad.addColorStop(1, '#b45309');
        ctx.fillStyle = noseGrad;
        ctx.fill();

        // ---- HULL STRIPES ----
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.65)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(-4, -2);
        ctx.lineTo(-4, 9);
        ctx.moveTo(4, -2);
        ctx.lineTo(4, 9);
        ctx.stroke();

        // ---- COCKPIT PORTHOLE WINDOW ----
        ctx.beginPath();
        ctx.arc(0, -6, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();

        // Glowing Cyan glass porthole
        const windowGrad = ctx.createRadialGradient(-1, -7, 0, 0, -6, 3.5);
        windowGrad.addColorStop(0, '#a5f3fc');
        windowGrad.addColorStop(0.5, '#06b6d4');
        windowGrad.addColorStop(1, '#083344');
        ctx.beginPath();
        ctx.arc(0, -6, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = windowGrad;
        ctx.fill();

        // Specular glint
        ctx.beginPath();
        ctx.arc(-1, -7.5, 1, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Nose beacon light (pulsing)
        const beaconActive = Math.sin(this.thrustPulse * 2.5) > 0.15;
        ctx.beginPath();
        ctx.arc(0, -26, 1.3, 0, Math.PI * 2);
        ctx.fillStyle = beaconActive ? '#ffffff' : '#f59e0b';
        ctx.fill();

        ctx.restore();
      }
    }

    // ==========================================
    // INITIALIZATION & ANIMATION LOOP
    // ==========================================
    let embers: EmberParticle[] = [];
    let shards: ObsidianShard[] = [];
    let rocket: CosmicRocket | null = null;

    const initElements = () => {
      embers = [];
      const emberCount = Math.floor((width * height) / 16000);
      const targetEmbers = Math.max(50, Math.min(100, emberCount));
      for (let i = 0; i < targetEmbers; i++) {
        embers.push(new EmberParticle(true));
      }

      shards = [];
      const shardCount = Math.max(8, Math.min(18, Math.floor(width / 110)));
      for (let i = 0; i < shardCount; i++) {
        shards.push(new ObsidianShard());
      }

      rocket = new CosmicRocket(true);
    };

    initElements();

    let startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;

      // Clear with slight clearRect
      ctx.clearRect(0, 0, width, height);

      // Deep Obsidian base background gradient with warm volcanic magma caustics
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.65,
        width * 0.05,
        width * 0.5,
        height * 0.65,
        width * 0.85
      );
      bgGrad.addColorStop(0, 'rgba(28, 18, 12, 0.45)');
      bgGrad.addColorStop(0.4, 'rgba(15, 12, 18, 0.7)');
      bgGrad.addColorStop(1, 'rgba(7, 7, 10, 0.95)');

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle molten magma glow pools (breathing warmth)
      const breath = Math.sin(elapsed * 0.001) * 0.04 + 0.08;
      const magmaSpots = [
        { x: width * 0.2, y: height * 0.25, r: width * 0.35, color: '245, 158, 11' },
        { x: width * 0.8, y: height * 0.75, r: width * 0.45, color: '217, 119, 6' },
        { x: width * 0.5, y: height * 0.95, r: width * 0.4, color: '180, 83, 9' },
      ];

      magmaSpots.forEach((spot) => {
        const spotGrad = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, spot.r);
        spotGrad.addColorStop(0, `rgba(${spot.color}, ${breath})`);
        spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = spotGrad;
        ctx.fillRect(0, 0, width, height);
      });

      // Mouse subtle radiant halo
      if (mouse.active) {
        const mouseGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 160);
        mouseGrad.addColorStop(0, 'rgba(251, 191, 36, 0.08)');
        mouseGrad.addColorStop(0.5, 'rgba(217, 119, 6, 0.03)');
        mouseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = mouseGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 160, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Obsidian Shards
      shards.forEach((shard) => {
        shard.update();
        shard.draw();
      });

      // Draw undulating Molten Liquid Gold Wave ribbons
      waves.forEach((wave) => {
        drawMoltenWave(wave, elapsed);
      });

      // Draw Golden Constellations
      drawConstellations(embers);

      // Draw Embers & Sparks
      embers.forEach((ember) => {
        ember.update(elapsed);
        ember.draw();
      });

      // Draw Flying Cosmic Rocket & Golden Exhaust Trail
      if (rocket) {
        rocket.update(elapsed);
        rocket.draw();
      }

      // Draw Molten Ripples
      drawRipples();

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, interactive]);

  return (
    <canvas
      ref={canvasRef}
      id="liquid-gold-magma-canvas"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
};
