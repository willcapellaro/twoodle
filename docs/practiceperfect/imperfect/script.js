// Example card data with key points and script
const exampleData = [
  {
    title: "Greeting",
    tags: "speech, intro",
    keyPoints: ["Welcome everyone!", "Set a positive tone"],
    script: "Hello, everyone! Welcome to our event. Let's have a great time!"
  },
  {
    title: "Closing",
    tags: "end, speech",
    keyPoints: ["Thank the audience", "End on a high note"],
    script: "Thank you for attending, and have a great day!"
  }
];
let cardsData = [...exampleData];
let lastSubmittedContent = ''; // Track the last submitted content

// Load cards into the Practice column
function loadCards() {
  const cardsContainer = document.getElementById('cards');
  cardsContainer.innerHTML = '';
  cardsData.forEach(({ title, tags, keyPoints, sections, script }) => {
    const situation = sections.SSS.map(text => `<p>${text}</p>`).join('');
    const task = sections.TTT.map(text => `<p>${text}</p>`).join('');
    const actions = sections.AAA.map(text => `<p>${text}</p>`).join('');
    const results = sections.RRR.map(text => `<p>${text}</p>`).join('');
    const experience = sections.EEE.map(text => `<p>${text}</p>`).join('');

    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h3>${title}</h3>
      <div class="tags">${tags}</div>
      <div class="sections">
        <div class="section situation" style="background-color: #f8d7da;">
          <h4>Situation</h4>
          ${situation}
        </div>
        <div class="section task" style="background-color: #d1ecf1;">
          <h4>Task</h4>
          ${task}
        </div>
        <div class="section actions" style="background-color: #d4edda;">
          <h4>Actions</h4>
          ${actions}
        </div>
        <div class="section results" style="background-color: #fff3cd;">
          <h4>Results</h4>
          ${results}
        </div>
        <div class="section experience" style="background-color: #e2e3e5;">
          <h4>Experience & Evaluation</h4>
          ${experience}
        </div>
      </div>
      <div class="key-points">
        <h4>Key Points</h4>
        <ul>
          ${keyPoints.map(point => `<li>${point}</li>`).join('')}
        </ul>
      </div>
      <div class="script">
        <h4>Additional Text</h4>
        ${script.split('\n').map(paragraph => `<p>${paragraph.trim()}</p>`).join('')}
      </div>
    `;
    cardsContainer.appendChild(card);
  });
}

// Generate markdown from cards data
function generateMarkdown() {
  return cardsData
    .map(({ title, tags, keyPoints, sections, script }) => {
      const situation = sections.SSS.map(line => `SSS ${line}`).join('\n');
      const task = sections.TTT.map(line => `TTT ${line}`).join('\n');
      const actions = sections.AAA.map(line => `AAA ${line}`).join('\n');
      const results = sections.RRR.map(line => `RRR ${line}`).join('\n');
      const experience = sections.EEE.map(line => `EEE ${line}`).join('\n');
      const keyPointsMarkdown = keyPoints.map(point => `- ${point}`).join('\n');

      return [
        title,
        tags,
        situation,
        task,
        actions,
        results,
        experience,
        keyPointsMarkdown,
        script, // Regular script text
      ]
        .filter(Boolean) // Remove empty sections
        .join('\n');
    })
    .join('\n\n'); // Separate cards with double newlines
}

// Update the markdown text area with current cards data
function updateMarkdownField() {
  const markdownContent = generateMarkdown();
  document.getElementById('compose-area').value = markdownContent;
}

// Save to local storage
function saveToLocalStorage() {
  localStorage.setItem('cardsData', JSON.stringify(cardsData));
}

// Load from local storage
function loadFromLocalStorage() {
  const data = localStorage.getItem('cardsData');
  if (data) {
    cardsData = JSON.parse(data);
  }
}

// Parse markdown into card data
function parseMarkdown(markdown) {
  return markdown.split('\n\n').map(block => {
    const [title, tags, ...lines] = block.split('\n');
    const keyPoints = [];
    let script = '';
    const sections = { SSS: [], TTT: [], AAA: [], RRR: [], EEE: [] };

    lines.forEach(line => {
      if (line.startsWith('SSS')) {
        sections.SSS.push(line.slice(3).trim());
      } else if (line.startsWith('TTT')) {
        sections.TTT.push(line.slice(3).trim());
      } else if (line.startsWith('AAA')) {
        sections.AAA.push(line.slice(3).trim());
      } else if (line.startsWith('RRR')) {
        sections.RRR.push(line.slice(3).trim());
      } else if (line.startsWith('EEE')) {
        sections.EEE.push(line.slice(3).trim());
      } else if (line.startsWith('-')) {
        keyPoints.push(line.slice(1).trim());
      } else {
        script += `${line.trim()}\n`;
      }
    });

    return {
      title: title.trim(),
      tags: tags.trim(),
      keyPoints,
      sections,
      script: script.trim(),
    };
  });
}

// Handle visibility toggles for Key Points and Script
function handleToggles() {
  const showKeyPoints = document.getElementById('toggle-key-points').checked;
  const showScript = document.getElementById('toggle-script').checked;

  document.querySelectorAll('.key-points').forEach(div => {
    div.style.display = showKeyPoints ? 'block' : 'none';
  });

  document.querySelectorAll('.script').forEach(div => {
    div.style.display = showScript ? 'block' : 'none';
  });
}

// Handle search filtering
function handleSearch() {
  const query = document.getElementById('search').value.toLowerCase();
  const searchType = document.getElementById('search-type').value;

  document.querySelectorAll('.card').forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const tags = card.querySelector('.tags').textContent.toLowerCase();
    const match = searchType === 'all'
      ? title.includes(query) || tags.includes(query)
      : title.includes(query) || tags.includes(query);
    card.style.display = match ? 'block' : 'none';
  });
}

// Update tag filters based on cards data
function updateTagFilters() {
  const tagFiltersContainer = document.getElementById('tag-filters');
  tagFiltersContainer.innerHTML = ''; // Clear existing tags

  const uniqueTags = Array.from(
    new Set(cardsData.flatMap(card => card.tags.split(',').map(tag => tag.trim())))
  ).sort(); // Remove duplicates and sort alphabetically

  const clearButton = document.createElement('button');
  clearButton.textContent = 'Clear Filters';
  clearButton.classList.add('clear-filters');
  clearButton.addEventListener('click', () => {
    document.getElementById('search').value = '';
    handleSearch(); // Reset search results
  });
  tagFiltersContainer.appendChild(clearButton);

  uniqueTags.forEach(tag => {
    const button = document.createElement('button');
    button.textContent = tag;
    button.addEventListener('click', () => {
      document.getElementById('search').value = tag;
      document.getElementById('search-type').value = 'title-tags';
      handleSearch();
    });
    tagFiltersContainer.appendChild(button);
  });
}

// Handle submit button click
document.getElementById('submit').addEventListener('click', function () {
  const submitButton = this;
  let composeContent = document.getElementById('compose-area').value.trimEnd();

  if (composeContent === lastSubmittedContent) {
    document.getElementById('compose-area').value = composeContent;
    submitButton.textContent = 'Nothing to update';
    submitButton.style.backgroundColor = '#ccc';
    setTimeout(() => {
      submitButton.textContent = 'Submit';
      submitButton.style.backgroundColor = '#007bff';
    }, 2000);
    return;
  }

  try {
    cardsData = parseMarkdown(composeContent);
    loadCards();
    saveToLocalStorage();
    updateMarkdownField();
    updateTagFilters();

    lastSubmittedContent = composeContent;
    submitButton.textContent = 'Success! Updated!';
    submitButton.style.backgroundColor = '#4CAF50';
    setTimeout(() => {
      submitButton.textContent = 'Submit';
      submitButton.style.backgroundColor = '#007bff';
    }, 2000);
  } catch (error) {
    submitButton.textContent = 'Uh uh!';
    submitButton.style.backgroundColor = '#FF6347';
    setTimeout(() => {
      submitButton.textContent = 'Submit';
      submitButton.style.backgroundColor = '#007bff';
    }, 2000);
  }
});

// Single DOMContentLoaded listener
window.addEventListener('DOMContentLoaded', function () {
  loadFromLocalStorage();
  loadCards();
  updateMarkdownField();
  updateTagFilters();
  handleToggles();

  // Attach search input listener
  document.getElementById('search').addEventListener('input', handleSearch);
});


document.getElementById('toggle-compose-column').addEventListener('click', function () {
  const composeColumn = document.getElementById('compose-column');
  const isCollapsed = composeColumn.classList.toggle('collapsed');

  this.textContent = isCollapsed ? 'Expand' : 'Collapse';
});

document.getElementById('toggle-button').addEventListener('click', function () {
  const composeColumn = document.getElementById('compose-column');
  const practiceColumn = document.getElementById('practice-column');
  const isCollapsed = composeColumn.classList.toggle('collapsed');

  // Adjust button text
  this.textContent = isCollapsed ? 'Expand' : 'Collapse';

  // Adjust practice column flex-grow to take up the space
  practiceColumn.style.flex = isCollapsed ? '1' : '3';

  // Store the state in localStorage
  localStorage.setItem('composeColumnCollapsed', isCollapsed);
});

window.addEventListener('DOMContentLoaded', function () {
  loadFromLocalStorage();
  loadCards();
  updateMarkdownField();
  updateTagFilters();
  handleToggles();

  // Restore collapse state
  const isCollapsed = localStorage.getItem('composeColumnCollapsed') === 'true';
  const composeColumn = document.getElementById('compose-column');
  const practiceColumn = document.getElementById('practice-column');
  const toggleButton = document.getElementById('toggle-button');

  if (isCollapsed) {
    composeColumn.classList.add('collapsed');
    practiceColumn.style.flex = '1';
    toggleButton.textContent = 'Expand';
  } else {
    composeColumn.classList.remove('collapsed');
    practiceColumn.style.flex = '3';
    toggleButton.textContent = 'Collapse';
  }
});

document.getElementById('toggle-button').addEventListener('click', function () {
  const composeColumn = document.getElementById('compose-column');
  const practiceColumn = document.getElementById('practice-column');
  const isCollapsed = composeColumn.classList.toggle('collapsed');

  // Adjust button text
  this.textContent = isCollapsed ? 'Expand' : 'Collapse';

  // Adjust practice column flex-grow to take up the space
  practiceColumn.style.flex = isCollapsed ? '1' : '3';

  // Store the state in localStorage
  localStorage.setItem('composeColumnCollapsed', isCollapsed);
});

// Show card in a modal
document.getElementById('cards').addEventListener('click', function (e) {
  const card = e.target.closest('.card');
  if (!card) return;

  // Populate modal
  document.getElementById('modal-title').textContent = card.querySelector('h3').textContent;
  document.getElementById('modal-tags').textContent = card.querySelector('.tags').textContent;
  document.getElementById('modal-key-points').innerHTML = card.querySelector('.key-points').innerHTML;
  document.getElementById('modal-script').innerHTML = card.querySelector('.script').innerHTML;

  // Show modal
  document.getElementById('card-modal').style.display = 'flex';
});

// Close modal
document.getElementById('modal-close').addEventListener('click', function () {
  document.getElementById('card-modal').style.display = 'none';
});