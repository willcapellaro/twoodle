const STORAGE_KEY = "subscriptions";
let table;

// Load data from localStorage
function loadData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Save data to localStorage (now uses DataTables data)
function saveData() {
    const data = table.rows().data().toArray();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    renderCharts(data); // Update charts after saving
}

function createDataTable(data) {
    if ($.fn.DataTable.isDataTable('#subscription-table')) {
        table.destroy();
    }

    table = $('#subscription-table').DataTable({
        data: data,
        columns: [
            { title: "Active", data: "active", render: (data) => `<input type="checkbox" ${data ? "checked" : ""}>` },
            { title: "Name", data: "name", render: (data) => `<input type="text" value="${data || ''}">` },
            { title: "Cost ($)", data: "cost", render: (data) => `<input type="number" class="tabulation right" value="${data || ''}">` },
            { title: "Period", data: "period", render: (data) => `<select><option value="monthly" ${data === "monthly" ? "selected" : ""}>Monthly</option><option value="annual" ${data === "annual" ? "selected" : ""}>Annual</option><option value="other" ${data === "other" ? "selected" : ""}>Other</option></select>` },
            { title: "Charge Date", data: "chargeDate", render: (data) => `<input type="date" value="${data || ''}">` },
            { title: "Category", data: "category", render: (data) => `<select><option value="entertainment" ${data === "entertainment" ? "selected" : ""}>🔴 Entertainment</option><option value="utilities" ${data === "utilities" ? "selected" : ""}>🔵 Utilities</option><option value="software" ${data === "software" ? "selected" : ""}>🟢 Software</option><option value="other" ${data === "other" ? "selected" : ""}>🟠 Other</option><option value="unknown" ${data === "unknown" ? "selected" : ""}>🟤 Unknown</option><option value="ending_service" ${data === "ending_service" ? "selected" : ""}>⚫ Ending Service</option><option value="check" ${data === "check" ? "selected" : ""}>🟣 Check</option></select>` },
            { title: "Account", data: "account", render: (data) => `<select><option value="me" ${data === "me" ? "selected" : ""}>me</option><option value="not me" ${data === "not me" ? "selected" : ""}>not me</option></select>` },
            { title: "Notes", data: "notes", render: (data) => `<input type="text" value="${data || ''}">` },
        ],
        paging: false,
        searching: false,
        info: false,
        responsive: true,
        initComplete: function () {
            // Call saveData after initial table creation to store empty data if there is none
            if (loadData().length === 0) {
                saveData();
            }
        }
    });

    // Event handler for saving data
    $('#subscription-table tbody').on('change', 'input, select', function () {
      const row = table.row($(this).parents('tr'));
      const data = row.data();
      const colIndex = $(this).closest('td').index();
      const colName = table.settings().init().columns[colIndex].data;
      if ($(this).is(':checkbox')) {
        data[colName] = $(this).prop('checked');
      } else {
        data[colName] = $(this).val();
      }
      row.data(data).draw();
      saveData();
    });
}

// ... (renderCharts function remains the same)

function clearData() {
    localStorage.removeItem(STORAGE_KEY);
    createDataTable([]);
    renderCharts([]);
    alert("All data cleared!");
}

function initializeApp() {
    const savedData = loadData();
    createDataTable(savedData);
}

initializeApp();