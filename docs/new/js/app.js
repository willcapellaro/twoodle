// app.js

document.addEventListener('DOMContentLoaded', function () {
    console.log('App initialized.');

    // Initialize tabs
    const itemsTab = document.getElementById('itemsTab');
    const urgencyTab = document.getElementById('urgencyTab');
    const importanceTab = document.getElementById('importanceTab');
    const resultsTab = document.getElementById('resultsTab');

    // Default active tab
    let activeTab = 'items';

    // Show the default tab content
    showTab(activeTab);

    // Set up tab click events
    itemsTab.addEventListener('click', function () {
        activeTab = 'items';
        showTab(activeTab);
    });

    urgencyTab.addEventListener('click', function () {
        activeTab = 'urgency';
        showTab(activeTab);
    });

    importanceTab.addEventListener('click', function () {
        activeTab = 'importance';
        showTab(activeTab);
    });

    resultsTab.addEventListener('click', function () {
        activeTab = 'results';
        showTab(activeTab);
    });
});

// Function to show a tab and hide the others
function showTab(tabName) {
    const tabSections = document.querySelectorAll('.tab-content');
    tabSections.forEach(section => section.style.display = 'none');

    switch (tabName) {
        case 'items':
            document.getElementById('itemsSection').style.display = 'block';
            break;
        case 'urgency':
            document.getElementById('urgencySection').style.display = 'block';
            break;
        case 'importance':
            document.getElementById('importanceSection').style.display = 'block';
            break;
        case 'results':
            document.getElementById('resultsSection').style.display = 'block';
            break;
    }
}