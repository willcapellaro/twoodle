// Initialize the MDC Tab Bar
const tabBar = new mdc.tabBar.MDCTabBar(document.querySelector('.mdc-tab-bar'));

// Listen for tab changes
tabBar.listen('MDCTabBar:activated', function(event) {
  const tabIndex = event.detail.index;
  switchTabContent(tabIndex);
});

// Function to switch tab content based on the selected tab
function switchTabContent(tabIndex) {
  // Hide all divs
  document.getElementById("ItemsDiv").style.display = "none";
  document.getElementById("rateYDiv").style.display = "none";
  document.getElementById("rateXDiv").style.display = "none";
  document.getElementById("resultsDiv").style.display = "none";

  // Show the correct div based on the selected tab index
  switch (tabIndex) {
    case 0:
      document.getElementById("ItemsDiv").style.display = "block";
      break;
    case 1:
      document.getElementById("rateYDiv").style.display = "block";
      break;
    case 2:
      document.getElementById("rateXDiv").style.display = "block";
      break;
    case 3:
      document.getElementById("resultsDiv").style.display = "block";
      break;
    default:
      break;
  }
}