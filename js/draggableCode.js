var itemsListSortable = new Sortable.default(document.getElementById('itemsList'), {
    draggable: 'div'
});
var yItemsListSortable = new Sortable.default([], {
    draggable: 'div'
});
yItemsListSortable.on('sortable:stop', function(){
    getIdsOrder('y');
})
var xItemsListSortable = new Sortable.default([], {
    draggable: 'div'
});
xItemsListSortable.on('sortable:stop', function(){
    getIdsOrder('x');
})