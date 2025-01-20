function makeTextEditable(spanElement, currentList) {
    spanElement.setAttribute('contenteditable', 'true');
    spanElement.focus();
    
    // Listen for blur event to save the content when editing is done
    spanElement.addEventListener('blur', function () {
        const newText = spanElement.innerText.trim();
        updateTextInBothLists(spanElement.dataset.originalText, newText, currentList);
        spanElement.removeAttribute('contenteditable');
        spanElement.dataset.originalText = newText;
    });

    // Listen for 'Enter' key to stop editing
    spanElement.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent newline
            spanElement.blur();  // Trigger the blur event
        }
    });
}

function updateTextInBothLists(oldText, newText, currentList) {
    const listToUpdate = currentList === 'list1' ? document.getElementById('sortable-list2') : document.getElementById('sortable-list1');
    const items = listToUpdate.querySelectorAll('.editable');

    items.forEach(item => {
        if (item.innerText.trim() === oldText) {
            item.innerText = newText;  // Update the text in the opposite list
            item.dataset.originalText = newText;
        }
    });
}