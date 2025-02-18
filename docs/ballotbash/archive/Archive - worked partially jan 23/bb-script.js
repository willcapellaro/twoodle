    
        $(document).ready(function () {
            // Load JSON data
            $.getJSON('Golden_Ballot_Data.json')
                .done(function (data) {
                    console.log('Data loaded successfully:', data);
                    const tableData = data.map(item => {
                        const names = [item.name, item.name2, item.name3, item.name4, item.name5]
                            .filter(Boolean)
                            .join(', ');

                        return {
                            award: item.category || '',
                            names: names,
                            film: item.film || '',
                            vote: '<input type="checkbox" class="vote" data-vote="0" />' // Default to empty
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
                                title: 'Your Vote', 
                                orderable: true,
                                orderDataType: 'vote-sort' 
                            }
                        ],
                        order: [[0, 'asc']], // Default sorting by Award
                        pageLength: 100, // Set default number of entries to display
                        rowGroup: {
                            dataSrc: 'award', // Group rows by Award
                            startRender: function (rows, group) {
                                // Add heading rows dynamically
                                return $('<tr/>')
                                    .append(`<td colspan="4" class="group-heading">${group}</td>`)
                                    .get(0);
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
                })
                .fail(function (jqxhr, textStatus, error) {
                    console.error('Failed to load JSON:', textStatus, error);
                });
            

        // Handle checkbox interaction logic
        $(document).on('click', 'input.vote', function () {
                const stateMapping = {
                    0: { next: 1, label: 'Your Pick', checked: true, indeterminate: false },
                    1: { next: 2, label: 'Backup', checked: false, indeterminate: true },
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
            });
        
            // Custom sorting for Your Vote column
            $.fn.dataTable.ext.order['vote-sort'] = function (settings, col) {
                return this.api()
                    .column(col, { order: 'index' })
                    .nodes()
                    .map(td => {
                        const voteState = $(td).find('input.vote').data('vote');
                        // Sort by Winner (1), Backup (2), Empty (0)
                        return voteState === 1 ? 0 : voteState === 2 ? 1 : 2;
                    });
            };
        });