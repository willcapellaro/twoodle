console.log('text');

// Function to test "Copy Data" button
function copyDataToClipboard() {
    const testString = "I'm working";
    navigator.clipboard.writeText(testString)
        .then(() => {
            alert("Data copied to clipboard!");
        })
        .catch(err => {
            console.error("Failed to copy data: ", err);
        });
}

// Attach event listener to the button
document.getElementById("copy-data").addEventListener("click", copyDataToClipboard);
