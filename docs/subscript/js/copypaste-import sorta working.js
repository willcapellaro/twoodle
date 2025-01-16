
// Function to create and display the import modal
function showImportModal() {
    // Create modal HTML structure
    const modalHTML = `
        <div id="import-modal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; border: 1px solid #ccc; padding: 20px; z-index: 1000; width: 300px; text-align: center;">
            <h3>Import Clipboard Data</h3>
            <div>
                <label><input type="radio" name="import-option" value="overwrite" checked> Overwrite data</label><br>
                <label><input type="radio" name="import-option" value="merge"> Merge data</label>
            </div>
            <div style="margin-top: 20px;">
                <button id="cancel-import" style="margin-right: 10px;">Cancel</button>
                <button id="confirm-import">Load Data</button>
            </div>
        </div>
        <div id="import-modal-backdrop" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5); z-index: 999;"></div>
    `;

    // Append modal to the body
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Attach event listeners for modal buttons
    document.getElementById("cancel-import").addEventListener("click", closeImportModal);
    document.getElementById("confirm-import").addEventListener("click", importDataFromClipboard);
}

// Function to close the modal
function closeImportModal() {
    const modal = document.getElementById("import-modal");
    const backdrop = document.getElementById("import-modal-backdrop");
    if (modal) modal.remove();
    if (backdrop) backdrop.remove();
}

// Function to import data from the clipboard
async function importDataFromClipboard() {
    try {
        const clipboardText = await navigator.clipboard.readText();
        const importedData = JSON.parse(clipboardText);

        // Determine import option
        const selectedOption = document.querySelector('input[name="import-option"]:checked').value;
        let finalData;

        if (selectedOption === "overwrite") {
            finalData = importedData; // Replace with imported data
        } else if (selectedOption === "merge") {
            const currentData = loadData();
            finalData = mergeData(currentData, importedData); // Merge data
        }

        // Save and render the new data
        saveData(finalData);
        createInputGrid(finalData);
        renderCharts(finalData);

        alert("Data imported successfully!");
    } catch (err) {
        console.error("Failed to import data: ", err);
        alert("Error: Clipboard does not contain valid data!");
    } finally {
        closeImportModal();
    }
}

// Function to merge current data with imported data
function mergeData(currentData, importedData) {
    const merged = [...currentData];
    const nameCostMap = new Map();

    // Add existing data to the map
    currentData.forEach(item => {
        const key = `${item.name}-${item.cost}`;
        nameCostMap.set(key, item);
    });

    importedData.forEach(item => {
        const key = `${item.name}-${item.cost}`;

        if (!nameCostMap.has(key)) {
            // New unique item, add to merged data
            merged.push(item);
        }
    });

    return merged;
}

// Attach event listener to the import button
document.getElementById("paste-data").addEventListener("click", showImportModal);
