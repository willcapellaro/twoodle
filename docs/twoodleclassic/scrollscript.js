// Select all elements with the .fade-in class
const faders = document.querySelectorAll('.fade-in');

// Create an IntersectionObserver instance
const observer = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            // Check if the element is in the viewport
            if (entry.isIntersecting) {
                // Add the .show class to trigger the animation
                entry.target.classList.add('show');
                // Stop observing the element once it’s visible
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.1 // Trigger when 10% of the element is in view
    }
);

// Observe each .fade-in element
faders.forEach(fader => {
    observer.observe(fader);
});