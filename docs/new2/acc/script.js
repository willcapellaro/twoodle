// Function to cycle the checkbox state (unchecked, checked, indeterminate)
function cycleCheckbox(checkbox) {
  if (checkbox.checked) {
    checkbox.checked = false;
    checkbox.indeterminate = true;
  } else if (checkbox.indeterminate) {
    checkbox.indeterminate = false;
  } else {
    checkbox.checked = true;
  }
  saveToLocalStorage();
}

// Function to toggle high urgency (adds red background)
function toggleUrgency(urgencyCheckbox) {
  const checklistItem = urgencyCheckbox.closest('.checklist-item');
  if (urgencyCheckbox.checked) {
    checklistItem.classList.add('high-urgency');
  } else {
    checklistItem.classList.remove('high-urgency');
  }
  saveToLocalStorage();
}

// Save checklist state to local storage
function saveToLocalStorage() {
  const checklist = [];
  document.querySelectorAll('.checklist-item').forEach(item => {
    const id = item.id;
    const checkbox = item.querySelector('.checkbox');
    const urgencyCheckbox = item.querySelector('.urgency-checkbox');
    const notes = item.querySelector('.notes').value;

    checklist.push({
      id,
      checkboxState: checkbox.indeterminate ? 'indeterminate' : checkbox.checked,
      highUrgency: urgencyCheckbox.checked,
      notes
    });
  });

  const title = document.getElementById('checklistTitle').value;
  const url = document.getElementById('checklistUrl').value;
  const accessSteps = document.getElementById('accessSteps').value;
  const generalNotes = document.getElementById('generalNotes').value;

  const data = {
    title,
    url,
    accessSteps,
    generalNotes,
    checklist
  };

  localStorage.setItem('accessibilityChecklist', JSON.stringify(data));
}

// Load checklist state from local storage
function loadFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem('accessibilityChecklist'));
  if (!data) return;

  document.getElementById('checklistTitle').value = data.title;
  document.getElementById('checklistUrl').value = data.url;
  document.getElementById('accessSteps').value = data.accessSteps;
  document.getElementById('generalNotes').value = data.generalNotes;

  data.checklist.forEach(item => {
    const element = document.getElementById(item.id);
    const checkbox = element.querySelector('.checkbox');
    const urgencyCheckbox = element.querySelector('.urgency-checkbox');
    const notes = element.querySelector('.notes');

    checkbox.checked = item.checkboxState === true;
    checkbox.indeterminate = item.checkboxState === 'indeterminate';
    urgencyCheckbox.checked = item.highUrgency;
    notes.value = item.notes;

    if (item.highUrgency) {
      element.classList.add('high-urgency');
    } else {
      element.classList.remove('high-urgency');
    }
  });
}

// Visit the URL entered in the header
function jumpToUrl() {
  const url = document.getElementById('checklistUrl').value;
  if (url) {
    window.open(url, '_blank');
  }
}

// Load from local storage on page load
window.onload = function () {
  loadFromLocalStorage();
};