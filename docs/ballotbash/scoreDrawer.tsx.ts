import React, { useState, useMemo, useCallback } from 'react';
import { X, Award, Search, Trash2 } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import { useGame } from '../contexts/GameContext';
import { cn } from '../utils';
import { type Nominee } from '../types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  embedded?: boolean;
};

type RowData = {
  category: string;
  catCode: string;
  nominees: Nominee[];
  selectedId: string | null;
};

const SelectCellRenderer = React.memo((props: any) => {
  const { data, value, api } = props;
  const { actions } = useGame();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    const nominee = data.nominees.find((n: Nominee) => n.id === newValue);
    
    // If nominee is found, use its catCode, otherwise use the row's catCode
    const catCode = nominee?.catCode || data.catCode;
    
    // Call setWinner with the new value and catCode
    actions.setWinner(newValue, catCode);
    
    // Update the row data
    data.selectedId = newValue;
    
    // Refresh the grid to update the header count
    api.refreshHeader();
  };

  return (
    <select
      value={data.selectedId || ''}
      onChange={handleChange}
      className="w-full h-full border-none bg-transparent focus:outline-none"
    >
      <option value="">Select winner...</option>
      {data.nominees.map((nominee: Nominee) => (
        <option key={nominee.id} value={nominee.id}>
          {nominee.emoji && `${nominee.emoji} `}
          {nominee.film}
          {' — '}
          {nominee.names.join(', ')}
        </option>
      ))}
    </select>
  );
});

SelectCellRenderer.displayName = 'SelectCellRenderer';

export function ScoreDrawer({ isOpen, onClose, embedded = false }: Props) {
  const { state, nominees, actions } = useGame();
  const [filter, setFilter] = useState<'all' | 'remaining'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Ensure scorekeeping data exists with default empty values
  const scorekeepingData = state.playerData.default?.scorekeeping || { votes: {}, seen: [] };

  // Prepare row data
  const rowData = useMemo(() => {
    const categories = nominees.reduce((acc, nominee) => {
      if (!acc[nominee.category]) {
        acc[nominee.category] = {
          category: nominee.category,
          catCode: nominee.catCode,
          nominees: [],
          selectedId: scorekeepingData.votes[nominee.catCode] || null
        };
      }
      acc[nominee.category].nominees.push(nominee);
      return acc;
    }, {} as Record<string, RowData>);

    let rows = Object.values(categories);
    
    // Apply remaining filter if enabled
    if (filter === 'remaining') {
      rows = rows.filter(row => !row.selectedId);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      rows = rows.filter(row => 
        row.category.toLowerCase().includes(query) ||
        row.nominees.some(nominee => 
          nominee.film.toLowerCase().includes(query) ||
          nominee.names.some(name => name.toLowerCase().includes(query))
        )
      );
    }

    return rows;
  }, [nominees, scorekeepingData.votes, filter, searchQuery]);

  // Calculate completion ratio
  const completedCount = Object.keys(scorekeepingData.votes).length;
  const totalCategories = new Set(nominees.map(n => n.catCode)).size;
  const remainingCount = totalCategories - completedCount;

  const columnDefs = useMemo(() => [
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      sortable: true,
      filter: true
    },
    {
      field: 'nominees',
      headerName: 'Winner',
      flex: 2,
      cellRenderer: SelectCellRenderer,
      cellRendererParams: {
        actions
      }
    }
  ], [actions]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    suppressMovable: true
  }), []);

  const onGridReady = useCallback((params: any) => {
    params.api.sizeColumnsToFit();
  }, []);

  return (
    embedded ? (
      <div
        className="bg-white rounded-lg shadow-lg flex flex-col dark:bg-gray-800"
        style={{ height: 'calc(100vh - 300px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:bg-gray-800">
          <div>
            <p className="text-sm text-gray-600 mt-1 dark:text-gray-100 ">
              {remainingCount} of {totalCategories} categories remaining
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b space-y-4 dark:bg-gray-800">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Search categories, films, or nominees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:bg-gray-800"
            />
          </div>

          {/* Filter Toggle and Clear */}
          <div className="flex items-center justify-between dark:text-gray-50 ">
            <div className="flex rounded-lg border border-gray-200 p-1 ">
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  'px-4 py-1.5 rounded-md transition-colors',
                  filter === 'all' ? 'bg-[#A69764] text-white' : 'hover:bg-gray-50'
                )}
              >
                All
              </button>
              <button
                onClick={() => setFilter('remaining')}
                className={cn(
                  'px-4 py-1.5 rounded-md transition-colors ',
                  filter === 'remaining' ? 'bg-[#A69764] text-white' : 'hover:bg-gray-50'
                )}
              >
                Remaining
              </button>
            </div>

            <button
              onClick={() => actions.clearWinnerSelections()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 ag-theme-alpine">
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            domLayout="autoHeight"
            suppressRowHoverHighlight={true}
            rowClass="border-b border-gray-200"
            enableCellChangeFlash={true}
            animateRows={true}
          />
        </div>
      </div>
    ) : (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />
        )}

        {/* Drawer */}
        <div
          className={cn(
            'fixed right-0 top-0 h-full w-[600px] bg-white shadow-xl transform transition-transform duration-300 z-50 flex flex-col',
            isOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              
              <p className="text-sm text-gray-600 mt-1">
                {remainingCount} of {totalCategories} categories remaining
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 border-b space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="search"
                placeholder="Search categories, films, or nominees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200"
              />
            </div>

            {/* Filter Toggle and Clear */}
            <div className="flex items-center justify-between">
              <div className="flex rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={cn(
                    'px-4 py-1.5 rounded-md transition-colors',
                    filter === 'all' ? 'bg-[#A69764] text-white' : 'hover:bg-gray-50'
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('remaining')}
                  className={cn(
                    'px-4 py-1.5 rounded-md transition-colors',
                    filter === 'remaining' ? 'bg-[#A69764] text-white' : 'hover:bg-gray-50'
                  )}
                >
                  Remaining
                </button>
              </div>

              <button
                onClick={() => actions.clearWinnerSelections()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 ag-theme-alpine">
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              domLayout="autoHeight"
              suppressRowHoverHighlight={true}
              rowClass="border-b border-gray-200"
              enableCellChangeFlash={true}
              animateRows={true}
            />
          </div>
        </div>
      </>
    )
  );
}