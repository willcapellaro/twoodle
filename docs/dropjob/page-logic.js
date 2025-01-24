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
                console.log('Dropped URL:', url); // Trace dropped URL
                fetchMetadata(url)
                    .then((metadata) => {
                        console.log('Fetched metadata:', metadata); // Trace fetched metadata
                        addCardToList(metadata, url);
                    })
                    .catch((error) => {
                        console.error('Error fetching metadata:', error);
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
    console.log('Adding card with metadata:', metadata); // Trace adding card
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${metadata.title}</h5>
            <p class="card-text">${metadata.description || "Domain: " + metadata.domain}</p>
            <a href="${url}" target="_blank" class="btn btn-primary">${metadata.buttonText}</a>
            <button class="btn btn-secondary paste-metadata">Paste Metadata</button>
        </div>
    `;

    const pasteButton = card.querySelector('.paste-metadata');
    pasteButton.addEventListener('click', async () => handlePasteMetadata(card));

    linkList.appendChild(card);
}

// Function to handle pasting metadata
async function handlePasteMetadata(card) {
    try {
        const metadataString = await navigator.clipboard.readText();
        console.log('Raw clipboard content:', metadataString); // Trace raw clipboard content

        if (!metadataString) {
            console.warn('No metadata in clipboard');
            return;
        }

        console.log('Clipboard content:', metadataString); // Debugging log

        const source = identifySource(metadataString);
        console.log('Identified source:', source); // Trace identified source

        const parsedMetadata = window.parseMetadataString(metadataString, source); // Call directly from global scope if not imported
        console.log('Parsed metadata:', parsedMetadata); // Trace parsed metadata

        // Update card content with parsed metadata
        card.querySelector('.card-title').innerText = parsedMetadata.title;
        card.querySelector('.card-text').innerText = parsedMetadata.company;
    } catch (error) {
        console.error('Error reading clipboard or updating card:', error);
    }
}

// Function to identify the source based on pasted string
function identifySource(metadataString) {
    if (metadataString.includes('Show more options')) {
        return 'linkedin';
    } else if (metadataString.includes('S\n') || metadataString.includes('via LinkedIn')) {
        return 'google';
    } else {
        return 'simplify';
    }
}