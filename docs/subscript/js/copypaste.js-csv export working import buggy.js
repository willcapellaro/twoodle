
// Function to export data as a simplified CSV
function copyDataToClipboard() {
    try {
        const data = loadData(); // Load data from localStorage

        // Convert the data to a CSV-like format
        const csvData = data.map(item => [
            item.active ? "1" : "0", // Convert boolean to 1/0
            item.name || "-",        // Fallback to "-" if field is empty
            item.cost || "-",
            item.period || "-",
            item.chargeDate || "-",  // Use "-" if no valid date is provided
            item.category || "-",
            item.account || "-",
            item.notes || "-"        // Fallback to "-" if no notes
        ].join(",")).join("\n");

        // Copy the CSV-like data to the clipboard
        navigator.clipboard.writeText(csvData)
            .then(() => {
                alert("Data copied to clipboard in CSV format!");
            })
            .catch(err => {
                console.error("Failed to copy data: ", err);
            });
    } catch (err) {
        console.error("Error copying data: ", err);
        alert("Failed to copy data.");
    }
}

// Function to create and display the import modal
function showImportModal() {
    const options = [
        { value: "overwrite", label: "Overwrite data", disabled: false },
        { value: "merge", label: "Merge data", disabled: true } // Merge functionality disabled for now
    ];

    const optionsHTML = options.map(option => `
        <label>
            <input type="radio" name="import-option" value="${option.value}" ${option.disabled ? "disabled" : ""} ${option.value === "overwrite" ? "checked" : ""}>
            ${option.label}
        </label>
    `).join("<br>");

    const modalHTML = `
        <div id="import-modal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; border: 1px solid #ccc; padding: 20px; z-index: 1000; width: 300px; text-align: center;">
            <h3>Import Data</h3>
            <div>${optionsHTML}</div>
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

// Function to import data from clipboard
async function importDataFromClipboard() {
    try {
        const clipboardText = await navigator.clipboard.readText();
        const importedData = parseCSV(clipboardText);

        // Determine import option
        const selectedOption = document.querySelector('input[name="import-option"]:checked').value;
        if (selectedOption === "overwrite") {
            saveData(importedData); // Overwrite current data with imported data
        } else {
            alert("Merge functionality is currently disabled.");
        }

        // Reload and render data
        const updatedData = loadData();
        createInputGrid(updatedData);
        renderCharts(updatedData);

        alert("Data imported successfully!");
    } catch (err) {
        console.error("Failed to import data: ", err);
        alert("Error: Clipboard does not contain valid CSV data!");
    } finally {
        closeImportModal();
    }
}

// Function to parse CSV-like data into JSON format
function parseCSV(csvText) {
    return csvText.split("\n").map(line => {
        const [active, name, cost, period, chargeDate, category, account, notes] = line.split(",");

        return {
            active: active === "1", // Convert "1" to true and "0" to false
            name: name.trim(),
            cost: parseFloat(cost) || 0, // Convert to a number or default to 0
            period: period.trim(),
            chargeDate: isValidDate(chargeDate.trim()) ? chargeDate.trim() : "-", // Use "-" if invalid date
            category: category.trim(),
            account: account.trim(),
            notes: notes.trim()
        };
    });
}

// Helper function to validate date format
function isValidDate(dateString) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Matches "yyyy-MM-dd"
    if (!datePattern.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

// Attach event listeners to the buttons
document.getElementById("copy-data").addEventListener("click", copyDataToClipboard);
document.getElementById("paste-data").addEventListener("click", showImportModal);
