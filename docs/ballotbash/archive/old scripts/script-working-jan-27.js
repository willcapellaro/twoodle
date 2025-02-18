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

            const tableData = data.map(item => {
                const names = [item.name, item.name2, item.name3, item.name4, item.name5]
                    .filter(Boolean)
                    .join(', ');

                const voteKey = `${item.category}-${names}`;
                const storedVote = storedVotes.votes[voteKey] || 0;

                return {
                    award: item.category || '',
                    names: names,
                    film: item.film || '',
                    vote: `<input type="checkbox" class="vote" data-vote="${storedVote}" ${storedVote === 1 ? "checked" : ""} />` // Load stored votes
                };
            });

            // Initialize DataTable
            const table = $('#ballotTable').DataTable({
                data: tableData,
                columns: [
                    { data: 'award', title: 'Award' },
                    { data: 'names', title: 'Name(s)' },
                    { data: 'film', title: 'Film' },
                    { 
                        data: 'vote', 
                        title: 'Vote', 
                        orderable: true,
                        orderDataType: 'vote-sort' 
                    }
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
                },
                rowCallback: function (row, data) {
                    // Log each row's data for debugging purposes
                    console.log(data);
            
                    // Add the music field to the "Film" column for Best Original Song
                    if (data.award === "Best Original Song" && data.music) {
                        const filmCell = $('td', row).eq(2); // Select the Film column
                        filmCell.html(`${filmCell.html()} <br><small>${data.music}</small>`); // Append the song name
                    }
                }
            });

            

            // Update group based on sorting
            $('#ballotTable').on('order.dt', function () {
                const order = table.order();
                const dataSrc =
                    order[0][0] === 0
                        ? 'award'
                        : order[0][0] === 1
                        ? 'names'
                        : 'film';
                table.rowGroup().dataSrc(dataSrc);
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

            // Custom sorting for Your Vote column
            $.fn.dataTable.ext.order['vote-sort'] = function (settings, col) {
                return this.api()
                    .column(col, { order: 'index' })
                    .nodes()
                    .map(td => {
                        const voteState = $(td).find('input.vote').data('vote');
                        return voteState === 1 ? 0 : voteState === 2 ? 1 : 2;
                    });
            };
        })
        .fail(function (jqxhr, textStatus, error) {
            console.error('Failed to load JSON:', textStatus, error);
        });
});