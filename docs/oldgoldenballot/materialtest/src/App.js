import React, { useState } from 'react';
import BallotTable from './BallotTable';
import BallotCards from './BallotCards';
import ballotData from './ballotData.json';
import Button from '@mui/material/Button';

const App = () => {
  const [view, setView] = useState('card');

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => setView(view === 'card' ? 'table' : 'card')}
      >
        Switch to {view === 'card' ? 'Table' : 'Card'} View
      </Button>
      {view === 'card' ? (
        <BallotCards data={ballotData} />
      ) : (
        <BallotTable data={ballotData} />
      )}
    </div>
  );
};

export default App;