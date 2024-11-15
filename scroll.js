const sections = document.querySelectorAll('.section');
const mainText = document.getElementById('mainText');
const subText = document.getElementById('subText');
const navLinks = document.querySelectorAll('.navlink');

window.addEventListener('scroll', () => {
    let current = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

window.addEventListener('scroll', () => {
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            // Change background image
            document.body.style.backgroundImage = section.getAttribute('data-bg');
            
            // Change text position
            const offset = (index % 2 === 0) ? 'translateX(-100px)' : 'translateX(50px)';
            mainText.style.transform = offset;
            subText.style.transform = offset;

            // Change text content with fade effect
            mainText.style.opacity = '0';
            subText.style.opacity = '0';
            const sectionColor = section.getAttribute('data-color') || 'white'; // Default to white
            mainText.style.color = sectionColor;
            subText.style.color = sectionColor;

            setTimeout(() => {
                mainText.textContent = section.getAttribute('data-main');
                subText.textContent = section.getAttribute('data-sub');
                mainText.style.opacity = '1';
                subText.style.opacity = '1';
            }, 250); // Sync with transition
        }
    });
});
