// script.js

document.addEventListener("scroll", () => {
    const elements = document.querySelectorAll(".slide-in");

    elements.forEach((el) => {
        const position = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (position < windowHeight - 200) { // 50px offset for early visibility
            el.classList.add("visible");
        }
    
    });
});
// JavaScript to scroll to the next section on a small scroll

window.addEventListener("wheel", (event) => {
    if (event.deltaY >0) { // Scroll down
        const nextSection = document.querySelector(".slide-in:nth-of-type(1)");
        if (nextSection) nextSection.scrollIntoView({ behavior: "smooth" });
    }
    event.preventDefault();
    window.scrollBy({ 
        top: event.deltaY * 10, // Adjust multiplier to control speed
        behavior: "smooth"
    });
}, { passive: false });