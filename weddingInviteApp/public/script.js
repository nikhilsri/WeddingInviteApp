// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
    
    // Initialize background music
    initializeBackgroundMusic();
    
    // Initialize countdown timer
    initializeCountdown();
    
    // Initialize draggable music control
    initializeDraggableMusic();
    
    // Initialize RSVP form
    initializeRSVPForm();
    
});

// Background Music Functionality
function initializeBackgroundMusic() {
    const audio = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    const navMusicToggle = document.getElementById('navMusicToggle');
    const musicIcon = document.querySelector('.music-icon');
    const navMusicIcon = document.querySelector('.nav-music-icon');
    const volumeUp = document.getElementById('volumeUp');
    const volumeDown = document.getElementById('volumeDown');
    const volumeDisplay = document.getElementById('volumeDisplay');

    if (!audio || (!musicToggle && !navMusicToggle)) return;
    
    // Set initial volume to 3% and start time
    let currentVolume = 0.03; // 3% volume
    audio.volume = currentVolume;
    audio.currentTime = 8; // Start from 8 seconds
    
    let isPlaying = false;
    let userInteracted = false;
    
    // Update volume display
    function updateVolumeDisplay() {
        const percentage = Math.round(currentVolume * 100);
        volumeDisplay.textContent = `${percentage}%`;
    }
    
    // Initialize volume display
    updateVolumeDisplay();
    
    // Music toggle functionality
    function toggleMusic() {
        console.log('Music toggle clicked');
        if (isPlaying) {
            audio.pause();
            updateMusicButtons(false);
            isPlaying = false;
            console.log('Music paused');
        } else {
            console.log('Attempting to start music...');
            // Ensure audio is loaded
            audio.load();
            audio.currentTime = 8; // Start from 8 seconds
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    updateMusicButtons(true);
                    isPlaying = true;
                    userInteracted = true;
                    console.log('✅ Music started!');
                }).catch(error => {
                    console.error('❌ Music play failed:', error);
                    alert('Unable to play audio. Please check your device settings and try again.');
                });
            }
        }
    }
    
    function updateMusicButtons(playing) {
        const buttons = [musicToggle, navMusicToggle].filter(btn => btn);
        const icons = [musicIcon, navMusicIcon].filter(icon => icon);
        
        buttons.forEach(button => {
            if (playing) {
                button.classList.add('playing');
                button.classList.remove('muted');
            } else {
                button.classList.remove('playing');
                button.classList.add('muted');
            }
        });
        
        icons.forEach(icon => {
            icon.textContent = playing ? '🎵' : '🔇';
        });
    }
    
    // Add click handlers for music buttons
    if (musicToggle) {
        let clickStartTime;
        let clickStartPosition = { x: 0, y: 0 };
        
        musicToggle.addEventListener('mousedown', function(e) {
            clickStartTime = Date.now();
            clickStartPosition = { x: e.clientX, y: e.clientY };
        });
        
        musicToggle.addEventListener('click', function(e) {
            const clickDuration = Date.now() - clickStartTime;
            const distance = Math.sqrt(
                Math.pow(e.clientX - clickStartPosition.x, 2) + 
                Math.pow(e.clientY - clickStartPosition.y, 2)
            );
            
            // Only toggle music if it was a quick click without much movement (not a drag)
            if (clickDuration < 200 && distance < 5) {
                toggleMusic();
            }
        });
    }
    
    // Add click handler for navigation music button
    if (navMusicToggle) {
        navMusicToggle.addEventListener('click', toggleMusic);
    }
    
    // Volume control functionality
    if (volumeUp) {
        volumeUp.addEventListener('click', function(e) {
            e.stopPropagation();
            currentVolume = Math.min(1.0, currentVolume + 0.05); // Increase by 5%
            audio.volume = currentVolume;
            updateVolumeDisplay();
        });
    }
    
    if (volumeDown) {
        volumeDown.addEventListener('click', function(e) {
            e.stopPropagation();
            currentVolume = Math.max(0.0, currentVolume - 0.05); // Decrease by 5%
            audio.volume = currentVolume;
            updateVolumeDisplay();
        });
    }
    
    // Auto-start music immediately when page loads
    function startMusicImmediately() {
        if (isPlaying || userInteracted) return; // Don't start if already playing or user has interacted
        
        audio.currentTime = 8; // Start from 8 seconds
        audio.play().then(() => {
            updateMusicButtons(true);
            isPlaying = true;
            userInteracted = true;
            console.log('Music started automatically!');
        }).catch(error => {
            console.log('Auto-play blocked by browser');
        });
    }
    
    // Fallback for browsers that block auto-play
    function setupUserInteractionFallback() {
        function startMusicAfterInteraction(e) {
            console.log('User interaction detected:', e.type);
            if (!userInteracted && !isPlaying) {
                userInteracted = true;
                console.log('Attempting to start music...');
                
                // Ensure audio is loaded and ready
                audio.load();
                audio.currentTime = 8;
                
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        updateMusicButtons(true);
                        isPlaying = true;
                        console.log('✅ Music started successfully after user interaction!');
                    }).catch(error => {
                        console.error('❌ Audio play failed even after user interaction:', error);
                    });
                }
            }
        }
        
        // Listen for user interactions (more comprehensive for mobile)
        document.addEventListener('click', startMusicAfterInteraction, { once: true });
        document.addEventListener('touchstart', startMusicAfterInteraction, { once: true, passive: false });
        document.addEventListener('touchend', startMusicAfterInteraction, { once: true, passive: false });
        document.addEventListener('scroll', startMusicAfterInteraction, { once: true, passive: false });
        document.addEventListener('keydown', startMusicAfterInteraction, { once: true });
        
        // Mobile-specific events
        document.addEventListener('gesturestart', startMusicAfterInteraction, { once: true });
        document.addEventListener('orientationchange', startMusicAfterInteraction, { once: true });
        
    }
    
    // Detect if we're on mobile with more comprehensive detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                     ('ontouchstart' in window) || 
                     (navigator.maxTouchPoints > 0) ||
                     (window.innerWidth <= 768);
    
    console.log('Device detection:', {
        userAgent: navigator.userAgent,
        isMobile: isMobile,
        touchSupport: 'ontouchstart' in window,
        maxTouchPoints: navigator.maxTouchPoints,
        windowWidth: window.innerWidth
    });
    
    // Always set up user interaction fallback first
    setupUserInteractionFallback();
    
    if (isMobile) {
        // On mobile, try auto-play but expect it to fail
        console.log('📱 Mobile device detected, trying auto-play');
        setTimeout(startMusicImmediately, 100);
    } else {
        // On desktop, try auto-play more aggressively
        console.log('🖥️ Desktop detected, trying auto-play');
        startMusicImmediately();
        setTimeout(startMusicImmediately, 100);
        setTimeout(startMusicImmediately, 500);
        setTimeout(startMusicImmediately, 1000);
    }
    
    // Handle audio events
    audio.addEventListener('ended', function() {
        // Loop is handled by the loop attribute, but just in case
        if (isPlaying) {
            audio.currentTime = 8; // Restart from 8 seconds
            audio.play();
        }
    });
    
    // Also handle the loop event to start from 8 seconds
    audio.addEventListener('timeupdate', function() {
        // If we're near the end and looping is enabled, restart from 8 seconds
        if (audio.loop && audio.currentTime >= audio.duration - 0.5 && isPlaying) {
            audio.currentTime = 8;
        }
    });
    
    audio.addEventListener('error', function(e) {
        console.log('Audio error:', e);
        musicToggle.style.display = 'none'; // Hide button if audio fails to load
    });
}

// Countdown Timer Functionality
function initializeCountdown() {
    // Wedding date: November 2, 2025 at 8:00 PM
    const weddingDate = new Date('2025-11-02T20:00:00').getTime();
    
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        return;
    }
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        // If the wedding has passed
        if (distance < 0) {
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            
            // Optional: Show "Just Married!" message
            const weddingDatetime = document.querySelector('.wedding-datetime');
            if (weddingDatetime) {
                weddingDatetime.innerHTML = '<h3>Just Married! 💕</h3><p>Thank you for celebrating with us</p>';
            }
            return;
        }
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update the display with animation
        updateCountdownDisplay(daysElement, days);
        updateCountdownDisplay(hoursElement, hours);
        updateCountdownDisplay(minutesElement, minutes);
        updateCountdownDisplay(secondsElement, seconds);
    }
    
    function updateCountdownDisplay(element, value) {
        const formattedValue = value.toString().padStart(2, '0');
        
        if (element.textContent !== formattedValue) {
            element.style.transform = 'scale(1.1)';
            element.style.color = '#f4d03f';
            
            setTimeout(() => {
                element.textContent = formattedValue;
                element.style.transform = 'scale(1)';
                element.style.color = '#d4af37';
            }, 150);
        }
    }
    
    // Update countdown immediately
    updateCountdown();
    
    // Update countdown every second
    setInterval(updateCountdown, 1000);
}

// Draggable Music Control Functionality
function initializeDraggableMusic() {
    const musicControl = document.getElementById('musicControl');
    if (!musicControl) return;
    
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    // Mouse events
    musicControl.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    
    // Touch events for mobile
    musicControl.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('touchmove', dragMove, { passive: false });
    document.addEventListener('touchend', dragEnd);
    
    function dragStart(e) {
        if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
        
        if (e.target === musicControl || musicControl.contains(e.target)) {
            isDragging = true;
            musicControl.classList.add('dragging');
        }
    }
    
    function dragMove(e) {
        if (isDragging) {
            e.preventDefault();
            
            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }
            
            xOffset = currentX;
            yOffset = currentY;
            
            // Constrain to viewport with proper boundaries
            const buttonWidth = 50; // music button width
            const buttonHeight = 50; // music button height
            const maxX = window.innerWidth - buttonWidth;
            const maxY = window.innerHeight - buttonHeight;
            
            // Ensure button stays within viewport bounds
            xOffset = Math.max(0, Math.min(xOffset, maxX));
            yOffset = Math.max(0, Math.min(yOffset, maxY));
            
            setTranslate(xOffset, yOffset, musicControl);
        }
    }
    
    function dragEnd(e) {
        if (isDragging) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            musicControl.classList.remove('dragging');
            
            // Save position to localStorage
            localStorage.setItem('musicControlPosition', JSON.stringify({
                x: xOffset,
                y: yOffset
            }));
        }
    }
    
    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }
    
    // Restore saved position
    const savedPosition = localStorage.getItem('musicControlPosition');
    if (savedPosition) {
        const position = JSON.parse(savedPosition);
        xOffset = position.x;
        yOffset = position.y;
        setTranslate(xOffset, yOffset, musicControl);
    }
    
    // Handle window resize to keep button in bounds
    window.addEventListener('resize', function() {
        const buttonWidth = 50;
        const buttonHeight = 50;
        const maxX = window.innerWidth - buttonWidth;
        const maxY = window.innerHeight - buttonHeight;
        
        if (xOffset > maxX) xOffset = maxX;
        if (yOffset > maxY) yOffset = maxY;
        if (xOffset < 0) xOffset = 0;
        if (yOffset < 0) yOffset = 0;
        
        setTranslate(xOffset, yOffset, musicControl);
    });
}

// Navbar scroll behavior
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 100) {
        navbar.classList.add('visible');
    } else {
        navbar.classList.remove('visible');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Photo gallery infinite scroll - now handled by CSS animations
const galleryContainer = document.getElementById('galleryContainer');
if (galleryContainer) {
    // Optional: Add click functionality to pause/resume animation
    const galleryTrack = galleryContainer.querySelector('.gallery-track');
    if (galleryTrack) {
        galleryContainer.addEventListener('click', function() {
            if (galleryTrack.style.animationPlayState === 'paused') {
                galleryTrack.style.animationPlayState = 'running';
            } else {
                galleryTrack.style.animationPlayState = 'paused';
            }
        });
    }
}

// RSVP Form handling
const rsvpForm = document.getElementById('rsvpForm');
const attendanceSelect = document.getElementById('attendance');
const guestCountGroup = document.getElementById('guestCountGroup');

// Show/hide guest count based on attendance selection
attendanceSelect.addEventListener('change', function() {
    if (this.value === 'yes') {
        guestCountGroup.style.display = 'block';
        guestCountGroup.querySelector('select').required = true;
    } else {
        guestCountGroup.style.display = 'none';
        guestCountGroup.querySelector('select').required = false;
    }
});

// Form submission
rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.firstName || !data.lastName || !data.email || !data.attendance) {
        alert('Please fill in all required fields.');
        return;
    }
    
    if (data.attendance === 'yes' && !data.guestCount) {
        alert('Please specify the number of guests.');
        return;
    }
    
    // Simulate form submission
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Show success message
        showSuccessMessage();
        
        // Reset form
        this.reset();
        guestCountGroup.style.display = 'none';
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Log the data (in a real app, this would be sent to a server)
        console.log('RSVP Data:', data);
    }, 2000);
});

// Show success message
function showSuccessMessage() {
    // Remove existing success message if any
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <strong>Thank you!</strong> Your RSVP has been received. We can't wait to celebrate with you!
    `;
    
    // Insert after the form
    rsvpForm.parentNode.insertBefore(successMessage, rsvpForm.nextSibling);
    
    // Show with animation
    setTimeout(() => {
        successMessage.classList.add('show');
    }, 100);
    
    // Hide after 5 seconds
    setTimeout(() => {
        successMessage.classList.remove('show');
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.remove();
            }
        }, 500);
    }, 5000);
}

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
        }
    });
}, observerOptions);

// Observe elements for loading animation
document.querySelectorAll('.detail-card, .photo-card, .timeline').forEach(el => {
    el.classList.add('loading');
    observer.observe(el);
});

// Gallery auto-scroll hint
let galleryScrollHint = true;
if (galleryContainer && galleryScrollHint) {
    setTimeout(() => {
        galleryContainer.scrollLeft += 50;
        setTimeout(() => {
            galleryContainer.scrollLeft -= 50;
        }, 1000);
    }, 3000);
}

// Mobile menu toggle (if needed for smaller screens)
function createMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const navMenu = document.querySelector('.nav-menu');
    
    if (window.innerWidth <= 768) {
        // Add mobile menu functionality here if needed
        // For now, the horizontal scroll menu works well on mobile
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    createMobileMenu();
});

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced form validation
function validateForm(formData) {
    const errors = [];
    
    if (!formData.firstName.trim()) {
        errors.push('First name is required');
    }
    
    if (!formData.lastName.trim()) {
        errors.push('Last name is required');
    }
    
    if (!formData.email.trim()) {
        errors.push('Email is required');
    } else if (!isValidEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!formData.attendance) {
        errors.push('Please let us know if you can attend');
    }
    
    if (formData.attendance === 'yes' && !formData.guestCount) {
        errors.push('Please specify the number of guests');
    }
    
    return errors;
}

// Smooth reveal animations for sections
function revealOnScroll() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY;
        
        if (scrollPosition > sectionTop - windowHeight + 100) {
            section.classList.add('revealed');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createMobileMenu();
    revealOnScroll();
    
    // Add loading class to elements that should animate in
    document.querySelectorAll('.hero-content > *').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });
});

// Preload critical images (placeholder for when real images are added)
function preloadImages() {
    const imageUrls = [
        // Add your actual image URLs here when you have them
        'images/pic1.jpg',
        'images/pic2.jpg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Call preload when page loads
window.addEventListener('load', preloadImages);

// Infinite scroll gallery - automatically scrolls, pauses on hover
// The gallery now uses CSS animations for smooth infinite scrolling

// Add keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    // Navigate sections with arrow keys when not in form fields
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            scrollToNextSection();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            scrollToPrevSection();
        }
    }
});

function scrollToNextSection() {
    const sections = document.querySelectorAll('section');
    const currentScroll = window.scrollY;
    
    for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop > currentScroll + 100) {
            sections[i].scrollIntoView({ behavior: 'smooth' });
            break;
        }
    }
}

function scrollToPrevSection() {
    const sections = document.querySelectorAll('section');
    const currentScroll = window.scrollY;
    
    for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop < currentScroll - 100) {
            sections[i].scrollIntoView({ behavior: 'smooth' });
            break;
        }
    }
}

// RSVP Form Functionality with EmailJS
function initializeRSVPForm() {
    const form = document.getElementById('rsvpForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('rsvpSuccess');
    const errorMessage = document.getElementById('rsvpError');
    const attendanceSelect = document.getElementById('attendance');
    const guestCountGroup = document.getElementById('guestCountGroup');

    if (!form) return;

    // Initialize EmailJS (you'll need to replace with your actual keys)
    emailjs.init({
        publicKey: 'a2l_hppRR8Ydg8q9g', // Replace with your EmailJS public key
    });

    // Show/hide guest count based on attendance
    if (attendanceSelect && guestCountGroup) {
        attendanceSelect.addEventListener('change', function() {
            if (this.value === 'yes') {
                guestCountGroup.style.display = 'block';
                document.getElementById('guestCount').required = true;
            } else if (this.value === 'no') {
                guestCountGroup.style.display = 'none';
                document.getElementById('guestCount').required = false;
            }
        });
    }

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Hide previous messages
        if (successMessage) successMessage.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';

        try {
            // Get form data
            const formData = new FormData(form);
            
            // Prepare template parameters for EmailJS
            const templateParams = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                attendance: formData.get('attendance'),
                guestCount: formData.get('guestCount') || 'Not specified',
                message: formData.get('message') || 'No message provided',
                timestamp: new Date().toLocaleString(),
                fullName: `${formData.get('firstName')} ${formData.get('lastName')}`,
                attendanceText: formData.get('attendance') === 'yes' ? 'Yes, will attend' : 'Cannot attend'
            };

            // Send email using EmailJS
            const response = await emailjs.send(
                'service_1f7iaa6',    // Replace with your EmailJS service ID
                'template_pdimpk1',   // Replace with your EmailJS template ID
                templateParams
            );

            if (response.status === 200) {
                // Success
                form.style.display = 'none';
                if (successMessage) {
                    successMessage.style.display = 'block';
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                // Reset form after delay
                setTimeout(() => {
                    form.reset();
                    form.style.display = 'block';
                    if (successMessage) successMessage.style.display = 'none';
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 5000);
                
            } else {
                throw new Error('Email sending failed');
            }
            
        } catch (error) {
            console.error('RSVP submission error:', error);
            
            // Show error message
            if (errorMessage) {
                errorMessage.style.display = 'block';
                errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Hide error after delay
            setTimeout(() => {
                if (errorMessage) errorMessage.style.display = 'none';
            }, 5000);
        }
    });
}

