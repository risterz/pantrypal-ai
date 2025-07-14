# Mathematical Parallax Portfolio - Complete Project Blueprint

## 🎯 Project Overview

This blueprint provides a complete guide to create a cutting-edge parallax portfolio website with Three.js 3D graphics, mathematical visualizations, and modern web design. Perfect for developers, mathematicians, and creative professionals.

### ✨ Key Features
- **3D Graphics**: Three.js particle systems, geometric shapes, mathematical surfaces
- **Mathematical Visualizations**: Fractals, parametric equations, wave functions
- **Parallax Scrolling**: Multi-layer depth-based movement
- **Professional Animations**: GSAP-powered smooth transitions
- **Responsive Design**: Mobile, tablet, desktop optimized
- **Performance Optimized**: 60fps with adaptive quality

## 📁 Project Structure

```
project-name/
├── index.html                          # Main HTML structure
├── styles.css                          # Complete CSS with animations
├── js/
│   ├── three-scene.js                  # Three.js scene management
│   ├── mathematical-functions.js       # Mathematical utilities
│   ├── animations.js                   # GSAP animations
│   └── main.js                         # Main application controller
├── README.md                           # Project documentation
└── .augment/                           # Memory bank (optional)
    ├── memory-index.md
    └── core/
        ├── projectbrief.md
        ├── techContext.md
        ├── systemPatterns.md
        ├── activeContext.md
        └── progress.md
```

## 🛠 Technology Stack

### Core Technologies
- **HTML5**: Semantic markup with modern elements
- **CSS3**: Grid, Flexbox, Custom Properties, Animations
- **JavaScript ES6+**: Classes, modules, async/await
- **WebGL**: Hardware-accelerated 3D graphics

### External Libraries (CDN)
```html
<!-- Three.js for 3D graphics -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- GSAP for animations -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>

<!-- Math.js for mathematical operations -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.11.0/math.min.js"></script>

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

## 🎨 Design System

### Color Palette
```css
:root {
    /* Background Colors */
    --primary-bg: #0a0a0f;        /* Deep space black */
    --secondary-bg: #1a1a2e;      /* Dark navy */
    
    /* Accent Colors */
    --accent-primary: #00d4ff;     /* Cyan */
    --accent-secondary: #ff006e;   /* Magenta */
    --accent-tertiary: #8338ec;    /* Purple */
    
    /* Text Colors */
    --text-primary: #ffffff;       /* White */
    --text-secondary: #b8b8b8;     /* Light gray */
    --text-muted: #666666;         /* Dark gray */
    
    /* Glass Effects */
    --glass-bg: rgba(255, 255, 255, 0.05);
    --glass-border: rgba(255, 255, 255, 0.1);
}
```

### Typography
```css
/* Font Families */
--font-primary: 'Inter', sans-serif;      /* Clean, modern */
--font-mono: 'JetBrains Mono', monospace; /* Code and equations */
```

### Responsive Breakpoints
```css
/* Mobile First Approach */
/* Mobile: Default styles (< 768px) */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1200px) { /* Desktop */ }
```

## 🏗 Implementation Guide

### Step 1: HTML Structure
Create semantic HTML with these key sections:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta tags, title, external libraries -->
</head>
<body>
    <!-- Loading Screen -->
    <div id="loading-screen">
        <div class="mathematical-loader">
            <div class="equation">∫ f(x)dx = ∞</div>
            <div class="progress-bar"></div>
        </div>
    </div>

    <!-- Navigation -->
    <nav class="main-nav">
        <div class="nav-brand">∑ Portfolio</div>
        <ul class="nav-links">
            <li><a href="#hero">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
        <div class="nav-progress"></div>
    </nav>

    <!-- Custom Cursor -->
    <div class="custom-cursor">
        <div class="cursor-dot"></div>
        <div class="cursor-ring"></div>
    </div>

    <!-- Three.js Canvas -->
    <canvas id="three-canvas"></canvas>

    <!-- Main Content Sections -->
    <main class="main-content">
        <section id="hero" class="section hero-section">
            <!-- Hero content with mathematical equations -->
        </section>
        
        <section id="about" class="section about-section">
            <!-- About content with floating shapes -->
        </section>
        
        <section id="skills" class="section skills-section">
            <!-- Skills with animated progress bars -->
        </section>
        
        <section id="projects" class="section projects-section">
            <!-- 3D project cards -->
        </section>
        
        <section id="experience" class="section experience-section">
            <!-- Timeline with parallax elements -->
        </section>
        
        <section id="contact" class="section contact-section">
            <!-- Interactive contact form -->
        </section>
    </main>

    <!-- Footer -->
    <footer class="main-footer">
        <!-- Footer content -->
    </footer>

    <!-- JavaScript Modules -->
    <script src="js/three-scene.js"></script>
    <script src="js/mathematical-functions.js"></script>
    <script src="js/animations.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
```

### Step 2: CSS Foundation
Essential CSS patterns and utilities:

```css
/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
    overflow-x: hidden;
}

body {
    font-family: var(--font-primary);
    background: var(--primary-bg);
    color: var(--text-primary);
    line-height: 1.6;
    overflow-x: hidden;
    cursor: none; /* For custom cursor */
}

/* Glassmorphism Effect */
.glass-effect {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--border-radius);
    backdrop-filter: blur(10px);
}

/* Section Layout */
.section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 8rem 0;
    position: relative;
}

.section-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    width: 100%;
}

/* Animation Utilities */
.fade-in-up {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease-out;
}

.fade-in-up.active {
    opacity: 1;
    transform: translateY(0);
}
```

### Step 3: Three.js Scene Setup
Core Three.js implementation structure:

```javascript
class ThreeScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.canvas = null;
        this.clock = new THREE.Clock();
        
        // Scene objects
        this.particles = null;
        this.geometricShapes = [];
        this.mathematicalSurfaces = [];
        
        this.init();
        this.createParticleSystem();
        this.createGeometricShapes();
        this.animate();
    }
    
    init() {
        // Canvas and renderer setup
        this.canvas = document.getElementById('three-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        
        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        const directionalLight = new THREE.DirectionalLight(0x00d4ff, 1);
        this.scene.add(ambientLight, directionalLight);
    }
    
    createParticleSystem() {
        // 2000+ particles with custom shaders
        const particleCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        // Particle positioning logic
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = (Math.random() - 0.5) * 100;
            positions[i3 + 2] = (Math.random() - 0.5) * 100;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // Custom shader material
        const material = new THREE.ShaderMaterial({
            uniforms: { time: { value: 0 } },
            vertexShader: `
                uniform float time;
                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = 2.0;
                }
            `,
            fragmentShader: `
                void main() {
                    gl_FragColor = vec4(0.0, 0.8, 1.0, 0.8);
                }
            `,
            transparent: true
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const elapsedTime = this.clock.getElapsedTime();
        
        // Update particles
        if (this.particles) {
            this.particles.material.uniforms.time.value = elapsedTime;
            this.particles.rotation.y = elapsedTime * 0.1;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}
```

### Step 4: Mathematical Functions
Essential mathematical implementations:

```javascript
class MathematicalFunctions {
    // Parametric equations
    static parametricSpiral(t, a = 1, b = 0.2) {
        return {
            x: a * t * Math.cos(t),
            y: a * t * Math.sin(t),
            z: b * t
        };
    }
    
    // Mandelbrot set calculation
    static mandelbrotIteration(c, maxIterations = 100) {
        let z = { real: 0, imag: 0 };
        let iterations = 0;
        
        while (iterations < maxIterations && this.complexMagnitudeSquared(z) < 4) {
            z = this.complexAdd(this.complexMultiply(z, z), c);
            iterations++;
        }
        
        return iterations;
    }
    
    // Wave functions
    static sineWave(x, t, amplitude = 1, frequency = 1, phase = 0) {
        return amplitude * Math.sin(frequency * x + phase + t);
    }
    
    // Complex number operations
    static complexAdd(a, b) {
        return { real: a.real + b.real, imag: a.imag + b.imag };
    }
    
    static complexMultiply(a, b) {
        return {
            real: a.real * b.real - a.imag * b.imag,
            imag: a.real * b.imag + a.imag * b.real
        };
    }
}
```

### Step 5: Animation System
GSAP animation controller:

```javascript
class AnimationController {
    constructor() {
        gsap.registerPlugin(ScrollTrigger);
        this.initScrollTriggers();
        this.initLoadingAnimation();
    }
    
    initLoadingAnimation() {
        const tl = gsap.timeline();
        tl.to('.progress-fill', { width: '100%', duration: 3 })
          .to('#loading-screen', { opacity: 0, duration: 0.8 }, '+=0.5');
    }
    
    initScrollTriggers() {
        // Section animations
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.to(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 1,
                y: 0,
                duration: 1
            });
        });
        
        // Skill bars animation
        gsap.utils.toArray('.skill-progress').forEach(bar => {
            const level = bar.parentElement.dataset.level;
            gsap.to(bar, {
                scrollTrigger: {
                    trigger: bar,
                    start: 'top 80%'
                },
                width: `${level}%`,
                duration: 1.5
            });
        });
    }
}
```

### Step 6: Main Application Controller
Application coordination:

```javascript
class PortfolioApp {
    constructor() {
        this.threeScene = null;
        this.animationController = null;
        this.mathFunctions = null;
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }
    
    onDOMReady() {
        try {
            this.threeScene = new ThreeScene();
            this.animationController = new AnimationController();
            this.mathFunctions = new MathematicalFunctions();
            
            this.setupEventListeners();
            this.initCustomCursor();
            
            console.log('✅ Portfolio initialized successfully!');
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.handleError(error);
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('scroll', () => this.onScroll());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }
    
    initCustomCursor() {
        const cursor = document.querySelector('.custom-cursor');
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1
            });
        });
    }
}

// Initialize the application
const portfolioApp = new PortfolioApp();
```

## 🚀 Quick Start Guide

### 1. Setup Project
```bash
mkdir my-parallax-portfolio
cd my-parallax-portfolio
mkdir js
```

### 2. Create Files
Copy the blueprint structure and create all files:
- `index.html` - Main HTML structure
- `styles.css` - Complete CSS styling
- `js/three-scene.js` - Three.js scene management
- `js/mathematical-functions.js` - Mathematical utilities
- `js/animations.js` - GSAP animations
- `js/main.js` - Main application controller

### 3. Customize Content
- Update personal information in HTML
- Modify color scheme in CSS variables
- Add your projects and skills
- Customize mathematical visualizations

### 4. Test and Deploy
```bash
# Local development server
python -m http.server 8000
# or
npx http-server -p 8000

# Open browser to localhost:8000
```

## 📊 Performance Targets

### Loading Performance
- **Initial Load**: < 3 seconds
- **First Contentful Paint**: < 1.5 seconds
- **Time to Interactive**: < 2.5 seconds

### Runtime Performance
- **Frame Rate**: Consistent 60fps
- **Memory Usage**: < 100MB RAM
- **CPU Usage**: Optimized with requestAnimationFrame

### Browser Support
- Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- WebGL required for 3D features
- Graceful fallbacks for unsupported features

## 🎯 Customization Options

### Color Themes
Easily change the entire color scheme by modifying CSS custom properties:

```css
/* Cyberpunk Theme */
:root {
    --primary-bg: #0f0f23;
    --accent-primary: #ff0080;
    --accent-secondary: #00ff80;
    --accent-tertiary: #8000ff;
}

/* Ocean Theme */
:root {
    --primary-bg: #001122;
    --accent-primary: #00aaff;
    --accent-secondary: #0066cc;
    --accent-tertiary: #004499;
}
```

### Mathematical Visualizations
Add custom mathematical functions:

```javascript
// Custom parametric surface
static customSurface(u, v) {
    const x = Math.sin(u) * Math.cos(v);
    const y = Math.sin(u) * Math.sin(v);
    const z = Math.cos(u);
    return { x, y, z };
}

// Custom fractal
static customFractal(c, maxIterations) {
    // Your custom fractal algorithm
    return iterations;
}
```

### Animation Customization
Modify animation timings and effects:

```javascript
// Custom animation timeline
const customTimeline = gsap.timeline();
customTimeline
    .to('.element1', { opacity: 1, duration: 1 })
    .to('.element2', { x: 100, duration: 0.5 }, '-=0.5')
    .to('.element3', { rotation: 360, duration: 1 });
```

## 🔧 Advanced Features

### WebGL Shader Customization
Create custom visual effects:

```glsl
// Custom vertex shader
attribute float size;
uniform float time;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Add wave motion
    mvPosition.y += sin(time + position.x * 0.01) * 2.0;
    
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = size * (300.0 / -mvPosition.z);
}

// Custom fragment shader
uniform vec3 color1;
uniform vec3 color2;
uniform float time;

void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
    
    vec3 color = mix(color1, color2, sin(time) * 0.5 + 0.5);
    gl_FragColor = vec4(color, alpha * 0.8);
}
```

### Performance Optimization
Advanced optimization techniques:

```javascript
// Adaptive quality system
class PerformanceManager {
    constructor() {
        this.targetFPS = 60;
        this.currentFPS = 60;
        this.qualityLevel = 1.0;
    }
    
    updateQuality() {
        if (this.currentFPS < 30) {
            this.qualityLevel = Math.max(0.5, this.qualityLevel - 0.1);
            this.adjustParticleCount();
        } else if (this.currentFPS > 55) {
            this.qualityLevel = Math.min(1.0, this.qualityLevel + 0.05);
        }
    }
    
    adjustParticleCount() {
        const newCount = Math.floor(2000 * this.qualityLevel);
        this.updateParticleSystem(newCount);
    }
}
```

## 📚 Learning Resources

### Mathematical Concepts
- **Parametric Equations**: Understanding 3D surface generation
- **Complex Analysis**: Fractal mathematics and iteration
- **Linear Algebra**: Matrix transformations and 3D rotations
- **Wave Mathematics**: Sine, cosine, and interference patterns

### Technical Skills
- **Three.js**: 3D graphics programming with WebGL
- **GSAP**: Professional animation library
- **WebGL Shaders**: Custom visual effects programming
- **Performance Optimization**: 60fps web applications

### Design Principles
- **Parallax Scrolling**: Creating depth and immersion
- **Glassmorphism**: Modern UI design trends
- **Responsive Design**: Mobile-first development
- **Accessibility**: Inclusive design practices

## 🎉 Success Metrics

### Technical Excellence
- ✅ 60fps performance with 2000+ particles
- ✅ Mathematical accuracy in all visualizations
- ✅ Cross-browser compatibility
- ✅ Mobile optimization

### User Experience
- ✅ Smooth, engaging interactions
- ✅ Professional visual design
- ✅ Accessible and inclusive
- ✅ Fast loading times

### Code Quality
- ✅ Modular, maintainable architecture
- ✅ Comprehensive documentation
- ✅ Error handling and fallbacks
- ✅ Performance monitoring

## 🔄 Integration with Other Projects

### React/Next.js Integration
```jsx
// components/ThreeScene.jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);

    useEffect(() => {
        // Initialize Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Add your Three.js content here
        sceneRef.current = { scene, camera, renderer };

        return () => {
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} className="three-scene" />;
};

export default ThreeScene;
```

### Vue.js Integration
```vue
<!-- components/ThreeScene.vue -->
<template>
    <div ref="threeContainer" class="three-scene"></div>
</template>

<script>
import * as THREE from 'three';

export default {
    name: 'ThreeScene',
    mounted() {
        this.initThreeJS();
    },
    beforeUnmount() {
        this.cleanup();
    },
    methods: {
        initThreeJS() {
            // Three.js initialization
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.$refs.threeContainer.appendChild(this.renderer.domElement);

            this.animate();
        },
        animate() {
            requestAnimationFrame(this.animate);
            this.renderer.render(this.scene, this.camera);
        },
        cleanup() {
            if (this.renderer) {
                this.$refs.threeContainer.removeChild(this.renderer.domElement);
                this.renderer.dispose();
            }
        }
    }
};
</script>
```

### WordPress Theme Integration
```php
<?php
// functions.php
function enqueue_parallax_portfolio_assets() {
    // Enqueue Three.js and dependencies
    wp_enqueue_script('threejs', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', array(), '128', true);
    wp_enqueue_script('gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', array(), '3.12.2', true);
    wp_enqueue_script('scrolltrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', array('gsap'), '3.12.2', true);

    // Enqueue custom scripts
    wp_enqueue_script('portfolio-three-scene', get_template_directory_uri() . '/js/three-scene.js', array('threejs'), '1.0', true);
    wp_enqueue_script('portfolio-animations', get_template_directory_uri() . '/js/animations.js', array('gsap', 'scrolltrigger'), '1.0', true);
    wp_enqueue_script('portfolio-main', get_template_directory_uri() . '/js/main.js', array('portfolio-three-scene', 'portfolio-animations'), '1.0', true);

    // Enqueue styles
    wp_enqueue_style('portfolio-style', get_template_directory_uri() . '/style.css', array(), '1.0');
}
add_action('wp_enqueue_scripts', 'enqueue_parallax_portfolio_assets');

// Custom post type for projects
function create_portfolio_post_type() {
    register_post_type('portfolio_project', array(
        'labels' => array(
            'name' => 'Portfolio Projects',
            'singular_name' => 'Portfolio Project'
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'menu_icon' => 'dashicons-portfolio'
    ));
}
add_action('init', 'create_portfolio_post_type');
?>

<!-- page-portfolio.php -->
<div id="portfolio-hero" class="hero-section">
    <canvas id="three-canvas"></canvas>
    <div class="hero-content">
        <h1><?php echo get_field('hero_title') ?: 'Mathematical Innovation'; ?></h1>
        <p><?php echo get_field('hero_subtitle') ?: 'Through Code'; ?></p>
    </div>
</div>

<div id="portfolio-projects" class="projects-section">
    <?php
    $projects = new WP_Query(array(
        'post_type' => 'portfolio_project',
        'posts_per_page' => 6
    ));

    if ($projects->have_posts()) :
        while ($projects->have_posts()) : $projects->the_post();
    ?>
        <div class="project-card" data-project="<?php echo get_the_ID(); ?>">
            <div class="project-visual">
                <?php the_post_thumbnail(); ?>
            </div>
            <div class="project-content">
                <h3><?php the_title(); ?></h3>
                <p><?php the_excerpt(); ?></p>
                <div class="project-tech">
                    <?php
                    $tech_stack = get_field('tech_stack');
                    if ($tech_stack) :
                        foreach ($tech_stack as $tech) :
                    ?>
                        <span class="tech-tag"><?php echo $tech; ?></span>
                    <?php
                        endforeach;
                    endif;
                    ?>
                </div>
            </div>
        </div>
    <?php
        endwhile;
        wp_reset_postdata();
    endif;
    ?>
</div>
```

### Shopify Theme Integration
```liquid
<!-- sections/parallax-hero.liquid -->
<div id="parallax-hero" class="hero-section">
    <canvas id="three-canvas"></canvas>
    <div class="hero-content">
        <h1>{{ section.settings.hero_title | default: 'Mathematical Innovation' }}</h1>
        <p>{{ section.settings.hero_subtitle | default: 'Through Code' }}</p>
        {% if section.settings.cta_text %}
            <a href="{{ section.settings.cta_link }}" class="cta-button primary">
                {{ section.settings.cta_text }}
            </a>
        {% endif %}
    </div>
</div>

{% schema %}
{
    "name": "Parallax Hero",
    "settings": [
        {
            "type": "text",
            "id": "hero_title",
            "label": "Hero Title",
            "default": "Mathematical Innovation"
        },
        {
            "type": "text",
            "id": "hero_subtitle",
            "label": "Hero Subtitle",
            "default": "Through Code"
        },
        {
            "type": "text",
            "id": "cta_text",
            "label": "CTA Button Text"
        },
        {
            "type": "url",
            "id": "cta_link",
            "label": "CTA Button Link"
        }
    ]
}
{% endschema %}

<!-- assets/parallax-portfolio.js -->
document.addEventListener('DOMContentLoaded', function() {
    if (typeof THREE !== 'undefined') {
        const portfolioApp = new PortfolioApp();
        console.log('Parallax portfolio initialized for Shopify');
    }
});
```

## 🎨 Design System Extensions

### Component Library
```css
/* Button Components */
.btn {
    padding: 1rem 2rem;
    border: none;
    border-radius: var(--border-radius);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition-smooth);
    position: relative;
    overflow: hidden;
}

.btn-primary {
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    color: white;
}

.btn-secondary {
    background: transparent;
    color: var(--accent-primary);
    border: 2px solid var(--accent-primary);
}

.btn-ghost {
    background: var(--glass-bg);
    color: var(--text-primary);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(10px);
}

/* Card Components */
.card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--border-radius);
    padding: 2rem;
    backdrop-filter: blur(10px);
    transition: var(--transition-smooth);
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.2);
}

.card-header {
    margin-bottom: 1.5rem;
}

.card-title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
}

.card-subtitle {
    color: var(--text-secondary);
    font-size: 0.9rem;
}

/* Form Components */
.form-group {
    position: relative;
    margin-bottom: 1.5rem;
}

.form-input {
    width: 100%;
    padding: 1rem;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--border-radius);
    color: var(--text-primary);
    font-size: 1rem;
    transition: var(--transition-smooth);
    backdrop-filter: blur(10px);
}

.form-input:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}

.form-label {
    position: absolute;
    top: 1rem;
    left: 1rem;
    color: var(--text-muted);
    transition: var(--transition-smooth);
    pointer-events: none;
}

.form-input:focus + .form-label,
.form-input:valid + .form-label {
    top: -0.5rem;
    left: 0.5rem;
    font-size: 0.8rem;
    color: var(--accent-primary);
    background: var(--primary-bg);
    padding: 0 0.5rem;
}
```

### Animation Presets
```javascript
// Animation presets for common effects
const AnimationPresets = {
    // Fade animations
    fadeIn: (element, duration = 1) => {
        return gsap.fromTo(element,
            { opacity: 0 },
            { opacity: 1, duration, ease: 'power2.out' }
        );
    },

    fadeInUp: (element, duration = 1, distance = 30) => {
        return gsap.fromTo(element,
            { opacity: 0, y: distance },
            { opacity: 1, y: 0, duration, ease: 'power2.out' }
        );
    },

    // Scale animations
    scaleIn: (element, duration = 0.8) => {
        return gsap.fromTo(element,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration, ease: 'back.out(1.7)' }
        );
    },

    // Stagger animations
    staggerFadeInUp: (elements, stagger = 0.1) => {
        return gsap.fromTo(elements,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger,
                ease: 'power2.out'
            }
        );
    },

    // Mathematical animations
    countUp: (element, target, duration = 2) => {
        return gsap.to(element, {
            innerHTML: target,
            duration,
            ease: 'power2.out',
            snap: { innerHTML: 1 },
            onUpdate: function() {
                element.innerHTML = Math.ceil(this.targets()[0].innerHTML);
            }
        });
    },

    // 3D animations
    rotate3D: (element, x = 0, y = 360, z = 0, duration = 2) => {
        return gsap.to(element, {
            rotationX: x,
            rotationY: y,
            rotationZ: z,
            duration,
            ease: 'power2.inOut'
        });
    }
};

// Usage examples
AnimationPresets.fadeInUp('.hero-title');
AnimationPresets.staggerFadeInUp('.project-card', 0.2);
AnimationPresets.countUp(document.querySelector('.stat-number'), 100);
```

## 🔧 Advanced Customization

### Custom Mathematical Visualizations
```javascript
// Advanced fractal implementations
class AdvancedFractals extends MathematicalFunctions {
    // Burning Ship fractal
    static burningShipIteration(c, maxIterations = 100) {
        let z = { real: 0, imag: 0 };
        let iterations = 0;

        while (iterations < maxIterations && this.complexMagnitudeSquared(z) < 4) {
            // Burning ship transformation: z = (|Re(z)| + i|Im(z)|)^2 + c
            z = {
                real: Math.abs(z.real),
                imag: Math.abs(z.imag)
            };
            z = this.complexAdd(this.complexMultiply(z, z), c);
            iterations++;
        }

        return iterations;
    }

    // Newton fractal
    static newtonFractal(z, maxIterations = 100) {
        // Newton's method for z^3 - 1 = 0
        const roots = [
            { real: 1, imag: 0 },
            { real: -0.5, imag: Math.sqrt(3)/2 },
            { real: -0.5, imag: -Math.sqrt(3)/2 }
        ];

        for (let i = 0; i < maxIterations; i++) {
            // f(z) = z^3 - 1
            // f'(z) = 3z^2
            const z2 = this.complexMultiply(z, z);
            const z3 = this.complexMultiply(z2, z);
            const fz = { real: z3.real - 1, imag: z3.imag };
            const fpz = { real: 3 * z2.real, imag: 3 * z2.imag };

            // Newton iteration: z = z - f(z)/f'(z)
            const ratio = this.complexDivide(fz, fpz);
            z = this.complexSubtract(z, ratio);

            // Check convergence to roots
            for (let j = 0; j < roots.length; j++) {
                const diff = this.complexSubtract(z, roots[j]);
                if (this.complexMagnitude(diff) < 0.001) {
                    return j; // Return root index
                }
            }
        }

        return -1; // No convergence
    }

    // 3D Mandelbulb
    static mandelbulb(x, y, z, power = 8, maxIterations = 100) {
        let px = x, py = y, pz = z;
        let dr = 1.0;
        let r = 0.0;

        for (let i = 0; i < maxIterations; i++) {
            r = Math.sqrt(px*px + py*py + pz*pz);

            if (r > 2) break;

            // Convert to polar coordinates
            const theta = Math.acos(pz / r);
            const phi = Math.atan2(py, px);
            dr = Math.pow(r, power - 1) * power * dr + 1.0;

            // Scale and rotate the point
            const zr = Math.pow(r, power);
            theta *= power;
            phi *= power;

            // Convert back to cartesian coordinates
            px = zr * Math.sin(theta) * Math.cos(phi) + x;
            py = zr * Math.sin(phi) * Math.sin(theta) + y;
            pz = zr * Math.cos(theta) + z;
        }

        return 0.5 * Math.log(r) * r / dr;
    }
}
```

### Performance Optimization Utilities
```javascript
// Advanced performance management
class PerformanceOptimizer {
    constructor() {
        this.frameTime = 16.67; // Target 60fps
        this.adaptiveQuality = true;
        this.performanceLevel = 1.0;
        this.metrics = {
            fps: 60,
            frameTime: 16.67,
            memoryUsage: 0,
            drawCalls: 0
        };
    }

    // Adaptive LOD system
    updateLevelOfDetail(camera, objects) {
        objects.forEach(object => {
            const distance = camera.position.distanceTo(object.position);

            if (distance > 100) {
                // Use low-poly version
                object.geometry = object.userData.lowPoly;
                object.material = object.userData.simpleMaterial;
            } else if (distance > 50) {
                // Use medium-poly version
                object.geometry = object.userData.mediumPoly;
                object.material = object.userData.standardMaterial;
            } else {
                // Use high-poly version
                object.geometry = object.userData.highPoly;
                object.material = object.userData.detailedMaterial;
            }
        });
    }

    // Memory management
    disposeUnusedResources(scene) {
        scene.traverse(object => {
            if (object.userData.lastUsed &&
                Date.now() - object.userData.lastUsed > 30000) { // 30 seconds

                if (object.geometry) {
                    object.geometry.dispose();
                }

                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }

                scene.remove(object);
            }
        });
    }

    // Adaptive particle count
    adjustParticleCount(particleSystem, targetFPS = 60) {
        const currentFPS = this.metrics.fps;

        if (currentFPS < targetFPS * 0.8) {
            // Reduce particle count
            const reduction = Math.max(0.1, (targetFPS - currentFPS) / targetFPS);
            const newCount = Math.floor(particleSystem.geometry.attributes.position.count * (1 - reduction));
            this.updateParticleSystem(particleSystem, newCount);
        } else if (currentFPS > targetFPS * 1.1) {
            // Increase particle count (up to maximum)
            const increase = Math.min(0.1, (currentFPS - targetFPS) / targetFPS);
            const newCount = Math.min(2000, Math.floor(particleSystem.geometry.attributes.position.count * (1 + increase)));
            this.updateParticleSystem(particleSystem, newCount);
        }
    }

    // Frustum culling optimization
    updateFrustumCulling(camera, objects) {
        const frustum = new THREE.Frustum();
        const matrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
        frustum.setFromProjectionMatrix(matrix);

        objects.forEach(object => {
            object.visible = frustum.intersectsObject(object);
        });
    }
}
```

## 📱 Mobile Optimization Guide

### Touch Interactions
```javascript
// Enhanced touch handling
class TouchController {
    constructor() {
        this.touches = new Map();
        this.gestures = {
            pinch: false,
            rotate: false,
            pan: false
        };

        this.initTouchEvents();
    }

    initTouchEvents() {
        document.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false });
    }

    onTouchStart(event) {
        event.preventDefault();

        Array.from(event.changedTouches).forEach(touch => {
            this.touches.set(touch.identifier, {
                x: touch.clientX,
                y: touch.clientY,
                startTime: Date.now()
            });
        });

        if (this.touches.size === 2) {
            this.initPinchGesture();
        }
    }

    onTouchMove(event) {
        event.preventDefault();

        if (this.touches.size === 1) {
            // Single touch - pan
            const touch = event.touches[0];
            const startTouch = this.touches.get(touch.identifier);

            if (startTouch) {
                const deltaX = touch.clientX - startTouch.x;
                const deltaY = touch.clientY - startTouch.y;

                this.handlePan(deltaX, deltaY);
            }
        } else if (this.touches.size === 2) {
            // Two touches - pinch/zoom
            this.handlePinchGesture(event.touches);
        }
    }

    handlePan(deltaX, deltaY) {
        // Update camera or scene based on pan gesture
        if (window.portfolioApp && window.portfolioApp.threeScene) {
            const camera = window.portfolioApp.threeScene.camera;
            camera.position.x += deltaX * 0.01;
            camera.position.y -= deltaY * 0.01;
        }
    }

    handlePinchGesture(touches) {
        const touch1 = touches[0];
        const touch2 = touches[1];

        const distance = Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );

        if (this.lastPinchDistance) {
            const scale = distance / this.lastPinchDistance;
            this.handleZoom(scale);
        }

        this.lastPinchDistance = distance;
    }

    handleZoom(scale) {
        // Update camera zoom based on pinch gesture
        if (window.portfolioApp && window.portfolioApp.threeScene) {
            const camera = window.portfolioApp.threeScene.camera;
            camera.position.z *= (2 - scale); // Invert scale for intuitive zoom
            camera.position.z = Math.max(10, Math.min(100, camera.position.z));
        }
    }
}
```

### Responsive Performance
```css
/* Mobile-specific optimizations */
@media (max-width: 768px) {
    /* Reduce particle count on mobile */
    .three-canvas {
        --particle-count: 500;
    }

    /* Simplify animations */
    .complex-animation {
        animation: simple-fade 1s ease-out;
    }

    /* Optimize images */
    .project-visual {
        background-size: cover;
        background-position: center;
    }

    /* Touch-friendly sizing */
    .interactive-element {
        min-height: 44px;
        min-width: 44px;
    }

    /* Reduce blur effects for performance */
    .glass-effect {
        backdrop-filter: blur(5px);
    }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .three-canvas {
        --pixel-ratio: 1; /* Limit pixel ratio for performance */
    }
}
```

This comprehensive blueprint provides everything needed to create and integrate a professional, cutting-edge parallax portfolio that demonstrates technical expertise through mathematical beauty and interactive 3D experiences across any platform or framework!
