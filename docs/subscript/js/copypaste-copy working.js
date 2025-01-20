
// Function to export data by copying it to the clipboard
function copyDataToClipboard() {
    try {
        const data = loadData(); // Load data from localStorage
        const jsonData = JSON.stringify(data); // Convert data to JSON string
        navigator.clipboard.writeText(jsonData) // Write JSON to clipboard
            .then(() => {
                alert("Data copied to clipboard!");
            })
            .catch(err => {
                console.error("Failed to copy data: ", err);
            });
    } catch (err) {
        console.error("Error copying data: ", err);
        alert("Failed to copy data.");
    }
}

// Attach event listener to the button
document.getElementById("copy-data").addEventListener("click", copyDataToClipboard);
