// Navbar Animation Script
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const indicator = document.querySelector('.active-section-indicator');
    const navbarPill = document.querySelector('.navbar-pill');
    let isAnimating = false;
    let animationFrameId = null;

    // Easing function for smooth animation
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - 4 * (1 - t) * (1 - t) * (1 - t);

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (isAnimating) return;
            isAnimating = true;
            
            const section = this.dataset.section;
            const link = this.querySelector('a');
            const href = link.getAttribute('href');
            const sectionText = section.charAt(0).toUpperCase() + section.slice(1);
            
            // Get navbar center position
            const navbarRect = navbarPill.getBoundingClientRect();
            const navbarCenterTop = navbarRect.top + window.scrollY + navbarRect.height / 2;
            const navbarCenterLeft = navbarRect.left + window.scrollX + navbarRect.width / 2;
            
            // Get target section
            const targetSection = document.querySelector(href);
            if (!targetSection) {
                isAnimating = false;
                return;
            }
            
            const targetTop = targetSection.offsetTop + 50;
            const centerLeft = window.innerWidth / 2;
            
            // Set initial indicator position
            indicator.textContent = sectionText;
            indicator.style.left = navbarCenterLeft + 'px';
            indicator.style.top = navbarCenterTop + 'px';
            
            // Start animations
            indicator.classList.remove('active');
            void indicator.offsetWidth; // Trigger reflow
            
            indicator.classList.add('active');
            
            // Smooth position animation using requestAnimationFrame
            let startTime = null;
            const animationDuration = 900;
            
            const animatePosition = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);
                
                const easeProgress = easeInOutCubic(progress);
                
                const currentTop = navbarCenterTop + (targetTop - navbarCenterTop) * easeProgress;
                const currentLeft = navbarCenterLeft + (centerLeft - navbarCenterLeft) * easeProgress;
                
                indicator.style.top = currentTop + 'px';
                indicator.style.left = currentLeft + 'px';
                
                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(animatePosition);
                }
            };
            
            animationFrameId = requestAnimationFrame(animatePosition);
            
            // Scroll to section
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
            
            // Hide indicator
            setTimeout(() => {
                indicator.classList.remove('active');
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
                isAnimating = false;
            }, 1500);