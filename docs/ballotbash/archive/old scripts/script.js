$(document).ready(function () {
    // Initialize local storage
    const defaultData = {
        votes: {} // Store votes keyed by category and names
    };

    const initializeData = () => {
        if (!localStorage.getItem("oscarsVotes")) {
            localStorage.setItem("oscarsVotes", JSON.stringify(defaultData));
        }
    };

    const saveVotes = (votes) => {
        localStorage.setItem("oscarsVotes", JSON.stringify(votes));
    };

    const loadVotes = () => {
        return JSON.parse(localStorage.getItem("oscarsVotes")) || defaultData;
    };

    initializeData(); // Ensure local storage is initialized

    // Load JSON data
    $.getJSON('Golden_Ballot_Data.json')
        .done(function (data) {
            console.log('Data loaded successfully:', data);

            const storedVotes = loadVotes();

            const tableData = data.map(item => ({
                award: item.category || '',
                names: [item.name, item.name2, item.name3, item.name4, item.name5]
                    .filter(Boolean)
                    .join(', '),
                film: item.film || '',
                music: item.music || '', // Ensure the music field is included
                vote: `<input type="checkbox" class="vote" data-vote="${storedVotes.votes[item.category] || 0}" />`
            }));

            // Initialize DataTable
        // Initialize DataTable
const table = $('#ballotTable').DataTable({
    data: tableData,
    columns: [
        { data: 'award', title: 'Award' },
        { data: 'names', title: 'Name(s)' },
        { data: 'film', title: 'Film' },
        { data: 'vote', title: 'Vote' }
    ],
    order: [[0, 'asc']],
    pageLength: 200,
    rowGroup: {
        dataSrc: 'award',
        startRender: function (rows, group) {
            return $('<tr/>')
                .append(`<td colspan="4" class="group-heading">${group}</td>`)
                .get(0);
        }
    }
});

// Inject the music field for "Best Original Song" rows
function injectMusic() {
    console.log('Running injectMusic...');
    $('#ballotTable tbody tr').each(function () {
        const rowData = table.row(this).data(); // Get the row data
        if (rowData && rowData.award === "Best Original Song" && rowData.music) {
            const filmCell = $(this).find('td').eq(2); // Locate the Film column
            // Avoid duplicate injection
            if (!filmCell.find('small').length) {
                filmCell.append(`<br><small>${rowData.music}</small>`); // Append music field
            }
        }
    });
}

// Call the injection function after the table is fully rendered
injectMusic();

// Reapply music injection on table redraw
table.on('draw', function () {
    injectMusic();
});

            // Save votes to local storage on interaction
            $(document).on('click', 'input.vote', function () {
                const stateMapping = {
                    0: { next: 1, label: 'Your Pick', checked: true, indeterminate: false },
                    1: { next: 2, label: 'Safety', checked: false, indeterminate: true },
                    2: { next: 0, label: '', checked: false, indeterminate: false }
                };

                const currentState = $(this).data('vote') || 0;
                const nextState = stateMapping[currentState];

                $(this)
                    .data('vote', nextState.next)
                    .prop('checked', nextState.checked)
                    .prop('indeterminate', nextState.indeterminate);

                const label = $(this).next('.vote-label');
                if (label.length === 0) {
                    $(this).after(`<span class="vote-label">${nextState.label}</span>`);
                } else {
                    label.text(nextState.label);
                }

                // Save updated votes to local storage
                const updatedVotes = loadVotes();
                const key = `${$(this).closest('tr').find('td:first-child').text()}-${$(this)
                    .closest('tr')
                    .find('td:nth-child(2)')
                    .text()}`;
                updatedVotes.votes[key] = nextState.next;
                saveVotes(updatedVotes);
            });
        })
        .fail(function (jqxhr, textStatus, error) {
            console.error('Failed to load JSON:', textStatus, error);
        });
});