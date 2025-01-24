document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('howToPlayModal');
    const howToPlayBtn = document.getElementById('howToPlayBtn');
    const closeBtn = document.querySelector('.close');
    const dots = document.querySelectorAll('.dot');
    const pages = document.querySelectorAll('.page');
    const nextButtons = document.querySelectorAll('.action-btn');
    const finishBtn = document.getElementById('finishBtn');

    let currentPage = 0;

    // Function to update the visible page and pagination dots
    const updateModal = () => {
        pages.forEach((page, index) => {
            page.classList.toggle('hidden', index !== currentPage);
        });
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });

        // Ensure correct star states on specific pages
        if (currentPage === 1 || currentPage === 2) { // For Page 2 and Page 3
            const voteInputs = document.querySelectorAll(`#page-${currentPage + 1} .vote`);
            voteInputs.forEach((input) => {
                input.checked = true; // Set stars to ON state
                input.disabled = false; // Ensure the checkboxes are enabled
                input.dataset.vote = "1"; // Set vote data to ON
            });
        }
    };

    // Clear modal state
    const clearState = () => {
        pages.forEach((page) => {
            const voteInputs = page.querySelectorAll('.vote');
            voteInputs.forEach((input) => {
                input.checked = false; // Reset all checkboxes
                input.disabled = false; // Ensure all checkboxes are enabled
                input.dataset.vote = "0"; // Reset vote data
            });
        });
    };

    // Open the modal
    howToPlayBtn.addEventListener('click', () => {
        clearState(); // Clear state when opening the modal
        modal.classList.add('show');
        currentPage = 0;
        updateModal();
    });

    // Close the modal
    closeBtn.addEventListener('click', () => {
        clearState(); // Clear state when exiting the modal
        modal.classList.remove('show');
    });

    // Navigate between pages using Next buttons
    nextButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (currentPage < pages.length - 1) {
                currentPage++;
                updateModal();
            }
        });
    });

    // Close the modal when the Finish button is clicked
    finishBtn.addEventListener('click', () => {
        clearState(); // Clear state when finishing the modal
        modal.classList.remove('show');
    });

    // Navigate directly to a page using dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentPage = index;
            updateModal();
        });
    });
});
