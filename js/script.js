const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const header = document.querySelector('.site-header');
const year = document.getElementById('year');
const form = document.getElementById('eventForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const categoryInput = document.getElementById('category');
const eventDateInput = document.getElementById('eventDate');
const guestInput = document.getElementById('guests');
const formMessage = document.getElementById('formMessage');
const loadingScreen = document.getElementById('loadingScreen');
const themeToggle = document.getElementById('themeToggle');
const revealItems = document.querySelectorAll('.reveal');
const counts = document.querySelectorAll('.count');
const searchInput = document.getElementById('eventSearch');
const filterButtons = document.querySelectorAll('.filter-btn');
const eventCards = document.querySelectorAll('.event-card');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCounter = document.getElementById('modalCounter');
const modalClose = document.getElementById('modalClose');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
let galleryImages = [];
let galleryIndex = 0;

if (year) {
    year.textContent = new Date().getFullYear();
}

window.addEventListener('load', () => {
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 800);

    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 24);
    }
});

window.addEventListener('scroll', () => {
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 24);
    }
});

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('show');
    });
}

const savedTheme = localStorage.getItem('bidarur-theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

if (themeToggle) {
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('bidarur-theme', isDark ? 'dark' : 'light');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    });
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

revealItems.forEach((item) => revealObserver.observe(item));

const animateCount = (element) => {
    const target = Number(element.dataset.target);
    let count = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
        count += step;
        if (count >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = count;
        }
    }, 40);
};

const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counts.forEach((count) => countObserver.observe(count));

if (searchInput) {
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        eventCards.forEach((card) => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? 'block' : 'none';
        });
    });
}

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        filterButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        const filter = button.dataset.filter;

        eventCards.forEach((card) => {
            const visible = filter === 'all' || card.dataset.category === filter;
            card.style.display = visible ? 'block' : 'none';
        });
    });
});

const showGalleryImage = () => {
    if (!modalImage || !modalTitle || !modalCounter) {
        return;
    }

    const imageName = galleryImages[galleryIndex]
        .split('/')
        .pop()
        .replace(/\.[^.]+$/, '')
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

    modalImage.src = galleryImages[galleryIndex];
    modalTitle.textContent = imageName || 'Event Image';
    modalCounter.textContent = `${galleryIndex + 1} / ${galleryImages.length}`;
};

if (eventCards.length && imageModal && modalImage && modalTitle) {
    eventCards.forEach((card) => {
        card.addEventListener('click', () => {
            galleryImages = (card.dataset.images || card.dataset.image || '')
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);
            galleryIndex = 0;
            showGalleryImage();
            imageModal.classList.add('open');
            imageModal.setAttribute('aria-hidden', 'false');
        });
    });
}

if (modalClose && imageModal) {
    modalClose.addEventListener('click', () => {
        imageModal.classList.remove('open');
        imageModal.setAttribute('aria-hidden', 'true');
    });

    imageModal.addEventListener('click', (event) => {
        if (event.target === imageModal) {
            imageModal.classList.remove('open');
            imageModal.setAttribute('aria-hidden', 'true');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            imageModal.classList.remove('open');
            imageModal.setAttribute('aria-hidden', 'true');
        }

        if (event.key === 'ArrowRight' && galleryImages.length > 1) {
            galleryIndex = (galleryIndex + 1) % galleryImages.length;
            showGalleryImage();
        }

        if (event.key === 'ArrowLeft' && galleryImages.length > 1) {
            galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
            showGalleryImage();
        }
    });
}

if (modalPrev && modalNext && imageModal) {
    modalPrev.addEventListener('click', () => {
        if (!galleryImages.length) {
            return;
        }
        galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
        showGalleryImage();
    });

    modalNext.addEventListener('click', () => {
        if (!galleryImages.length) {
            return;
        }
        galleryIndex = (galleryIndex + 1) % galleryImages.length;
        showGalleryImage();
    });
}

if (form) {
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const category = categoryInput.value.trim();
        const eventDate = eventDateInput.value;
        const guests = guestInput.value;

        if (!name || !email || !category || !eventDate || !guests) {
            formMessage.textContent = 'Please fill in all registration fields.';
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            formMessage.textContent = 'Please enter a valid email address.';
            return;
        }

        const bookings = JSON.parse(localStorage.getItem('bidarur-bookings') || '[]');
        bookings.push({
            name,
            email,
            category,
            eventDate,
            guests,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('bidarur-bookings', JSON.stringify(bookings));

        formMessage.innerHTML = '✓ Booking Successful<br>Your request has been sent.';
        form.reset();
    });
}
