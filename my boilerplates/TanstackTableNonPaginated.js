// TanStack Table Non-Paginated Boilerplate
// This is a template for a basic TanStack Table (v8+) without pagination.
// Replace the data and columns as needed for your use case.

import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

// 1. Define your columns
// Edit this array to match your data structure
const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  // Add more columns as needed
];

// 2. Provide your data
// Replace this with your actual data source
const defaultData = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  // ...
];

// 3. Table component
export default function TanstackTableNonPaginated({ data = defaultData, columnsProp = columns }) {
  // Memoize columns and data for performance
  const memoColumns = useMemo(() => columnsProp, [columnsProp]);
  const memoData = useMemo(() => data, [data]);

  // 4. Set up the table instance
  const table = useReactTable({
    data: memoData,
    columns: memoColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 5. Render the table
  return (
    <div>
      {/* Table rendering */}
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 6. Usage:
// <TanstackTableNonPaginated data={yourData} columnsProp={yourColumns} />
// Or just use the defaultData and columns for a quick start. 