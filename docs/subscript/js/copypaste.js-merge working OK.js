
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

// Function to merge data from the clipboard with existing data
async function mergeDataFromClipboard() {
    try {
        const clipboardText = await navigator.clipboard.readText();
        const importedData = parseCSV(clipboardText); // Parse clipboard data
        const currentData = loadData(); // Load existing data from localStorage

        // Merge current data and imported data
        const mergedData = mergeData(currentData, importedData);

        // Save and render the merged data
        saveData(mergedData);
        createInputGrid(mergedData);
        renderCharts(mergedData);

        alert("Data merged successfully!");
    } catch (err) {
        console.error("Failed to merge data: ", err);
        alert("Error: Clipboard does not contain valid CSV data!");
    }
}

// Function to merge two data arrays
function mergeData(currentData, importedData) {
    const merged = [...currentData];
    const nameMap = new Map();

    // Add current data to the map
    currentData.forEach(item => {
        const key = `${item.name}-${item.cost}-${item.period}-${item.chargeDate}`;
        nameMap.set(key, item);
    });

    // Process imported data
    importedData.forEach(item => {
        const key = `${item.name}-${item.cost}-${item.period}-${item.chargeDate}`;

        if (nameMap.has(key)) {
            // Full duplicate, ignore
        } else if (currentData.some(existing => existing.name === item.name && !isFullyEqual(existing, item))) {
            // Near duplicate, prefix both with !!!
            const existingItem = currentData.find(existing => existing.name === item.name);
            if (existingItem) existingItem.name = `!!!${existingItem.name}`;
            item.name = `!!!${item.name}`;
            merged.push(item);
        } else {
            // Unique item, add to merged data
            merged.push(item);
        }
    });

    // Remove blank rows and return cleaned data
    return merged.filter(item => item.name || item.cost);
}

// Helper function to check if two rows are fully equal
function isFullyEqual(row1, row2) {
    return (
        row1.name === row2.name &&
        row1.cost === row2.cost &&
        row1.period === row2.period &&
        row1.chargeDate === row2.chargeDate &&
        row1.category === row2.category &&
        row1.account === row2.account &&
        row1.notes === row2.notes
    );
}

// Function to parse CSV-like data into JSON format with resilient date handling
function parseCSV(csvText) {
    const currentYear = new Date().getFullYear();

    return csvText.split("\n").map(line => {
        const [active, name, cost, period, chargeDate, category, account, notes] = line.split(",");

        return {
            active: active === "1", // Convert "1" to true and "0" to false
            name: name.trim(),
            cost: parseFloat(cost) || 0, // Convert to a number or default to 0
            period: period.trim(),
            chargeDate: processDate(chargeDate.trim(), currentYear), // Process and validate the date
            category: category.trim(),
            account: account.trim(),
            notes: notes.trim()
        };
    });
}

// Helper function to process and validate dates
function processDate(dateString, fallbackYear) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (datePattern.test(dateString)) {
        const date = new Date(dateString);
        if (date instanceof Date && !isNaN(date)) {
            return dateString; // Valid date
        }
    }

    const parts = dateString.split("-");
    if (parts.length === 3) {
        const [, month, day] = parts;
        if (isValidMonthDay(month, day)) {
            return `${fallbackYear}-${padZero(month)}-${padZero(day)}`;
        }
    }

    // Default fallback: January 1st of the current year
    return `${fallbackYear}-01-01`;
}

// Helper function to pad month and day with leading zeros
function padZero(value) {
    return value.toString().padStart(2, "0");
}

// Helper function to validate month and day
function isValidMonthDay(month, day) {
    const monthInt = parseInt(month, 10);
    const dayInt = parseInt(day, 10);

    return (
        monthInt >= 1 && monthInt <= 12 && // Valid month
        dayInt >= 1 && dayInt <= 31       // Valid day
    );
}

// Attach event listeners to buttons, ensuring elements exist in the DOM
const copyButton = document.getElementById("copy-data");
if (copyButton) {
    copyButton.addEventListener("click", copyDataToClipboard);
}

const mergeButton = document.getElementById("merge-data");
if (mergeButton) {
    mergeButton.addEventListener("click", mergeDataFromClipboard);
}
