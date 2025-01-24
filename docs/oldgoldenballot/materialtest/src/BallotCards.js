import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const BallotCards = ({ data }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {data.map((category, idx) => (
        <Card key={idx} style={{ width: '300px' }}>
          <CardContent>
            <Typography variant="h5">{category.category}</Typography>
            <Select fullWidth>
              {category.candidates.map((candidate, cIdx) => (
                <MenuItem key={cIdx} value={candidate.name}>
                  {candidate.name} ({candidate.party})
                </MenuItem>
              ))}
            </Select>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BallotCards;