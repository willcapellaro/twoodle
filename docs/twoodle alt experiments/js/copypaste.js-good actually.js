
// Function to clean up data by removing blank rows and moving filled rows to the top
function cleanUpData() {
    try {
        const data = loadData(); // Load data from localStorage

        // Filter out blank rows and move filled rows to the top
        const cleanedData = data.filter(item => item.name || item.cost);

        // Save the cleaned data
        saveData(cleanedData);

        // Reload and render the updated data
        createInputGrid(cleanedData);
        renderCharts(cleanedData);

        alert("Data cleaned up! Blank rows have been removed.");
    } catch (err) {
        console.error("Failed to clean up data: ", err);
        alert("Error: Could not clean up data.");
    }
}

// Attach event listener to the "Clean Up" button
document.getElementById("clean-up-data").addEventListener("click", cleanUpData);
