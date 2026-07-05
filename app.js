document.addEventListener('DOMContentLoaded', () => {
    // Navigation & Scrolling
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const sidebar = document.querySelector('.sidebar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    // Function to scroll smoothly to a section
    function scrollToSection(targetSectionId) {
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Close sidebar on mobile after clicking
        if (sidebar && window.innerWidth <= 1024) {
            sidebar.classList.remove('active');
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.dataset.tab;
            scrollToSection(sectionId);
        });
    });

    // ScrollSpy: highlight nav item on scroll
    function scrollSpy() {
        let currentSectionId = '';
        
        // Check if we are at the very bottom of the page
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100) {
            currentSectionId = sections[sections.length - 1].getAttribute('id');
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 150) {
                    currentSectionId = section.getAttribute('id');
                }
            });
        }

        if (currentSectionId) {
            navItems.forEach(item => {
                if (item.dataset.tab === currentSectionId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    }

    window.addEventListener('scroll', scrollSpy);
    // Trigger scrollSpy once on load to highlight current section
    scrollSpy();

    // Intersection Observer for scroll-fade animations
    const fadeObserverOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // trigger animation only once
            }
        });
    }, fadeObserverOptions);

    sections.forEach(section => {
        if ('IntersectionObserver' in window) {
            fadeObserver.observe(section);
        } else {
            section.classList.add('visible');
        }
    });

    // Mobile Hamburger Menu Trigger
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Close Sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });

    // Close Top Banner
    const banner = document.getElementById('justiceBanner');
    const closeBannerBtn = document.getElementById('closeBannerBtn');
    if (closeBannerBtn && banner) {
        closeBannerBtn.addEventListener('click', () => {
            banner.style.display = 'none';
        });
    }

    // Connect Section Bottom Navigation Links to Scroll to Sections
    const quickLinks = document.querySelectorAll('[data-goto]');
    quickLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = link.dataset.goto;
            scrollToSection(targetTab);
        });
    });

    // Animated Typing Effect for Passion & Hobbies
    const typedTextSpan = document.querySelector(".typed-text");
    const phrases = [
        "Web Developer",
        "Problem Solver",
        "ICT Engineer",
        "Tech Learner",
        "Photography Fanatic",
        "Avid Traveler"
    ];
    const typingSpeed = 100;
    const erasingSpeed = 60;
    const newPhraseDelay = 2000;
    let phraseIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < phrases[phraseIndex].length) {
            if (typedTextSpan) {
                typedTextSpan.textContent += phrases[phraseIndex].charAt(charIndex);
            }
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newPhraseDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if (typedTextSpan) {
                typedTextSpan.textContent = phrases[phraseIndex].substring(0, charIndex - 1);
            }
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            phraseIndex++;
            if (phraseIndex >= phrases.length) phraseIndex = 0;
            setTimeout(type, typingSpeed + 500);
        }
    }

    if (phrases.length && typedTextSpan) {
        setTimeout(type, newPhraseDelay);
    }

    // Copy to Clipboard and Toast Notification
    const copyButtons = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');

    function showToast(message) {
        if (toast && toastText) {
            toastText.textContent = message;
            toast.classList.add('active');
            setTimeout(() => {
                toast.classList.remove('active');
            }, 3000);
        }
    }

    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.dataset.copy;
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(`Copied: ${textToCopy}`);
                // Simple hover effect tweak
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-check';
                    icon.style.color = '#00d26a';
                    setTimeout(() => {
                        icon.className = 'far fa-copy';
                        icon.style.color = '';
                    }, 2000);
                }
            }).catch(err => {
                showToast("Failed to copy text");
            });
        });
    });

    // Gallery Lightbox Functionality
    const galleryCards = document.querySelectorAll('.gallery-card');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    let currentImageIndex = 0;
    const galleryItems = [];

    // Parse gallery items
    galleryCards.forEach((card, index) => {
        const title = card.dataset.title;
        // Determine source: can be an img tag inside or an svg container description
        const img = card.querySelector('img');
        const imgSrc = img ? img.src : '';
        const isSvg = card.classList.contains('gallery-card-svg');

        galleryItems.push({
            title: title,
            src: imgSrc,
            isSvg: isSvg,
            cardElement: card
        });

        card.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        const item = galleryItems[index];
        if (!item || !lightbox) return;

        if (item.isSvg) {
            // Draw a high-fidelity inline visual inside the lightbox if it's a fallback SVG
            // We can just extract the innerHTML of the SVG and render it
            const svgMarkup = item.cardElement.querySelector('svg').outerHTML;
            lightboxImg.style.display = 'none';
            
            // Render a custom preview area for svg details
            let previewArea = lightbox.querySelector('.lightbox-svg-preview');
            if (!previewArea) {
                previewArea = document.createElement('div');
                previewArea.className = 'lightbox-svg-preview';
                previewArea.style.width = '300px';
                previewArea.style.height = '300px';
                previewArea.style.margin = '20px auto';
                previewArea.style.color = '#00d26a';
                lightboxImg.parentNode.insertBefore(previewArea, lightboxImg);
            }
            previewArea.innerHTML = svgMarkup;
            previewArea.style.display = 'block';
        } else {
            // Standard image display
            const previewArea = lightbox.querySelector('.lightbox-svg-preview');
            if (previewArea) previewArea.style.display = 'none';
            
            lightboxImg.src = item.src;
            lightboxImg.style.display = 'block';
        }

        if (lightboxTitle) lightboxTitle.textContent = item.title;
        lightbox.classList.add('active');
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex--;
            if (currentImageIndex < 0) currentImageIndex = galleryItems.length - 1;
            openLightbox(currentImageIndex);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex++;
            if (currentImageIndex >= galleryItems.length) currentImageIndex = 0;
            openLightbox(currentImageIndex);
        });
    }

    // Keyboard navigation for Lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
        } else if (e.key === 'ArrowLeft' && lightboxPrev) {
            lightboxPrev.click();
        } else if (e.key === 'ArrowRight' && lightboxNext) {
            lightboxNext.click();
        }
    });

    // Form Submission Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple mockup validation
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                showToast("Please fill in all fields.");
                return;
            }
            
            // Mock server response
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            setTimeout(() => {
                showToast("Message sent successfully! I will contact you back soon.");
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1800);
        });
    }
});
