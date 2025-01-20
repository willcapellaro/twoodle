
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
            item.chargeDate || "-",
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

// Attach event listener to the copy button
document.getElementById("copy-data").addEventListener("click", copyDataToClipboard);

// Placeholder for the import functionality (to be built incrementally)
function showImportModal() {
    alert("Import functionality will be added incrementally.");
}
document.getElementById("paste-data").addEventListener("click", showImportModal);
