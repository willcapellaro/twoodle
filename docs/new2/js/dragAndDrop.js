document.addEventListener('DOMContentLoaded', function () {
    const list1 = document.getElementById('sortable-list1');
    const list2 = document.getElementById('sortable-list2');

    // Create Sortable instances for both lists
    const sortable1 = Sortable.create(list1, { animation: 150, chosenClass: "dragging" });
    const sortable2 = Sortable.create(list2, { animation: 150, chosenClass: "dragging" });
});