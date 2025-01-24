import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const BallotTable = ({ data }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Candidate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((category, idx) => (
            <TableRow key={idx}>
              <TableCell>{category.category}</TableCell>
              <TableCell>
                <Select fullWidth>
                  {category.candidates.map((candidate, cIdx) => (
                    <MenuItem key={cIdx} value={candidate.name}>
                      {candidate.name} ({candidate.party})
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BallotTable;