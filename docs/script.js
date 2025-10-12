// Store items and their rankings in localStorage
const taglines = [
  "How to eat an elephant — one bite at a time, says the wise anaconda",
  "If you don't have half your work done by 10 o'clock, you're in danger of not getting the other half done — Wuthering B. Heights",
  "A journey of a thousand tasks begins with a single checkbox — Ancient PM",
  "Time waits for no one, but it does take coffee breaks — Office Zen",
  "The early bird gets the worm, the second mouse gets the cheese — Risk Management 101",
  "Don't put off until tomorrow what you can delegate today — Modern Wisdom",
  "A task without a deadline is like a pizza without cheese — Italian Productivity",
  "Keep your friends close and your deadlines closer — The Prioritizer",
  "Rome wasn't built in a day, but they had a great project manager — Historical Facts*",
  "The best time to plant a task was 20 years ago. The second best time is now — Garden of Productivity"
];

let typed;
let currentTaglineIndex = 0;

function initTyped() {
  typed = new Typed('#typed', {
    strings: [taglines[0]],
    typeSpeed: 40,
    backSpeed: 20,
    showCursor: true,
    cursorChar: '_',
    loop: false
  });
}

function rerollTagline() {
  currentTaglineIndex = (currentTaglineIndex + 1) % taglines.length;
  typed.destroy();
  typed = new Typed('#typed', {
    strings: [taglines[currentTaglineIndex]],
    typeSpeed: 40,
    backSpeed: 20,
    showCursor: true,
    cursorChar: '_',
    loop: false
  });
}

// Auto-rotate taglines every 15 seconds
setInterval(() => {
  rerollTagline();
}, 15000);

let items = JSON.parse(localStorage.getItem('matrixItems')) || {
  'urgent-important': [],
  'not-urgent-important': [],
  'urgent-not-important': [],
  'not-urgent-not-important': []
};

let checkedItems = JSON.parse(localStorage.getItem('checkedItems')) || [];

let rankings = JSON.parse(localStorage.getItem('rankings')) || {
  urgency: [],
  impact: [],
  ease: [],
  advantage: [],
  engagement: []
};

// Initialize the application
function init() {
  initMatrix();
  initTabs();
  initCriteriaTabs();
  setupDragAndDrop();
  updateAllLists();
}

// Initialize main navigation tabs
function initTabs() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
    });
  });
}

// Initialize criteria tabs in the Prioritize section
function initCriteriaTabs() {
  document.querySelectorAll('.criteria-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.criteria-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.criteria-content').forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`${tab.dataset.criteria}-list`).classList.add('active');
    });
  });
}

// Initialize the matrix
function initMatrix() {
  Object.keys(items).forEach(quadrant => {
    const quadrantEl = document.querySelector(`[data-quadrant="${quadrant}"] .items`);
    items[quadrant].forEach(item => {
      addItemToQuadrant(item, quadrantEl);
    });
  });
}

// Add new item
function addItem() {
  const input = document.getElementById('newItem');
  const text = input.value.trim();
  
  if (text) {
    // Add to first quadrant by default
    const firstQuadrant = document.querySelector('#q1 .items');
    addItemToQuadrant(text, firstQuadrant);
    items['urgent-important'].push(text);
    
    // Add to all ranking lists
    Object.keys(rankings).forEach(criteria => {
      rankings[criteria].push(text);
    });
    
    saveAll();
    updateAllLists();
    
    // Clear input
    input.value = '';
  }
}

// Add item to specific quadrant
function addItemToQuadrant(text, quadrant) {
  const item = document.createElement('div');
  item.className = 'item';
  item.draggable = true;
  item.textContent = text;
  
  // Create actions container
  const actions = document.createElement('div');
  actions.className = 'item-actions';
  
  // Add check button
  const checkBtn = document.createElement('span');
  checkBtn.innerHTML = '<i class="bi bi-check2"></i>';
  checkBtn.className = 'check';
  checkBtn.onclick = (e) => {
    e.stopPropagation();
    const isChecked = checkedItems.includes(text);
    if (isChecked) {
      checkedItems = checkedItems.filter(item => item !== text);
      item.classList.remove('checked');
    } else {
      checkedItems.push(text);
      item.classList.add('checked');
    }
    saveAll();
    updateRevisitList();
  };
  
  // Add delete button
  const deleteBtn = document.createElement('span');
  deleteBtn.innerHTML = '×';
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    checkedItems = checkedItems.filter(item => item !== text);
    item.remove();
    removeItemFromAll(text);
    saveAll();
    updateAllLists();
    updateRevisitList();
  };
  
  // Add buttons to actions container
  actions.appendChild(checkBtn);
  actions.appendChild(deleteBtn);
  item.appendChild(actions);
  
  // Check if item is in checkedItems
  if (checkedItems.includes(text)) {
    item.classList.add('checked');
  }
  
  quadrant.appendChild(item);
}

// Remove item from all storage
function removeItemFromAll(text) {
  // Remove from quadrants
  Object.keys(items).forEach(quadrant => {
    items[quadrant] = items[quadrant].filter(item => item !== text);
  });
  
  // Remove from rankings
  Object.keys(rankings).forEach(criteria => {
    rankings[criteria] = rankings[criteria].filter(item => item !== text);
  });
}

function setupDragAndDrop() {
  // Initialize Sortable for each quadrant
  document.querySelectorAll('.quadrant .items').forEach(quadrant => {
    new Sortable(quadrant, {
      group: 'matrix',
      animation: 150,
      ghostClass: 'dragging',
      onEnd: (evt) => {
        // Update items object from current DOM state
        Object.keys(items).forEach(quadrant => {
          const quadrantEl = document.querySelector(`[data-quadrant="${quadrant}"] .items`);
          items[quadrant] = Array.from(quadrantEl.children).map(item => 
            item.textContent.replace(' ×', '')
          );
        });
        saveAll();
      }
    });
  });

  // Initialize Sortable for each ranking list
  document.querySelectorAll('.sortable-list').forEach(list => {
    new Sortable(list, {
      group: {
        name: 'rankings',
        pull: false,
        put: false
      },
      animation: 150,
      ghostClass: 'dragging',
      onEnd: (evt) => {
        const criteria = evt.target.closest('.criteria-content').id.replace('-list', '');
        rankings[criteria] = Array.from(evt.target.children).map(item => 
          item.textContent.replace(' ×', '')
        );
        saveAll();
        autoAssignQuadrants();
      }
    });
  });
}


// Update rankings based on list order
function updateRankings() {
  Object.keys(rankings).forEach(criteria => {
    const list = document.querySelector(`#${criteria}-list .sortable-list`);
    if (list) {
      rankings[criteria] = Array.from(list.children).map(item => item.textContent.replace(' ×', ''));
    }
  });
  
  saveAll();
  autoAssignQuadrants();
}

// Auto-assign items to quadrants based on urgency and impact rankings
function autoAssignQuadrants() {
  const urgencyMedian = Math.floor(rankings.urgency.length / 2);
  const impactMedian = Math.floor(rankings.impact.length / 2);
  
  // Clear current quadrants
  Object.keys(items).forEach(quadrant => {
    items[quadrant] = [];
  });
  
  // Assign items based on their position in urgency and impact rankings
  rankings.urgency.forEach((item, urgencyIndex) => {
    const impactIndex = rankings.impact.indexOf(item);
    
    if (urgencyIndex < urgencyMedian) {
      if (impactIndex < impactMedian) {
        items['urgent-important'].push(item);
      } else {
        items['urgent-not-important'].push(item);
      }
    } else {
      if (impactIndex < impactMedian) {
        items['not-urgent-important'].push(item);
      } else {
        items['not-urgent-not-important'].push(item);
      }
    }
  });
  
  // Update the matrix display
  updateMatrix();
}

// Update the matrix display
function updateMatrix() {
  document.querySelectorAll('.quadrant .items').forEach(quadrant => {
    quadrant.innerHTML = '';
  });
  
  Object.keys(items).forEach(quadrant => {
    const quadrantEl = document.querySelector(`[data-quadrant="${quadrant}"] .items`);
    items[quadrant].forEach(item => {
      addItemToQuadrant(item, quadrantEl);
    });
  });
}

// Update all ranking lists
function updateAllLists() {
  Object.keys(rankings).forEach(criteria => {
    const list = document.querySelector(`#${criteria}-list .sortable-list`);
    if (list) {
      list.innerHTML = '';
      rankings[criteria].forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'item';
        itemEl.draggable = true;
        itemEl.textContent = item;
        
        const deleteBtn = document.createElement('span');
        deleteBtn.innerHTML = ' ×';
        deleteBtn.style.float = 'right';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          removeItemFromAll(item);
          saveAll();
          updateAllLists();
        };
        
        itemEl.appendChild(deleteBtn);
        list.appendChild(itemEl);
      });
    }
  });
  
  setupDragAndDrop();
}

// Save all data
function saveAll() {
  localStorage.setItem('matrixItems', JSON.stringify(items));
  localStorage.setItem('rankings', JSON.stringify(rankings));
  localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
}

// Update the revisit list
function updateRevisitList() {
  const revisitList = document.querySelector('.revisit-list');
  revisitList.innerHTML = '';
  
  checkedItems.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'item checked';
    itemEl.textContent = item;
    
    const actions = document.createElement('div');
    actions.className = 'item-actions';
    
    const uncheckBtn = document.createElement('span');
    uncheckBtn.innerHTML = '<i class="bi bi-check2"></i>';
    uncheckBtn.className = 'check';
    uncheckBtn.onclick = (e) => {
      e.stopPropagation();
      checkedItems = checkedItems.filter(i => i !== item);
      saveAll();
      updateRevisitList();
      updateMatrix();
    };
    
    const deleteBtn = document.createElement('span');
    deleteBtn.innerHTML = '×';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      checkedItems = checkedItems.filter(i => i !== item);
      removeItemFromAll(item);
      saveAll();
      updateAllLists();
      updateRevisitList();
    };
    
    actions.appendChild(uncheckBtn);
    actions.appendChild(deleteBtn);
    itemEl.appendChild(actions);
    revisitList.appendChild(itemEl);
  });
}

// Add keyboard support
document.getElementById('newItem').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addItem();
  }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Command/Ctrl + A to focus add field
  if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
    e.preventDefault(); // Prevent default select all behavior
    document.getElementById('newItem').focus();
  }
  
  // Command/Ctrl + Enter to submit
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault();
    addItem();
  }
});

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
  init();
  initTyped();
});