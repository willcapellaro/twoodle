document.addEventListener('DOMContentLoaded', function () {
    const list1 = document.getElementById('sortable-list1');
    const list2 = document.getElementById('sortable-list2');
    const addButton = document.getElementById('add-btn');

    // Add button click event to add new items
    addButton.addEventListener('click', function () {
        const newItem = `Item ${document.querySelectorAll('li').length + 1}`;
        addItemToBothLists(newItem);
    });

    // Function to add an item to both lists
    function addItemToBothLists(itemName) {
        const li1 = createListItem(itemName, 'list1');
        const li2 = createListItem(itemName, 'list2');
        list1.appendChild(li1);
        list2.appendChild(li2);
    }

    // Function to create a list item
    function createListItem(text, list) {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="drag-zone"></div>
            <span class="editable">${text}</span>
        `;

        li.querySelector('.editable').addEventListener('click', function (event) {
            makeTextEditable(event.target, list);
        });

        return li;
    }
});