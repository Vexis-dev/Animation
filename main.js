/* ═══════════════════════════════════════════════════════════════════════════════
   VEXIS 3D CINEMATIC — JavaScript
   GitHub Pages Ready
   ═══════════════════════════════════════════════════════════════════════════════ */

// Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.init(); // Re-init on resize for optimal count
    }
    
    init() {
        this.particles = [];
        const count = window.innerWidth < 768 ? 30 : 60;
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                size: Math.random() * 2 + 1,
                color: this.getRandomColor(),
                alpha: Math.random() * 0.6 + 0.2,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }
    
    getRandomColor() {
        const colors = [
            '#b026ff', // purple
            '#00f3ff', // cyan
            '#ffd700', // gold
            '#ff00ff', // pink
            '#00ff88', // green
            '#ff6600'  // orange
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((p, i) => {
            // Movement
            p.x += p.vx;
            p.y += p.vy;
            p.pulse += 0.02;
            
            // Bounce off edges
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            
            // Pulsing size
            const currentSize = p.size + Math.sin(p.pulse) * 0.5;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, Math.max(0.5, currentSize), 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fill();
            
            // Glow
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = p.color;
            
            // Connections (only for nearby particles, limited for performance)
            if (i % 3 === 0) { // Only check every 3rd particle
                this.drawConnections(p, i);
            }
        });
        
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawConnections(p, index) {
        let connections = 0;
        const maxConnections = 3;
        
        for (let i = index + 1; i < this.particles.length && connections < maxConnections; i++) {
            const other = this.particles[i];
            const dx = p.x - other.x;
            const dy = p.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100) {
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, p.y);
                this.ctx.lineTo(other.x, other.y);
                this.ctx.strokeStyle = p.color;
                this.ctx.globalAlpha = (1 - dist / 100) * 0.15;
                this.ctx.lineWidth = 0.5;
                this.ctx.stroke();
                connections++;
            }
        }
    }
}

// Python Code to Copy
const PYTHON_CODE = `#!/usr/bin/env python3
# ═════════════════════════════════════════════════════════════════════════════════
# VEXIS 3D CINEMATIC — FIXED EDITION v2
# 9Б КЛАСС — ПРАВИЛЬНО!
# ═════════════════════════════════════════════════════════════════════════════════

import os
import sys
import time
import random
import math
from itertools import cycle

# ═════════════════════════════════════════════════════════════════════════════════
# COLORS — FIXED WITH HEAT METHOD
# ═════════════════════════════════════════════════════════════════════════════════
class C:
    RST = '\\033[0m'
    BD = '\\033[1m'
    DM = '\\033[2m'
    
    @staticmethod
    def rgb(r, g, b):
        return f"\\033[38;2;{int(r)};{int(g)};{int(b)}m"
    
    @staticmethod
    def hsv(h, s, v):
        h = h % 360
        c = v * s
        x = c * (1 - abs((h/60) % 2 - 1))
        m = v - c
        
        if h < 60: r, g, b = c, x, 0
        elif h < 120: r, g, b = x, c, 0
        elif h < 180: r, g, b = 0, c, x
        elif h < 240: r, g, b = 0, x, c
        elif h < 300: r, g, b = x, 0, c
        else: r, g, b = c, 0, x
        
        return C.rgb((r+m)*255, (g+m)*255, (b+m)*255)
    
    @staticmethod
    def grad(t, palette):
        t = max(0, min(1, t))
        n = len(palette) - 1
        idx = int(t * n)
        if idx >= n:
            return C.rgb(*palette[-1])
        
        local_t = (t * n) - idx
        c1, c2 = palette[idx], palette[idx+1]
        r = c1[0] + (c2[0]-c1[0]) * local_t
        g = c1[1] + (c2[1]-c1[1]) * local_t
        b = c1[2] + (c2[2]-c1[2]) * local_t
        return C.rgb(r, g, b)
    
    @staticmethod
    def heat(intensity):
        """Black → Red → Yellow → White"""
        i = max(0, min(1, intensity))
        if i < 0.33:
            return C.rgb(i*3*255, 0, 0)
        elif i < 0.66:
            return C.rgb(255, (i-0.33)*3*255, 0)
        else:
            return C.rgb(255, 255, (i-0.66)*3*255)

# ═════════════════════════════════════════════════════════════════════════════════
# TERMINAL
# ═════════════════════════════════════════════════════════════════════════════════
def clear():
    os.system('cls' if os.name == 'nt' else 'clear')

def size():
    try:
        import shutil
        return shutil.get_terminal_size()
    except:
        return os.get_terminal_size()

def move(x, y):
    sys.stdout.write(f"\\033[{int(y)};{int(x)}H")

def hide():
    sys.stdout.write("\\033[?25l")
    sys.stdout.flush()

def show():
    sys.stdout.write("\\033[?25h")
    sys.stdout.flush()

# ═════════════════════════════════════════════════════════════════════════════════
# 3D MATH
# ═════════════════════════════════════════════════════════════════════════════════
class Vec3:
    def __init__(self, x=0, y=0, z=0):
        self.x, self.y, self.z = float(x), float(y), float(z)
    
    def __add__(self, other):
        return Vec3(self.x + other.x, self.y + other.y, self.z + other.z)
    
    def __mul__(self, s):
        return Vec3(self.x * s, self.y * s, self.z * s)
    
    def rotate(self, ax, ay, az):
        # X
        cos_x, sin_x = math.cos(ax), math.sin(ax)
        y = self.y * cos_x - self.z * sin_x
        z = self.y * sin_x + self.z * cos_x
        self.y, self.z = y, z
        
        # Y
        cos_y, sin_y = math.cos(ay), math.sin(ay)
        x = self.x * cos_y - self.z * sin_y
        z = self.x * sin_y + self.z * cos_y
        self.x, self.z = x, z
        
        # Z
        cos_z, sin_z = math.cos(az), math.sin(az)
        x = self.x * cos_z - self.y * sin_z
        y = self.x * sin_z + self.y * cos_z
        self.x, self.y = x, y

class Camera:
    def __init__(self, dist=50):
        self.dist = dist
        self.pos = Vec3(0, 0, -dist)
        self.rot = Vec3(0, 0, 0)
    
    def project(self, p, sw, sh):
        # World to camera
        x = p.x - self.pos.x
        y = p.y - self.pos.y
        z = p.z - self.pos.z
        
        # Rotate
        Vec3(x, y, z).rotate(self.rot.x, self.rot.y, self.rot.z)
        
        if z > 0.1:
            scale = self.dist / z
            sx = int(sw/2 + x * scale * 2)
            sy = int(sh/2 - y * scale)
            return (sx, sy, scale, z)
        return None

# ═════════════════════════════════════════════════════════════════════════════════
# ASCII ART — ПРАВИЛЬНО: VEXIS и 9Б
# ═════════════════════════════════════════════════════════════════════════════════
VEXIS_ART = [
    "██╗   ██╗███████╗██╗  ██╗██╗███████╗",
    "██║   ██║██╔════╝╚██╗██╔╝██║██╔════╝",
    "██║   ██║█████╗   ╚███╔╝ ██║███████╗",
    "╚██╗ ██╔╝██╔══╝   ██╔██╗ ██║╚════██║",
    " ╚████╔╝ ███████╗██╔╝ ██╗██║███████║",
    "  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝"
]

# ПРАВИЛЬНО: 9Б КЛАСС (не 9В, не 33!)
CLASS_9B_ART = [
    "██████╗ ██████╗      ██████╗██╗      █████╗ ███████╗███████╗",
    "╚════██╗╚════██╗    ██╔════╝██║     ██╔══██╗██╔════╝██╔════╝",
    " █████╔╝ █████╔╝    ██║     ██║     ███████║███████╗███████╗",
    " ╚═══██╗ ╚═══██╗    ██║     ██║     ██╔══██║╚════██║╚════██║",
    "██████╔╝██████╔╝    ╚██████╗███████╗██║  ██║███████║███████║",
    "╚═════╝ ╚═════╝      ╚═════╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝"
]

TG_CONTACT = "tg:@Vexis_0"

# ═════════════════════════════════════════════════════════════════════════════════
# PALETTES
# ═════════════════════════════════════════════════════════════════════════════════
VEXIS_FIRE = [(75,0,130), (148,0,211), (255,0,255), (255,0,128), (255,100,0), (255,200,0)]
CLASS_FIRE = [(0,0,255), (0,128,255), (0,255,128), (255,255,0), (255,128,0), (255,0,0)]

# ═════════════════════════════════════════════════════════════════════════════════
# SCENES
# ═════════════════════════════════════════════════════════════════════════════════
def countdown():
    """3 SECOND COUNTDOWN"""
    w, h = size()
    hide()
    
    for num in [3, 2, 1]:
        start = time.time()
        while time.time() - start < 1.0:
            clear()
            t = time.time() - start
            
            # Big number
            nw, nh = w//4, h//3
            cx, cy = w//2, h//2
            color = C.heat(1 - t)  # FIXED: using C.heat now
            
            # Draw block number
            for y in range(nh):
                for x in range(nw):
                    dx = x/nw - 0.5
                    dy = y/nh - 0.5
                    if math.sqrt(dx*dx + dy*dy) < 0.4:
                        move(cx - nw//2 + x, cy - nh//2 + y)
                        sys.stdout.write(f"{color}{C.BD}█{C.RST}")
            
            # Ring
            radius = min(w, h)//3
            for a in range(0, 360, 5):
                rad = math.radians(a)
                x = cx + radius * math.cos(rad)
                y = cy + radius * math.sin(rad) * 0.5
                if a/360 <= t:
                    move(x, y)
                    sys.stdout.write(f"{C.hsv(a, 1, 1)}●{C.RST}")
            
            sys.stdout.flush()
            time.sleep(0.016)
    
    # EXPLOSION
    clear()
    cam = Camera(60)
    particles = []
    
    for _ in range(100):
        angle = random.uniform(0, 2*math.pi)
        elev = random.uniform(-math.pi/2, math.pi/2)
        v = random.uniform(5, 15)
        particles.append({
            'pos': Vec3(0, 0, 0),
            'vel': Vec3(
                v * math.cos(elev) * math.cos(angle),
                v * math.sin(elev),
                v * math.cos(elev) * math.sin(angle)
            ),
            'life': random.uniform(1.5, 2.5),
            'char': random.choice(["█", "▓", "▒", "★", "✦", "🔥"]),
            'color': random.choice([C.rgb(255,255,0), C.rgb(255,100,0), C.rgb(255,0,0)])
        })
    
    start = time.time()
    while time.time() - start < 2.0 and particles:
        # Clear
        for p in particles:
            proj = cam.project(p['pos'], w, h)
            if proj:
                move(proj[0], proj[1])
                sys.stdout.write(" ")
        
        # Update
        new_particles = []
        for p in particles:
            p['pos'] = p['pos'] + p['vel'] * 0.016
            p['vel'].y -= 0.1  # gravity
            p['vel'] = p['vel'] * 0.98
            p['life'] -= 0.016
            
            if p['life'] > 0:
                new_particles.append(p)
                proj = cam.project(p['pos'], w, h)
                if proj:
                    x, y, scale, z = proj
                    if 0 <= x < w and 0 <= y < h:
                        intensity = p['life'] / 2.5
                        move(x, y)
                        sys.stdout.write(f"{p['color']}{C.BD}{p['char']}{C.RST}")
        
        particles = new_particles
        cam.rot.y += 0.05
        sys.stdout.flush()
        time.sleep(0.016)
    
    clear()

def matrix_rain():
    """MATRIX RAIN"""
    w, h = size()
    cam = Camera(80)
    
    drops = []
    for _ in range(150):
        drops.append({
            'x': random.uniform(-w, w*2),
            'y': random.uniform(-50, 0),
            'z': random.uniform(10, 100),
            'speed': random.uniform(0.5, 3),
            'trail': []
        })
    
    chars = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿ0123456789VEXIS"
    start = time.time()
    
    while time.time() - start < 3.0:
        # Clear trails
        for d in drops:
            for t in d['trail'][-5:]:
                proj = cam.project(Vec3(t['x'], t['y'], t['z']), w, h)
                if proj:
                    move(proj[0], proj[1])
                    sys.stdout.write(" ")
        
        # Update
        for d in drops:
            d['y'] += d['speed']
            d['trail'].append({'x': d['x'], 'y': d['y'], 'z': d['z']})
            if len(d['trail']) > 12:
                d['trail'].pop(0)
            
            if d['y'] > 50:
                d['y'] = random.uniform(-30, -10)
                d['trail'] = []
            
            # Draw
            for i, t in enumerate(d['trail']):
                proj = cam.project(Vec3(t['x'], t['y'], t['z']), w, h)
                if proj:
                    x, y, scale, z = proj
                    if 0 <= x < w and 0 <= y < h:
                        intensity = i / len(d['trail'])
                        char = random.choice(chars) if i == len(d['trail'])-1 else "│"
                        color = C.rgb(0, int(255*intensity), 0) if i < len(d['trail'])-1 else C.rgb(255,255,255)
                        move(x, y)
                        sys.stdout.write(f"{color}{C.BD if i==len(d['trail'])-1 else C.DM}{char}{C.RST}")
        
        cam.rot.y = math.sin(time.time() * 0.2) * 0.3
        sys.stdout.flush()
        time.sleep(0.015)
    
    clear()

def vexis_build():
    """VEXIS ASSEMBLY"""
    w, h = size()
    cam = Camera(50)
    
    particles = []
    for yi, line in enumerate(VEXIS_ART):
        for xi, char in enumerate(line):
            if char != " ":
                target = Vec3((xi - len(line)/2) * 1.5, (len(VEXIS_ART)/2 - yi) * 2, 0)
                start = Vec3(random.uniform(-80, 80), random.uniform(-80, 80), random.uniform(-100, -20))
                particles.append({
                    'target': target,
                    'current': start,
                    'char': char,
                    'vel': Vec3(0, 0, 0)
                })
    
    start = time.time()
    while time.time() - start < 4.0:
        clear()
        t = time.time() - start
        cam.rot.y = math.sin(t * 0.3) * 0.4
        
        all_done = True
        
        for i, p in enumerate(particles):
            # Spring to target
            dx = p['target'].x - p['current'].x
            dy = p['target'].y - p['current'].y
            dz = p['target'].z - p['current'].z
            
            if abs(dx) > 0.1 or abs(dy) > 0.1 or abs(dz) > 0.1:
                all_done = False
                p['vel'].x += dx * 0.1
                p['vel'].y += dy * 0.1
                p['vel'].z += dz * 0.1
                p['vel'] = p['vel'] * 0.95
            
            p['current'] = p['current'] + p['vel'] * 0.016
            
            # Render
            proj = cam.project(p['current'], w, h)
            if proj:
                x, y, scale, z = proj
                color = C.grad(i / len(particles), VEXIS_FIRE)
                move(x, y)
                sys.stdout.write(f"{color}{C.BD}{p['char']}{C.RST}")
        
        sys.stdout.flush()
        
        if all_done and t > 2:
            break
        
        time.sleep(0.016)
    
    time.sleep(0.5)
    clear()

def galaxy_fly():
    """FLY THROUGH GALAXY"""
    w, h = size()
    cam = Camera(30)
    
    stars = []
    for _ in range(400):
        angle = random.uniform(0, 2*math.pi)
        dist = random.uniform(10, 100)
        stars.append({
            'angle': angle,
            'dist': dist,
            'y': random.uniform(-50, 50),
            'speed': random.uniform(0.5, 2)
        })
    
    start = time.time()
    while time.time() - start < 3.0:
        clear()
        t = time.time() - start
        cam.pos.z = 20 + t * 15
        
        for s in stars:
            s['dist'] -= s['speed']
            if s['dist'] < 5:
                s['dist'] = 100
                s['angle'] = random.uniform(0, 2*math.pi)
            
            x = s['dist'] * math.cos(s['angle'])
            z = s['dist'] * math.sin(s['angle'])
            y = s['y']
            
            proj = cam.project(Vec3(x, y, z), w, h)
            if proj:
                x, y, scale, z = proj
                intensity = min(1, scale)
                if intensity > 0.1:
                    hue = (s['angle'] / (2*math.pi) * 360 + t * 100) % 360
                    color = C.hsv(hue, 1, intensity)
                    move(x, y)
                    sys.stdout.write(f"{color}{'★' if scale>0.8 else '●' if scale>0.4 else '·'}{C.RST}")
        
        sys.stdout.flush()
        time.sleep(0.016)
    
    clear()

def shockwave():
    """SHOCKWAVE"""
    w, h = size()
    cx, cy = w//2, h//2
    max_r = max(w, h)
    
    for r in range(0, max_r + 20, 4):
        # Draw ring
        for a in range(0, 360, 5):
            rad = math.radians(a)
            x = cx + r * math.cos(rad)
            y = cy + r * math.sin(rad) * 0.5
            if 0 <= x < w and 0 <= y < h:
                intensity = 1 - r/max_r
                move(x, y)
                sys.stdout.write(f"{C.heat(intensity)}{C.BD}█{C.RST}")  # FIXED: using C.heat
        
        # Clear center
        if r > 15:
            for a in range(0, 360, 8):
                rad = math.radians(a)
                x = cx + (r-15) * math.cos(rad)
                y = cy + (r-15) * math.sin(rad) * 0.5
                if 0 <= x < w and 0 <= y < h:
                    move(x, y)
                    sys.stdout.write(" ")
        
        sys.stdout.flush()
        time.sleep(0.003)
    
    clear()

def class_9b_build():
    """9Б КЛАСС BUILD — ПРАВИЛЬНО!"""
    w, h = size()
    
    # Phase 1: Glitch
    glitch_chars = "▓▒░█▄▀■□▪▫▬►◄▲▼◆◇●○◐◑★☆⚡💀👾🔥💎"
    
    for _ in range(25):
        clear()
        for y, line in enumerate(CLASS_9B_ART):
            x_base = (w - len(line)) // 2
            for x, char in enumerate(line):
                if char != " ":
                    gx = x_base + x + random.randint(-3, 3)
                    gy = (h - len(CLASS_9B_ART))//2 + y + random.randint(-2, 2)
                    color = random.choice([C.rgb(255,0,0), C.rgb(0,255,255), C.rgb(255,255,0)])
                    move(gx, gy)
                    sys.stdout.write(f"{color}{random.choice(glitch_chars)}{C.RST}")
        sys.stdout.flush()
        time.sleep(0.025)
    
    # Phase 2: Build with laser
    clear()
    max_width = max(len(l) for l in CLASS_9B_ART)
    
    for target_x in range(max_width + 5):
        clear()
        y_base = (h - len(CLASS_9B_ART)) // 2
        
        for y, line in enumerate(CLASS_9B_ART):
            x_base = (w - len(line)) // 2
            for x, char in enumerate(line):
                if x <= target_x and char != " ":
                    color = C.grad(y / len(CLASS_9B_ART), CLASS_FIRE)
                    move(x_base + x, y_base + y)
                    sys.stdout.write(f"{color}{C.BD}{char}{C.RST}")
            
            # Laser
            laser_x = x_base + min(target_x, len(line))
            for ly in range(h):
                if ly != y_base + y:
                    move(laser_x, ly)
                    sys.stdout.write(f"{C.rgb(255,255,255)}│{C.RST}")
        
        sys.stdout.flush()
        time.sleep(0.015)
    
    # Phase 3: Solid
    clear()
    y_base = (h - len(CLASS_9B_ART)) // 2
    
    for y, line in enumerate(CLASS_9B_ART):
        x_base = (w - len(line)) // 2
        for x, char in enumerate(line):
            if char != " ":
                color = C.grad(y / len(CLASS_9B_ART), CLASS_FIRE)
                # Glow
                move(x_base + x, y_base + y)
                sys.stdout.write(f"{C.DM}{color}▒{C.RST}")
                move(x_base + x, y_base + y)
                sys.stdout.write(f"{C.BD}{color}{char}{C.RST}")
        sys.stdout.flush()
        time.sleep(0.02)
    
    time.sleep(0.5)
    clear()

def torus_spin():
    """SPINNING TORUS"""
    w, h = size()
    cam = Camera(40)
    
    # Torus knot
    points = []
    for i in range(300):
        t = i / 300 * 2 * math.pi
        r = 10 + 4 * math.cos(2*t)
        x = r * math.cos(3*t)
        y = r * math.sin(3*t)
        z = 4 * math.sin(2*t)
        points.append(Vec3(x, y, z))
    
    start = time.time()
    while time.time() - start < 2.5:
        clear()
        t = time.time() - start
        
        cam.rot.x = t * 0.7
        cam.rot.y = t * 0.5
        cam.rot.z = t * 0.3
        
        for i, p in enumerate(points):
            # Rotate
            rp = Vec3(p.x, p.y, p.z)
            rp.rotate(t*2, t*1.5, 0)
            
            proj = cam.project(rp, w, h)
            if proj:
                x, y, scale, z = proj
                hue = (i/len(points)*360 + t*200) % 360
                color = C.hsv(hue, 1, min(1, scale))
                move(x, y)
                sys.stdout.write(f"{color}{'█' if scale>0.7 else '▓' if scale>0.4 else '▒'}{C.RST}")
        
        sys.stdout.flush()
        time.sleep(0.016)
    
    clear()

def fire_frame():
    """FIRE FRAME"""
    w, h = size()
    
    art = CLASS_9B_ART
    y_base = (h - len(art)) // 2
    frame_w = max(len(l) for l in art) + 8
    frame_h = len(art) + 6
    x_base = (w - frame_w) // 2
    
    start = time.time()
    while time.time() - start < 2.0:
        t = time.time() - start
        
        # Clear frame
        for y in range(y_base - 3, y_base + frame_h):
            for x in range(x_base - 4, x_base + frame_w):
                move(x, y)
                sys.stdout.write(" ")
        
        # Fire chars
        fire = ["🔥", "⚡", "✨", "💥", "🌟", "⭐"]
        
        # Frame
        for i in range(frame_w):
            # Top
            c = fire[int((i + t*20) % len(fire))]
            color = C.hsv((i*10 + t*300) % 360, 1, 1)
            move(x_base - 4 + i, y_base - 3)
            sys.stdout.write(f"{color}{c}{C.RST}")
            # Bottom
            c = fire[int((i - t*15) % len(fire))]
            color = C.hsv((i*10 - t*300) % 360, 1, 1)
            move(x_base - 4 + i, y_base + frame_h - 3)
            sys.stdout.write(f"{color}{c}{C.RST}")
        
        for i in range(frame_h):
            # Left
            c = fire[int((i + t*25) % len(fire))]
            color = C.hsv((i*15 + t*300) % 360, 1, 1)
            move(x_base - 4, y_base - 3 + i)
            sys.stdout.write(f"{color}{c}{C.RST}")
            # Right
            c = fire[int((i - t*20) % len(fire))]
            color = C.hsv((i*15 - t*300) % 360, 1, 1)
            move(x_base + frame_w - 5, y_base - 3 + i)
            sys.stdout.write(f"{color}{c}{C.RST}")
        
        # 9Б inside
        for y, line in enumerate(art):
            x_off = (w - len(line)) // 2
            for x, char in enumerate(line):
                if char != " ":
                    color = C.grad((y + t*2)/len(art), CLASS_FIRE)
                    move(x_off + x, y_base + y)
                    sys.stdout.write(f"{C.BD}{color}{char}{C.RST}")
        
        sys.stdout.flush()
        time.sleep(0.03)
    
    clear()

def contact_flip():
    """CONTACT CARD FLIP"""
    w, h = size()
    
    for angle in range(0, 181, 3):
        rad = math.radians(angle)
        scale_x = abs(math.cos(rad))
        
        # Clear
        for y in range(h//2 - 4, h//2 + 4):
            move(0, y)
            sys.stdout.write(" " * w)
        
        if scale_x > 0.05:
            card_w = int((len(TG_CONTACT) + 8) * scale_x)
            card_x = (w - card_w) // 2
            cy = h // 2
            
            hue = angle * 2
            border = "═" * (card_w - 2)
            
            # Top
            move(card_x, cy - 2)
            sys.stdout.write(f"{C.hsv(hue, 1, 1)}╔{border}╗{C.RST}")
            
            # Middle
            visible = int(len(TG_CONTACT) * scale_x)
            if visible > 0:
                text = TG_CONTACT[:visible] if angle < 90 else TG_CONTACT[::-1][:visible]
                pad = (card_w - 2 - visible) // 2
                move(card_x, cy)
                sys.stdout.write(f"{C.hsv(hue, 1, 1)}║{C.RST}")
                sys.stdout.write(" " * pad)
                sys.stdout.write(f"{C.BD}{C.hsv(hue+180, 1, 1)}{text}{C.RST}")
                sys.stdout.write(" " * (card_w - 2 - visible - pad))
                sys.stdout.write(f"{C.hsv(hue, 1, 1)}║{C.RST}")
            
            # Bottom
            move(card_x, cy + 2)
            sys.stdout.write(f"{C.hsv(hue, 1, 1)}╚{border}╝{C.RST}")
        
        sys.stdout.flush()
        time.sleep(0.01)
    
    time.sleep(0.3)
    clear()

def flash_bang():
    """WHITE FLASH"""
    w, h = size()
    
    for _ in range(3):
        for y in range(h):
            move(0, y)
            sys.stdout.write(f"{C.BD}{C.rgb(255,255,255)}{'█' * w}{C.RST}")
        sys.stdout.flush()
        time.sleep(0.04)
        clear()
        time.sleep(0.02)

def endless():
    """ENDLESS FIRE"""
    w, h = size()
    art = CLASS_9B_ART
    y_base = (h - len(art)) // 2
    
    flames = cycle(["🔥", "⚡", "✨", "💫", "⭐", "🌟", "💥", "🎆"])
    
    try:
        while True:
            # 9Б
            for y, line in enumerate(art):
                x_base = (w - len(line)) // 2
                for x, char in enumerate(line):
                    if char != " ":
                        color = C.grad(y/len(art), CLASS_FIRE)
                        move(x_base + x, y_base + y)
                        sys.stdout.write(f"{C.BD}{color}{char}{C.RST}")
            
            # Banner
            f1, f2 = next(flames), next(flames)
            banner = f"{f1} 9Б КЛАСС {f2}"
            pad = "█" * random.randint(4, 12)
            full = f"{pad} {banner} {pad}"
            
            color = C.hsv(random.uniform(0, 60), 1, 1)
            move((w - len(full)*2)//2, y_base + len(art) + 3)
            sys.stdout.write(f"{C.BD}{color}{full}{C.RST}")
            
            sys.stdout.flush()
            time.sleep(0.06)
            
    except KeyboardInterrupt:
        pass

# ═════════════════════════════════════════════════════════════════════════════════
# MAIN
# ═════════════════════════════════════════════════════════════════════════════════
def main():
    try:
        hide()
        
        # SEQUENCE
        countdown()
        matrix_rain()
        vexis_build()
        galaxy_fly()
        shockwave()
        class_9b_build()
        torus_spin()
        fire_frame()
        contact_flip()
        flash_bang()
        
        # ENDLESS
        endless()
        
    except KeyboardInterrupt:
        clear()
        show()
        w = size()[0]
        print(f"\\n{' '*(w//2-10)}{C.BD}{C.rgb(255,0,255)}✦ VEXIS TERMINATED ✦{C.RST}\\n")
    except Exception as e:
        show()
        print(f"\\n{C.BD}{C.rgb(255,0,0)}ERROR: {e}{C.RST}\\n")
        import traceback
        traceback.print_exc()
    finally:
        show()

if __name__ == "__main__":
    main()`;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Start particle system
    new ParticleSystem();
    
    // Setup copy button
    const copyBtn = document.getElementById('copyBtn');
    const notification = document.getElementById('notification');
    
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(PYTHON_CODE);
            showCopySuccess(copyBtn, notification);
        } catch (err) {
            console.error('Clipboard API failed:', err);
            fallbackCopy(PYTHON_CODE);
            showCopySuccess(copyBtn, notification);
        }
    });
    
    // 3D tilt effect for cards
    setupTiltEffect();
    
    // Parallax for hero
    setupParallax();
    
    // Intersection Observer for scroll animations
    setupScrollAnimations();
});

function showCopySuccess(btn, notification) {
    btn.classList.add('copied');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span class="btn-icon">✓</span><span class="btn-text">COPIED!</span>';
    
    notification.classList.add('show');
    
    setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = originalHTML;
        notification.classList.remove('show');
    }, 2500);
}

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }
    
    document.body.removeChild(textArea);
}

function setupTiltEffect() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

function setupParallax() {
    const hero = document.querySelector('.hero-title');
    let ticking = false;
    
    document.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const x = (window.innerWidth / 2 - e.pageX) / 60;
                const y = (window.innerHeight / 2 - e.pageY) / 60;
                hero.style.transform = `translate(${x}px, ${y}px)`;
                ticking = false;
            });
            ticking = true;
        }
    });
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Console easter egg
console.log('%c🫆 VEXIS 3D CINEMATIC', 'font-size: 24px; font-weight: bold; color: #b026ff;');
console.log('%cRun python3 vexis_3d.py in your terminal!', 'font-size: 14px; color: #00f3ff;');
