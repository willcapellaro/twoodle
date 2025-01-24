// page-logic.js

const dropZone = document.getElementById('drop-zone');
const linkList = document.getElementById('link-list');

// Add event listeners for drag-and-drop functionality
dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragover');

    const items = event.dataTransfer.items;

    for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'string' && items[i].type === 'text/uri-list') {
            items[i].getAsString((url) => {
                fetchMetadata(url).then(metadata => {
                    addCardToList(metadata, url);
                }).catch(error => {
                    console.error('Error fetching metadata:', error);
                    // Fallback metadata in case of error
                    const fallbackMetadata = {
                        title: 'Unknown Title',
                        description: 'No Description Available',
                        domain: new URL(url).hostname,
                        buttonText: 'Open Link'
                    };
                    addCardToList(fallbackMetadata, url);
                });
            });
        }
    }
});

// Function to add a card to the list
function addCardToList(metadata, url) {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${metadata.title}</h5>
            <p class="card-text">${metadata.description || "Domain: " + metadata.domain}</p>
            <a href="${url}" target="_blank" class="btn btn-primary">${metadata.buttonText}</a>
        </div>
    `;

    linkList.appendChild(card);
}