const STORAGE_KEY = "subscriptions";

// Load data from localStorage
function loadData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Save data to localStorage
function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Gather data from the grid
function gatherDataFromGrid() {
    const inputs = document.querySelectorAll('#subscription-table input, #subscription-table select');
    const subscriptions = [];

    inputs.forEach(input => {
        const index = input.dataset.index;
        const field = input.dataset.field;

        if (!subscriptions[index]) {
            subscriptions[index] = {};
        }

        if (input.type === "checkbox") {
            subscriptions[index][field] = input.checked;
        } else {
            subscriptions[index][field] = input.value;
        }
    });

    return subscriptions;
}

// Save data whenever a field is changed
function attachRealTimeSave() {
    const inputs = document.querySelectorAll('#subscription-table input, #subscription-table select');
    inputs.forEach(input => {
        input.addEventListener('input', handleSave); // Save on keystroke
        input.addEventListener('blur', handleSave); // Save on losing focus
    });
}

function handleSave() {
    const data = gatherDataFromGrid();
    saveData(data);
    renderCharts(data); // Optionally update charts in real time
}

// Create the input grid and populate with data
function createInputGrid(data) {
    let gridHTML = `<div class="tableGridHeader">
        <div class="input-label">Active</div>
        <div class="input-label">Name</div>
        <div class="input-label">Cost</div>
        <div class="input-label">Period</div>
        <div class="input-label">Charge Date</div>
        <div class="input-label">Category</div>
        <div class="input-label">Account</div>
        <div class="input-label">Notes</div>
    </div>
    `;

    // BLASTD-ADDFIELD-1: add items into let gridHTML
    // BLASTD-ADDFIELD-2: add details to the for loop
    // What is the structure of the select

    for (let i = 0; i < 50; i++) {
        const sub = data[i] || {};
        gridHTML += `<div class="tableGrid">
                                                    <input type="checkbox" ${sub.active ? "checked" : ""} data-index="${i}" data-field="active">

            <input type="text" placeholder="Subscription Name" value="${sub.name || ''}" data-index="${i}" data-field="name">
            <input type="number" placeholder="Cost" class="tabulation right" value="${sub.cost || ''}" data-index="${i}" data-field="cost">
            <select data-index="${i}" data-field="period">
                <option value="monthly" ${sub.period === "monthly" ? "selected" : ""}>Monthly</option>
                <option value="annual" ${sub.period === "annual" ? "selected" : ""}>Annual</option>
                <option value="other" ${sub.period === "other" ? "selected" : ""}>Other</option>
            </select>
            <input type="date" value="${sub.chargeDate || ''}" data-index="${i}" data-field="chargeDate">

<select id="categorySelect" data-index="${i}" data-field="category">
<option value="entertainment" ${sub.category === "entertainment" ? "selected" : ""}>🔴 Entertainment</option>
<option value="utilities" ${sub.category === "utilities" ? "selected" : ""}>🔵 Utilities</option>
<option value="software" ${sub.category === "software" ? "selected" : ""}>🟢 Software</option>
<option value="other" ${sub.category === "other" ? "selected" : ""}>🟠 Other</option>
<option value="unknown" ${sub.category === "unknown" ? "selected" : ""}>🟤 Unknown</option>
<option value="ending_service" ${sub.category === "ending_service" ? "selected" : ""}>⚫ Ending Service</option>
<option value="check" ${sub.category === "check" ? "selected" : ""}>🟣 Check</option>
</select>

            <select data-index="${i}" data-field="account">
                <option value="me" ${sub.account === "me" ? "selected" : ""}>me</option>
                <option value="not me" ${sub.account === "not me" ? "selected" : ""}>not me</option>
            </select>
            <input type="text" placeholder="Notes" value="${sub.notes || ''}" data-index="${i}" data-field="notes">
        </div>
        `;
    }

    $('#subscription-table').html(gridHTML);
    attachRealTimeSave(); // Attach real-time save to inputs
}

// Clear data and reset the grid
function clearData() {
    localStorage.removeItem(STORAGE_KEY);
    createInputGrid([]); // Reset the grid
    renderCharts([]); // Clear charts
    alert("All data cleared!");
}

// Render Monthly and Annual Charts
function renderCharts(data) {
const monthlyData = JSON.parse(localStorage.getItem('monthlyData')) || [];
const annualData = JSON.parse(localStorage.getItem('annualData')) || [];


            // Map each category to a color
const categoryColors = {
    entertainment: 'red',
    utilities: 'royalblue',
    software: 'green',
    other: 'orange',
    unknown: 'brown',
    ending_service: 'black',
    check: 'magenta'
    };

data.forEach((item) => {
    if (item.cost && item.period) {
        const cost = parseFloat(item.cost);
        const chargeDate = new Date(item.chargeDate);
        const chargeName = item.name || 'Unnamed Charge';
        const category = item.category || 'Unknown';
        // Assign color/shape based on category
        const color = categoryColors[category] || 'black';


        if (item.period === "monthly") {
            monthlyData.push({
                x: chargeDate.getDate(), // Day of month
                y: cost,
                name: chargeName,
                marker: {
                    radius: 12,    // 4× bigger than default (4×4 = 16)
                    fillColor: color  // Color by category
                },
                category: category,
                tooltipDate: `${chargeDate.getDate()}${getOrdinalSuffix(chargeDate.getDate())} of month`
            });
        } else if (item.period === "annual") {
            const dayOfYear = Math.floor((chargeDate - new Date(chargeDate.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
            annualData.push({
                x: dayOfYear, // Day of year
                y: cost,
                name: chargeName,
                marker: {
                    radius: 12,    // 4× bigger than default (4×4 = 16)
                    fillColor: color  // Color by category
                },
                category: category,
                tooltipDate: `${chargeDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            });
        }
    }
});

// Helper function to get ordinal suffix
function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

        Highcharts.chart('monthly-chart', {
            chart: { type: 'scatter' },
            title: { text: 'Monthly Subscription Costs' },
            xAxis: { title: { text: 'Day of Month' }, min: 1, max: 31 },
            yAxis: { title: { text: 'Cost ($)' }, min: 0 },
            tooltip: {
                useHTML: true,
                pointFormat: '<b>{point.name}</b><br>Charge date: {point.tooltipDate}<br>Cost: ${point.y}<br>Category: {point.category}'
            },
            series: [{
                name: 'Costs',
                data: monthlyData
            }]
        });

        Highcharts.chart('annual-chart', {
            chart: { type: 'scatter' },
            title: { text: 'Annual Subscription Costs' },
            xAxis: { title: { text: 'Day of Year' }, min: 1, max: 366 },
            yAxis: { title: { text: 'Cost ($)' }, min: 0 },
            tooltip: {
                useHTML: true,
                pointFormat: '<b>{point.name}</b><br>Date: {point.tooltipDate}<br>Cost: ${point.y}<br>Category: {point.category}'
            },
            series: [{
                name: 'Costs',
                data: annualData
            }]
        });
}

// Initialize the app
function initializeApp() {
    const savedData = loadData();
    createInputGrid(savedData);
    renderCharts(savedData);

    $('#clear-data').on('click', clearData);
}

initializeApp();


document.addEventListener('DOMContentLoaded', () => {
    const CATEGORY_CLASS_PREFIX = 'category-';

    // Function to apply a class to a select element
    const applyCategoryClass = (selectElement) => {
        const selectedValue = selectElement.value;

        // Remove any existing category-related classes
        selectElement.className = [...selectElement.classList]
            .filter(className => !className.startsWith(CATEGORY_CLASS_PREFIX))
            .join(' ');

        // Add the new class for the selected category
        if (selectedValue) {
            selectElement.classList.add(`${CATEGORY_CLASS_PREFIX}${selectedValue}`);
        }
    };

    // Attach event listeners to all category select elements
    const attachCategoryListeners = () => {
        document.querySelectorAll('#categorySelect').forEach(select => {
            select.addEventListener('change', (event) => {
                const selectElement = event.target;
                applyCategoryClass(selectElement);

                // Trigger the save handler to persist the change
                handleSave();
            });
        });
    };

    // Apply classes for all existing category select elements on page load
    const initializeCategoryClasses = () => {
        document.querySelectorAll('#categorySelect').forEach(select => {
            applyCategoryClass(select);
        });
    };

    // Reapply listeners and classes after the grid is created or updated
    const refreshCategoryListenersAndClasses = () => {
        initializeCategoryClasses();
        attachCategoryListeners();
    };

    // Inject the refresh into the existing app logic
    const originalCreateInputGrid = createInputGrid;
    createInputGrid = function(data) {
        originalCreateInputGrid(data);
        refreshCategoryListenersAndClasses();
    };

    // Run the initial setup
    initializeCategoryClasses();
    attachCategoryListeners();

    // Monthly and annual data (replace with actual dynamic data)
    const monthlyData = [
      { name: 'Netflix', y: 100, category: 'Entertainment' },
      { name: 'Hulu', y: 70, category: 'Entertainment' },
      { name: 'Spotify', y: 50, category: 'Entertainment' },
      { name: 'Electric Bill', y: 150, category: 'Utilities' },
      { name: 'Water Bill', y: 60, category: 'Utilities' },
      { name: 'Adobe Subscription', y: 200, category: 'Software' },
      { name: 'Microsoft 365', y: 100, category: 'Software' },
      { name: 'Grocery', y: 80, category: 'Other' },
      { name: 'Phone Bill', y: 70, category: 'Other' }
    ];

    const annualData = [
      { name: 'The Onion', y: 14, category: 'Entertainment' },
      { name: 'New Yorker', y: 20, category: 'Entertainment' }
    ];

    // Summing annual costs by category
    const annualCategoryData = {};
    annualData.forEach(point => {
      if (!annualCategoryData[point.category]) {
          annualCategoryData[point.category] = {
              total: 0,
              charges: []
          };
      }
      annualCategoryData[point.category].total += point.y;
      annualCategoryData[point.category].charges.push(point);
    });

    const categoryColors = {
      Entertainment: '#FF0000',
      Utilities: '#0000FF',
      Software: '#008000',
      Other: '#FFA500',
      Unknown: '#A52A2A',
      Ending_Service: '#000000',
      Check: '#800080'
    };

    const categoryData = {};

    monthlyData.forEach(point => {
      if (!categoryData[point.category]) {
          categoryData[point.category] = {
              total: 0,
              charges: []
          };
      }
      categoryData[point.category].total += point.y;
      categoryData[point.category].charges.push(point);
    });

    // console.log(categoryData);

    const seriesData = Object.keys(categoryData).map(category => {
      const categoryInfo = categoryData[category];
      categoryInfo.charges.sort((a, b) => b.y - a.y);
      
      return {
        name: category,
        y: categoryInfo.total,
        color: categoryColors[category],
        topCharges: categoryInfo.charges.slice(0, 5),
        annualNote: annualCategoryData[category]
          ? `Annual costs: $${annualCategoryData[category].total} (${annualCategoryData[category].charges.map(a => a.name).join(', ')})`
          : ''
      };
    });

    function tooltipFormatter() {
      const topCharges = this.point.topCharges.map(point => `${point.name}: $${point.y}`).join('<br>');
      const annualNote = this.point.annualNote ? `<br><br>${this.point.annualNote}` : '';

      return `<b>${this.point.name}</b><br>Total: $${this.y}<br>Top 5:<br>${topCharges}${annualNote}`;
    }

    Highcharts.chart('containerX', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Monthly Subscription Costs by Category'
      },
      tooltip: {
        useHTML: true,
        formatter: tooltipFormatter
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: ${point.y:.2f} ({point.percentage:.1f}%)'
          }
        }
      },
      series: [{
        name: 'Costs',
        colorByPoint: true,
        data: seriesData
      }]
    });
});