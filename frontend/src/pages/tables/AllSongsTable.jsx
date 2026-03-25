import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

import { useUser } from "../../components/UserContext";

import "./Table.css";

const columns = [
  { field: 'slno', headerName: 'Sl.No.', width: 100 }, // Serial Number column
  { field: 'fullname', headerName: 'Full Name', width: 300 },
  { field: 'email', headerName: 'Email', width: 300 },
  { field: 'created_at', headerName: 'Created At', width: 300 },
];

const paginationModel = { page: 0, pageSize: 10 };

export default function DataTable() {
  const [rows, setRows] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_GET_USER_DATA, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const transformedData = data.users.map((user, index) => ({
            slno: index + 1, // Add serial number starting from 1
            id: user.id, // Required for DataGrid row identification
            fullname: user.fullname,
            email: user.email,
            created_at: user.created_at,
          }));
          setRows(transformedData);
        } else {
          console.error("Failed to fetch data", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user.email]);

  return (
    <Paper
      sx={{
        height: 700,
        width: '90%',
        margin: 'auto',
        textAlign: 'center',
        alignContent: 'center',
        padding: '25px',
      }}
    >
      <h1>Total Uploaded Songs</h1>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{
          '& .MuiDataGrid-root': {
            fontSize: '20px',
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'red',
            color: 'black',
            fontSize: '20px',
            fontWeight: 'bolder',
            textAlign: 'center',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            textAlign: 'center',
            fontSize: '20px',
          },
          '& .MuiDataGrid-cell': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center',
          },
          '& .MuiDataGrid-row:nth-of-type(odd)': {
            backgroundColor: '#f5f5f5',
          },
          '& .MuiDataGrid-row:nth-of-type(even)': {
            backgroundColor: '#ffffff',
          },
        }}
      />
    </Paper>
  );
}
