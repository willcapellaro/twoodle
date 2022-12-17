var yItemsListSortable = new Sortable.default([], {
    draggable: 'div'
});
yItemsListSortable.on('sortable:start', function(){
    document.getElementById('yItemsList').classList.remove('valuesListSortableStop');
    document.getElementById('yItemsList').classList.add('valuesListSortableStart');
});
yItemsListSortable.on('sortable:stop', function(){
    document.getElementById('yItemsList').classList.remove('valuesListSortableStart');
    document.getElementById('yItemsList').classList.add('valuesListSortableStop');
    getIdsOrder('y');
});

var xItemsListSortable = new Sortable.default([], {
    draggable: 'div'
});
xItemsListSortable.on('sortable:start', function(){
    document.getElementById('xItemsList').classList.remove('valuesListSortableStop');
    document.getElementById('xItemsList').classList.add('valuesListSortableStart');
});
xItemsListSortable.on('sortable:stop', function(){
    document.getElementById('xItemsList').classList.remove('valuesListSortableStart');
    document.getElementById('xItemsList').classList.add('valuesListSortableStop');
    getIdsOrder('x');
});