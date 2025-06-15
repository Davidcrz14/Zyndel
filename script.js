// Configuración global
const CONFIG = {
    particleCount: 5,
    scrollThreshold: 100,
    animationDuration: 300,
    debounceDelay: 16
};

// Utilidades
const utils = {
    // Debounce function para optimizar eventos
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function para eventos de scroll
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Función para generar números aleatorios
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    // Función para interpolar valores
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
};

// Clase para manejar animaciones de scroll
class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        this.observeElements();
        this.setupParallax();
    }

    observeElements() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // Observar tarjetas de servicio
        document.querySelectorAll('.service-card').forEach(card => {
            observer.observe(card);
        });

        // Observar elementos del hero
        document.querySelectorAll('.hero-title, .browser-mockup').forEach(element => {
            observer.observe(element);
        });
    }

    setupParallax() {
        const parallaxElements = document.querySelectorAll('.browser-mockup, .astronaut-helmet');
        
        const handleScroll = utils.throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate * 0.1}px)`;
            });
        }, CONFIG.debounceDelay);

        window.addEventListener('scroll', handleScroll);
    }
}

// Clase para efectos de partículas
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = document.querySelector('.floating-elements');
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < CONFIG.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Posición inicial aleatoria
            particle.style.left = `${utils.random(0, 100)}%`;
            particle.style.animationDelay = `${utils.random(0, 5)}s`;
            particle.style.animationDuration = `${utils.random(6, 12)}s`;
            
            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    animate() {
        // Las partículas se animan con CSS, pero podemos agregar lógica adicional aquí
        setInterval(() => {
            this.particles.forEach(particle => {
                // Cambiar opacidad aleatoriamente
                if (Math.random() < 0.1) {
                    particle.style.opacity = utils.random(0.3, 0.8);
                }
            });
        }, 2000);
    }
}

// Clase para efectos de texto
class TextEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupTypewriter();
        this.setupTextGlow();
    }

    setupTypewriter() {
        const title = document.querySelector('.gradient-text');
        if (!title) return;

        const text = title.textContent;
        title.textContent = '';
        title.style.opacity = '1';

        let i = 0;
        const typeInterval = setInterval(() => {
            title.textContent += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(typeInterval);
                this.addCursor(title);
            }
        }, 100);
    }

    addCursor(element) {
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '|';
        cursor.style.animation = 'blink 1s infinite';
        element.appendChild(cursor);

        // Remover cursor después de 3 segundos
        setTimeout(() => {
            cursor.remove();
        }, 3000);
    }

    setupTextGlow() {
        const glowElements = document.querySelectorAll('.gradient-text, .service-icon');
        
        glowElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.filter = 'drop-shadow(0 0 20px rgba(255, 71, 87, 0.6))';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.filter = 'none';
            });
        });
    }
}

// Clase para interacciones de UI
class UIInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.setupCardHovers();
        this.setupButtonEffects();
        this.setupBrowserControls();
        this.setupSmoothScrolling();
    }

    setupCardHovers() {
        const cards = document.querySelectorAll('.service-card, .preview-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e);
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    createRippleEffect(e) {
        const card = e.currentTarget;
        const ripple = document.createElement('div');
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,71,87,0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        card.style.position = 'relative';
        card.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    setupButtonEffects() {
        const buttons = document.querySelectorAll('.contact-btn, .action-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createButtonPulse(e);
            });
            
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px) scale(1.05)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    createButtonPulse(e) {
        const button = e.currentTarget;
        const pulse = document.createElement('div');
        
        pulse.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: translate(-50%, -50%);
            animation: pulse 0.6s ease-out;
        `;
        
        button.style.position = 'relative';
        button.appendChild(pulse);
        
        setTimeout(() => pulse.remove(), 600);
    }

    setupBrowserControls() {
        const controls = document.querySelectorAll('.control');
        const actions = document.querySelectorAll('.browser-actions i');
        
        controls.forEach(control => {
            control.addEventListener('click', () => {
                control.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    control.style.transform = 'scale(1.2)';
                }, 100);
                setTimeout(() => {
                    control.style.transform = 'scale(1)';
                }, 200);
            });
        });
        
        actions.forEach(action => {
            action.addEventListener('click', () => {
                action.style.transform = 'rotate(360deg) scale(1.2)';
                setTimeout(() => {
                    action.style.transform = 'rotate(0deg) scale(1)';
                }, 300);
            });
        });
    }

    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Clase para efectos de fondo dinámico
class DynamicBackground {
    constructor() {
        this.init();
    }

    init() {
        this.setupGradientShift();
        this.setupMouseTracker();
    }

    setupGradientShift() {
        const body = document.body;
        let hue = 0;
        
        setInterval(() => {
            hue = (hue + 1) % 360;
            const gradient = `linear-gradient(135deg, 
                hsl(${hue}, 20%, 6%) 0%, 
                hsl(${(hue + 30) % 360}, 25%, 10%) 50%, 
                hsl(${hue}, 20%, 6%) 100%)`;
            body.style.background = gradient;
        }, 100);
    }

    setupMouseTracker() {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-glow';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(255,71,87,0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX - 10}px`;
            cursor.style.top = `${e.clientY - 10}px`;
        });
        
        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'scale(1.5)';
        });
        
        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'scale(1)';
        });
    }
}

// Clase principal de la aplicación
class ZyndelApp {
    constructor() {
        this.init();
    }

    init() {
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        // Inicializar todos los componentes
        this.scrollAnimations = new ScrollAnimations();
        this.particleSystem = new ParticleSystem();
        this.textEffects = new TextEffects();
        this.uiInteractions = new UIInteractions();
        this.dynamicBackground = new DynamicBackground();
        
        // Agregar estilos CSS dinámicos
        this.addDynamicStyles();
        
        // Configurar eventos globales
        this.setupGlobalEvents();
        
        console.log('🚀 Zyndel Studios - Aplicación inicializada correctamente');
    }

    addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            @keyframes pulse {
                to {
                    width: 100px;
                    height: 100px;
                    opacity: 0;
                }
            }
            
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
            
            .animate-in {
                animation: fadeInUp 0.8s ease forwards;
            }
            
            .cursor-glow {
                mix-blend-mode: screen;
            }
            
            .service-card {
                will-change: transform;
            }
            
            .browser-mockup {
                will-change: transform;
            }
        `;
        document.head.appendChild(style);
    }

    setupGlobalEvents() {
        // Manejar cambios de visibilidad de la página
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pausar animaciones cuando la página no es visible
                document.body.style.animationPlayState = 'paused';
            } else {
                // Reanudar animaciones
                document.body.style.animationPlayState = 'running';
            }
        });
        
        // Manejar redimensionamiento de ventana
        window.addEventListener('resize', utils.debounce(() => {
            // Recalcular posiciones si es necesario
            this.particleSystem.particles.forEach(particle => {
                particle.style.left = `${utils.random(0, 100)}%`;
            });
        }, 250));
        
        // Agregar indicador de carga
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
    }
}

// Inicializar la aplicación
const app = new ZyndelApp();

// Exportar para uso global si es necesario
window.ZyndelApp = app;