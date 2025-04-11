// src/pages/AllRequestsPage.js
import React from 'react';
import { Box, Typography } from '@mui/material';

function AllRequestsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">All Requests</Typography>
      <Typography variant="subtitle1">
        This page will display all requests (not just the recent ones).
      </Typography>
      {/*  We'll add the table and data fetching here later. */}
    </Box>
  );
}

export default AllRequestsPage;