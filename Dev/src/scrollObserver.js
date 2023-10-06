export function initObserver() {

    const observer = new IntersectionObserver((entries) => {
        console.log(entries);

        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                console.log(entry);

                // entry.target.classList.replace('animate-hidden', 'show');
                entry.target.classList.add('show');
            } else {
                console.log(entry);
                // entry.target.classList.replace('show', 'animate-hidden');
                entry.target.classList.remove('show');
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.animate-hidden');

    hiddenElements.forEach((el) => observer.observe(el));
}
