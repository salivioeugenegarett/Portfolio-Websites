function showLanguageModal(btn) {
    // Get project-specific data from the button's closest project-info parent
    const projectInfo = btn.closest('.project-info');
    const repo = btn.dataset.repo; // Get repo directly from the button's new data-repo attribute
    const projectTitle = projectInfo.querySelector('h3').textContent; // Get the project title

    // Get modal elements
    const modal = document.getElementById('languageModal');
    const modalTitle = document.getElementById('modalProjectTitle');
    const modalLanguageList = document.getElementById('modalLanguageList');
    const modalCloseBtn = modal.querySelector('.modal-close-btn');

    // Populate modal title
    modalTitle.textContent = projectTitle;

    // Show modal with transition
    modal.classList.add('active');

    // Clear previous data and show loading state
    modalLanguageList.innerHTML = '<li><i class="fas fa-spinner fa-spin"></i> Loading...</li>';

    // Fetch language data from GitHub API
    fetch(`https://api.github.com/repos/${repo}/languages`)
        .then(res => {
            if (!res.ok) {
                // If response is not OK (e.g., 404, 403), throw an error
                throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
            }
            return res.json();
        })
        .then(data => {
            modalLanguageList.innerHTML = ''; // Clear loading message

            if (Object.keys(data).length === 0) {
                // If no language data is returned (e.g., empty repo, all non-code files)
                modalLanguageList.innerHTML = '<li>No language data available.</li>';
            } else {
                const total = Object.values(data).reduce((a, b) => a + b, 0);
                for (let lang in data) {
                    const percent = ((data[lang] / total) * 100).toFixed(1);
                    modalLanguageList.innerHTML += `<li>${lang}: ${percent}%</li>`;
                }
            }
        })
        .catch(error => {
            console.error('Error fetching language data:', error);
            modalLanguageList.innerHTML = '<li><i class="fas fa-exclamation-circle"></i> Could not load data.</li>';
        });

    // --- Modal Closing Logic ---
    const closeModal = () => {
        modal.classList.remove('active');
        // Clean up event listeners to prevent multiple bindings if modal opens/closes often
        modal.removeEventListener('click', handleOverlayClick);
        modalCloseBtn.removeEventListener('click', closeModal);
    };

    const handleOverlayClick = (event) => {
        // Close modal only if the direct overlay is clicked, not the content box
        if (event.target === modal) {
            closeModal();
        }
    };

    // Add event listeners for closing
    modal.addEventListener('click', handleOverlayClick);
    modalCloseBtn.addEventListener('click', closeModal);

    // Optional: Close on Escape key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    }, { once: true }); // Use { once: true } to auto-remove after one use
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Scroll Down Arrow Logic ---
    const scrollArrow = document.getElementById('scrollArrow');

    if (scrollArrow) {
        let isArrowVisible = true;

        const handleScrollArrowVisibility = () => {
            // Hide the arrow once the user scrolls beyond 100px
            if (window.scrollY > 100 && isArrowVisible) {
                scrollArrow.style.opacity = '0';
                scrollArrow.style.pointerEvents = 'none'; // Make it unclickable when hidden
                isArrowVisible = false;
            } else if (window.scrollY <= 100 && !isArrowVisible) {
                // Show it again if they scroll back to the top
                scrollArrow.style.opacity = '1';
                scrollArrow.style.pointerEvents = 'auto'; // Make it clickable again
                isArrowVisible = true;
            }
        };

        // Attach the scroll event listener
        window.addEventListener('scroll', handleScrollArrowVisibility);

        // Initial check in case the page is loaded already scrolled
        handleScrollArrowVisibility();

        // Make it scroll smoothly to the next section when clicked
        scrollArrow.addEventListener('click', () => {
            const nextSection = document.querySelector('.about-me-section'); // Scroll to About Me
            if (nextSection) {
                window.scrollTo({
                    top: nextSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }

    // --- Language Modal Logic (Existing, just ensuring it's here) ---
    window.showLanguageModal = function(btn) { // Make it a global function
        const projectInfo = btn.closest('.project-info');
        const repo = btn.dataset.repo;
        const projectTitle = projectInfo.querySelector('h3').textContent;

        const modal = document.getElementById('languageModal');
        const modalTitle = document.getElementById('modalProjectTitle');
        const modalLanguageList = document.getElementById('modalLanguageList');
        const modalCloseBtn = modal.querySelector('.modal-close-btn');

        modalTitle.textContent = projectTitle;
        modal.classList.add('active');
        modalLanguageList.innerHTML = '<li><i class="fas fa-spinner fa-spin"></i> Loading...</li>';

        fetch(`https://api.github.com/repos/${repo}/languages`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => {
                modalLanguageList.innerHTML = '';

                if (Object.keys(data).length === 0) {
                    modalLanguageList.innerHTML = '<li>No language data available.</li>';
                } else {
                    const total = Object.values(data).reduce((a, b) => a + b, 0);
                    for (let lang in data) {
                        const percent = ((data[lang] / total) * 100).toFixed(1);
                        modalLanguageList.innerHTML += `<li>${lang}: ${percent}%</li>`;
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching language data:', error);
                modalLanguageList.innerHTML = '<li><i class="fas fa-exclamation-circle"></i> Could not load data.</li>';
            });

        const closeModal = () => {
            modal.classList.remove('active');
            modal.removeEventListener('click', handleOverlayClick);
            modalCloseBtn.removeEventListener('click', closeModal);
        };

        const handleOverlayClick = (event) => {
            if (event.target === modal) {
                closeModal();
            }
        };

        modal.addEventListener('click', handleOverlayClick);
        modalCloseBtn.addEventListener('click', closeModal);

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        }, { once: true });
    };
});