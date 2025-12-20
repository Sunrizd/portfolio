import { renderTemplate } from './template.js';
import { initParticles } from './particles.js';

// State
// State
// let currentLang = 'fr'; // Removed
const localeCache = {};
let globalConfig = null;

// DOM Elements
const app = document.getElementById('app');

// Fetch Config
async function loadConfig() {
    // Always fetch fresh config (dev mode / admin updates)
    try {
        const response = await fetch(`/config.json?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to load config');
        globalConfig = await response.json();
        return globalConfig;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// SEO Functions
async function loadSeo() {
    try {
        const response = await fetch(`/seo.json?t=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to load SEO config');
        return await response.json();
    } catch (error) {
        console.error("SEO config not found", error);
        return null;
    }
}

// Update SEO
function updateSeo(seoData) {
    if (!seoData) return;
    
    // Title fallback: SEO title OR Config name OR Document Title
    document.title = seoData.title || (globalConfig ? globalConfig.name : document.title);
    
    // Helper to set or create meta tags
    const setMeta = (attrName, nameValue, content) => {
        if (!content) return;
        let element = document.querySelector(`meta[${attrName}="${nameValue}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attrName, nameValue);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    // Standard Meta
    setMeta('name', 'description', seoData.description);
    setMeta('name', 'keywords', seoData.keywords ? seoData.keywords.join(', ') : '');

    // Facebook / Open Graph
    setMeta('property', 'og:title', seoData.title);
    setMeta('property', 'og:description', seoData.description);
    setMeta('property', 'og:type', 'website');
    // Use configured image or default
    if (seoData.image) setMeta('property', 'og:image', seoData.image);

    // Twitter
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', seoData.title);
    setMeta('name', 'twitter:description', seoData.description);
    if (seoData.image) setMeta('name', 'twitter:image', seoData.image);
}

// Render Function
async function render() {
    try {
        const [config, seo] = await Promise.all([
            loadConfig(),
            loadSeo()
        ]);

        if (!config) {
            throw new Error('Data missing');
        }
        
        // Use text from config
        const t = config.text;

        // Apply SEO
        updateSeo(seo);
    
        // Inject Content
        // Force Unregister SW incase of strict caching
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for(let registration of registrations) {
                    registration.unregister();
                }
            });
        }
        app.innerHTML = renderTemplate(t, config); 
        
        // Update HTML lang attribute
        document.documentElement.lang = 'fr';

        // Attach Event Listeners
        attachListeners();

        // Init Particles
        initParticles();

    } catch (error) {
        console.error(error);
        app.innerHTML = '<div class="error">Error loading content. Check console.</div>';
    }
}

function attachListeners() {
    const glitchText = document.querySelector('.glitch');
    if (glitchText) {
        const text = glitchText.getAttribute('data-text');
        let index = 0;
        glitchText.textContent = '';
        
        function typeWriter() {
            if (index < text.length) {
                glitchText.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 150);
            }
        }
        setTimeout(typeWriter, 500);
    }

    // Scroll to Top Logic
    const scrollBtn = document.getElementById('scroll-to-top');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return; // Ignore empty anchors like lang toggle

            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                
                // Close mobile menu
                const navLinks = document.querySelector('.nav-links');
                if (navLinks) navLinks.classList.remove('active');
            }
        });
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
}

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    render();
});


