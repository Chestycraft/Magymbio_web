// TanStack Table Paginated Boilerplate
// This is a template for a TanStack Table (v8+) with client-side pagination.
// Replace the data and columns as needed for your use case.

import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

// 1. Define your columns
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
const defaultData = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  // ...
];

const PAGE_SIZE = 5; // Change this to your desired page size

// 3. Table component
export default function TanstackTablePaginated({ data = defaultData, columnsProp = columns, pageSize = PAGE_SIZE }) {
  // Memoize columns and data for performance
  const memoColumns = useMemo(() => columnsProp, [columnsProp]);
  const memoData = useMemo(() => data, [data]);

  // 4. Pagination state
  const [pageIndex, setPageIndex] = useState(0);
  const pageCount = Math.ceil(memoData.length / pageSize);

  // 5. Paginate the data
  const paginatedData = useMemo(() => {
    const start = pageIndex * pageSize;
    return memoData.slice(start, start + pageSize);
  }, [memoData, pageIndex, pageSize]);

  // 6. Set up the table instance
  const table = useReactTable({
    data: paginatedData,
    columns: memoColumns,
    getCoreRowModel: getCoreRowModel(),
    // You can add more TanStack plugins here if needed
  });

  // 7. Render the table and pagination controls
  return (
    <div>
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
      {/* Pagination controls */}
      <div style={{ marginTop: 16 }}>
        <button onClick={() => setPageIndex(0)} disabled={pageIndex === 0}>
          {'<<'}
        </button>
        <button onClick={() => setPageIndex(i => Math.max(i - 1, 0))} disabled={pageIndex === 0}>
          {'<'}
        </button>
        <span style={{ margin: '0 8px' }}>
          Page {pageIndex + 1} of {pageCount}
        </span>
        <button onClick={() => setPageIndex(i => Math.min(i + 1, pageCount - 1))} disabled={pageIndex === pageCount - 1}>
          {'>'}
        </button>
        <button onClick={() => setPageIndex(pageCount - 1)} disabled={pageIndex === pageCount - 1}>
          {'>>'}
        </button>
      </div>
    </div>
  );
}

// 8. Usage:
// <TanstackTablePaginated data={yourData} columnsProp={yourColumns} pageSize={10} />
// Or just use the defaultData and columns for a quick start. 