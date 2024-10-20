// events.js

document.addEventListener('DOMContentLoaded', function () {
    // Set up button click for adding an item
    const addItemBtn = document.getElementById('addItemBtn');
    const addItemField = document.getElementById('addItemField');
    const itemsList = document.getElementById('itemsList');

    addItemBtn.addEventListener('click', function () {
        const newItem = addItemField.value.trim();
        if (newItem) {
            addItemToList(newItem);
            addItemField.value = ''; // Clear input field
        }
    });a// events.js

document.addEventListener('DOMContentLoaded', function () {
    const addItemBtn = document.getElementById('addItemBtn');
    const addItemField = document.getElementById('addItemField');
    const itemsList = document.getElementById('itemsList');
    const urgencyList = document.getElementById('urgencyList');
    const importanceList = document.getElementById('importanceList');

    let items = loadItemsFromLocalStorage();

    // Display existing items if any are loaded from local storage
    items.forEach(item => addItemToUI(item));

    // Event listener for adding a new item
    addItemBtn.addEventListener('click', function () {
        const newItem = addItemField.value.trim();
        if (newItem) {
            addItemToUI(newItem);
            saveItemToLocalStorage(newItem);
            addItemField.value = ''; // Clear the input field
        }
    });

    // Function to add an item to the UI (both Items list and the prioritization lists)
    function addItemToUI(itemName) {
        // Add to Items list (Items Tab)
        const li = document.createElement('li');
        li.textContent = itemName;
        itemsList.appendChild(li);

        // Add to Urgency list
        const urgencyLi = document.createElement('li');
        urgencyLi.textContent = itemName;
        urgencyList.appendChild(urgencyLi);

        // Add to Importance list
        const importanceLi = document.createElement('li');
        importanceLi.textContent = itemName;
        importanceList.appendChild(importanceLi);
    }

    // Function to save an item to local storage
    function saveItemToLocalStorage(itemName) {
        items.push(itemName);
        localStorage.setItem('twoodleItems', JSON.stringify(items));
    }

    // Function to load items from local storage
    function loadItemsFromLocalStorage() {
        const storedItems = localStorage.getItem('twoodleItems');
        return storedItems ? JSON.parse(storedItems) : [];
    }
});

    // Example function to add an item to the list
    function addItemToList(itemName) {
        const li = document.createElement('li');
        li.textContent = itemName;
        itemsList.appendChild(li);
        console.log(`Added item: ${itemName}`);
    }
});