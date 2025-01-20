document.addEventListener('DOMContentLoaded', function () {
    const editableItems = document.querySelectorAll('.editable');

    // Make the text contenteditable on click for all list items
    editableItems.forEach(item => {
        item.addEventListener('click', function () {
            item.setAttribute('contenteditable', 'true');
            item.focus();
        });

        // Stop editing when focus is lost (blur event)
        item.addEventListener('blur', function () {
            item.removeAttribute('contenteditable');
        });

        // Stop editing when Enter key is pressed
        item.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();  // Prevent newline from being added
                item.blur(); // Trigger the blur event
            }
        });
    });
});