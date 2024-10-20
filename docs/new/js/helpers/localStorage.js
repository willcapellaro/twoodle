var userID;
var flagShareUpdate = true;
var selectedLocalStorageTab = 'quadrants';
var twoodles = [];
var items = [];
window.addEventListener('storage', syncStorageChanges); // Placeholder for future sync handling

// Helper function to safely get an item from localStorage
function getFromLocalStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (error) {
        console.error(`Error retrieving key ${key} from localStorage:`, error);
        return null;
    }
}

// Helper function to save items to localStorage
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Function to save axis names and update the UI
function saveAxisNames() {
    if (document.getElementById('yAxis_name').value !== document.getElementById('xAxis_name').value && twoodles[selectedTwoodleIndex]) {
        updateAxisUI();
        twoodles[selectedTwoodleIndex]['defaultY'] = yAxisName;
        twoodles[selectedTwoodleIndex]['defaultX'] = xAxisName;
    }
    checkLblRecipes();
}

// Function to update the UI with the new axis names
function updateAxisUI() {
    document.getElementById('spanYAxis').innerHTML = yAxisName;
    document.getElementById('spanXAxis').innerHTML = xAxisName;
}

// Function to save values to localStorage
function saveValues() {
    saveAxisNames();
    saveToLocalStorage('twoodles', { 'twoodles': twoodles });
}

// Function to load values from localStorage and initialize the app state
function loadValues() {
    selectedTwoodleIndex = 0; // Moved to a global context

    const storedData = getFromLocalStorage('twoodles');
    if (storedData && storedData.twoodles) {
        twoodles = storedData.twoodles.length ? storedData.twoodles : getDefaultTwoodles();
        initializeStateFromTwoodle();
    } else {
        initializeWithDefaults();
    }
}

// Initializes the app with default values when localStorage is empty or invalid
function initializeWithDefaults() {
    twoodles = getDefaultTwoodles();
    saveToLocalStorage('twoodles', { 'twoodles': twoodles });
    initializeStateFromTwoodle();
}

// Returns the default Twoodles structure
function getDefaultTwoodles() {
    return [
        {
            'index': 0,
            'type': 'array',
            'name': 'All Twoodles',
            'defaultY': recipes[0]['defaultY'],
            'defaultX': recipes[0]['defaultX'],
            'items': [],
            'xValues': [],
            'yValues': []
        },
        {
            'index': 1,
            'type': 'twoodle',
            'name': 'Twoodle 1',
            'defaultY': recipes[0]['defaultY'],
            'defaultX': recipes[0]['defaultX'],
            'items': [],
            'xValues': [],
            'yValues': []
        }
    ];
}

// Sets up the state from the selected Twoodle
function initializeStateFromTwoodle() {
    const selectedTwoodle = twoodles[selectedTwoodleIndex];
    items = selectedTwoodle['items'];
    yAxisName = selectedTwoodle['defaultY'];
    xAxisName = selectedTwoodle['defaultX'];
​⬤