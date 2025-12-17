
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, MoreHorizontal, Filter, Download, Search, CheckSquare, Square, Inbox } from 'lucide-react';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: (item: T) => React.ReactNode;
  onBulkAction?: (selectedIds: string[]) => void;
  title?: string;
  enableSearch?: boolean;
  enableExport?: boolean;
  itemsPerPage?: number; // New prop to control pagination limit
}

export function AdminTable<T extends { id: string }>({ 
  data, columns, actions, onBulkAction, title, enableSearch = true, enableExport = true, itemsPerPage = 10
}: AdminTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Filter
  const filteredData = data.filter((item) =>
    Object.values(item as any).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination - If itemsPerPage is very large, it effectively disables pagination UI
  const effectiveItemsPerPage = itemsPerPage === -1 ? sortedData.length : itemsPerPage;
  const totalPages = Math.ceil(sortedData.length / effectiveItemsPerPage) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * effectiveItemsPerPage, currentPage * effectiveItemsPerPage);

  const handleSort = (key: keyof T) => {
    setSortConfig((current) => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === paginatedData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedData.map(d => d.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
<<<<<<< HEAD
    <div className="bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col w-full h-full max-w-full">
=======
    <div className="bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col w-full h-full">
>>>>>>> 58b1d6bef822ef00d27bf4795659b6b67adcdea9
      {/* Table Header Controls */}
      <div className="p-5 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 bg-white dark:bg-[#151515]">
        {title && <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>}
        
<<<<<<< HEAD
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto hide-scrollbar">
          {enableSearch && (
            <div className="relative flex-1 sm:flex-none min-w-[200px]">
=======
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {enableSearch && (
            <div className="relative flex-1 sm:flex-none">
>>>>>>> 58b1d6bef822ef00d27bf4795659b6b67adcdea9
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-purple-500"
              />
            </div>
          )}
          {enableSearch && (
<<<<<<< HEAD
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-500 transition-colors shrink-0">
=======
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-500 transition-colors">
>>>>>>> 58b1d6bef822ef00d27bf4795659b6b67adcdea9
              <Filter size={18} />
            </button>
          )}
          {enableExport && (
<<<<<<< HEAD
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-500 transition-colors shrink-0">
=======
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-500 transition-colors">
>>>>>>> 58b1d6bef822ef00d27bf4795659b6b67adcdea9
              <Download size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && onBulkAction && (
        <div className="bg-purple-50 dark:bg-purple-900/10 px-6 py-2 flex items-center justify-between shrink-0 border-b border-purple-100 dark:border-purple-900/20">
          <span className="text-sm font-bold text-purple-700 dark:text-purple-300">{selectedItems.length} selected</span>
          <button 
            onClick={() => onBulkAction(selectedItems)}
            className="text-xs font-bold bg-white dark:bg-black/20 text-red-500 px-3 py-1 rounded shadow-sm hover:bg-red-50"
          >
            Delete Selected
          </button>
        </div>
      )}

<<<<<<< HEAD
      {/* Table Container - Critical for Responsive Table */}
      <div className="flex-1 w-full overflow-hidden relative bg-gray-50/50 dark:bg-[#121212]">
         <div className="absolute inset-0 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#1a1a1a] shadow-sm">
                  <th className="p-4 w-10">
                    <button onClick={toggleSelectAll} className="text-gray-400 hover:text-purple-600">
                      {selectedItems.length > 0 && selectedItems.length === paginatedData.length ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                  </th>
                  {columns.map((col) => (
                    <th 
                      key={String(col.key)} 
                      className={`p-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 whitespace-nowrap ${col.sortable ? 'cursor-pointer hover:text-purple-600' : ''}`}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {sortConfig?.key === col.key && (
                          sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        )}
                      </div>
                    </th>
                  ))}
                  {actions && <th className="p-4 w-10"></th>}
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                    paginatedData.map((item, idx) => (
                      <motion.tr 
                        key={item.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.01 }}
                        className={`border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#151515] hover:bg-purple-50/30 dark:hover:bg-white/[0.02] transition-colors ${selectedItems.includes(item.id) ? 'bg-purple-50/50 dark:bg-purple-900/10' : ''}`}
                      >
                        <td className="p-4">
                          <button onClick={() => toggleSelect(item.id)} className={`transition-colors ${selectedItems.includes(item.id) ? 'text-purple-600' : 'text-gray-300'}`}>
                            {selectedItems.includes(item.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                          </button>
                        </td>
                        {columns.map((col) => (
                          <td key={String(col.key)} className="p-4 text-sm text-gray-700 dark:text-gray-300 align-middle">
                            {col.render ? col.render(item[col.key], item) : String(item[col.key])}
                          </td>
                        ))}
                        {actions && (
                          <td className="p-4 text-right align-middle">
                            <div className="relative group inline-block">
                              <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                                <MoreHorizontal size={18} />
                              </button>
                              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-white/10 p-1 hidden group-hover:block z-20 min-w-[140px] transform origin-top-right">
                                {actions(item)}
                              </div>
                            </div>
                          </td>
                        )}
                      </motion.tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length + 2} className="py-20 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <Inbox size={32} className="opacity-40" />
                                </div>
                                <p className="font-medium text-lg text-gray-500">No records found</p>
                                <p className="text-sm">Try adjusting your search or filters.</p>
                            </div>
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
         </div>
      </div>

      {/* Pagination */}
=======
      {/* Table */}
      <div className="flex-1 w-full overflow-auto custom-scrollbar relative bg-gray-50/50 dark:bg-[#121212]">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#1a1a1a] shadow-sm">
              <th className="p-4 w-10">
                <button onClick={toggleSelectAll} className="text-gray-400 hover:text-purple-600">
                  {selectedItems.length > 0 && selectedItems.length === paginatedData.length ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
              </th>
              {columns.map((col) => (
                <th 
                  key={String(col.key)} 
                  className={`p-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${col.sortable ? 'cursor-pointer hover:text-purple-600' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortConfig?.key === col.key && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="p-4 w-10"></th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
                paginatedData.map((item, idx) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.01 }}
                    className={`border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#151515] hover:bg-purple-50/30 dark:hover:bg-white/[0.02] transition-colors ${selectedItems.includes(item.id) ? 'bg-purple-50/50 dark:bg-purple-900/10' : ''}`}
                  >
                    <td className="p-4">
                      <button onClick={() => toggleSelect(item.id)} className={`transition-colors ${selectedItems.includes(item.id) ? 'text-purple-600' : 'text-gray-300'}`}>
                        {selectedItems.includes(item.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                      </button>
                    </td>
                    {columns.map((col) => (
                      <td key={String(col.key)} className="p-4 text-sm text-gray-700 dark:text-gray-300 align-middle">
                        {col.render ? col.render(item[col.key], item) : String(item[col.key])}
                      </td>
                    ))}
                    {actions && (
                      <td className="p-4 text-right align-middle">
                        <div className="relative group inline-block">
                          <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                            <MoreHorizontal size={18} />
                          </button>
                          {/* Dropdown - simplified hover for demo */}
                          <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-white/10 p-1 hidden group-hover:block z-20 min-w-[140px] transform origin-top-right">
                            {actions(item)}
                          </div>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))
            ) : (
                <tr>
                    <td colSpan={columns.length + 2} className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <Inbox size={32} className="opacity-40" />
                            </div>
                            <p className="font-medium text-lg text-gray-500">No records found</p>
                            <p className="text-sm">Try adjusting your search or filters.</p>
                        </div>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (Hide if all items shown or only 1 page) */}
>>>>>>> 58b1d6bef822ef00d27bf4795659b6b67adcdea9
      {totalPages > 1 && itemsPerPage !== -1 && (
        <div className="p-4 border-t border-gray-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 bg-white dark:bg-[#151515]">
          <span className="text-xs text-gray-500">
            Showing {((currentPage - 1) * effectiveItemsPerPage) + 1} - {Math.min(currentPage * effectiveItemsPerPage, filteredData.length)} of {filteredData.length}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-200 dark:border-white/10 text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Previous
            </button>
<<<<<<< HEAD
            <div className="flex gap-1 overflow-x-auto hide-scrollbar max-w-[200px]">
              {Array.from({ length: totalPages }).map((_, i) => {
                 const pageNum = i + 1;
                 // Simple logic to show limited pages if too many
                 if (totalPages > 7 && (pageNum < currentPage - 2 || pageNum > currentPage + 2) && pageNum !== 1 && pageNum !== totalPages) {
                    return i === 1 || i === totalPages - 2 ? <span key={i} className="px-1 py-1 text-gray-400">...</span> : null;
                 }
                 
=======
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                 // Simple pagination logic for display
                 const pageNum = i + 1;
>>>>>>> 58b1d6bef822ef00d27bf4795659b6b67adcdea9
                 return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
<<<<<<< HEAD
                    className={`w-8 h-8 rounded-md text-sm font-bold flex items-center justify-center transition-colors shrink-0 ${currentPage === pageNum ? 'bg-purple-600 text-white' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
=======
                    className={`w-8 h-8 rounded-md text-sm font-bold flex items-center justify-center transition-colors ${currentPage === pageNum ? 'bg-purple-600 text-white' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
>>>>>>> 58b1d6bef822ef00d27bf4795659b6b67adcdea9
                  >
                    {pageNum}
                  </button>
                 );
              })}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-gray-200 dark:border-white/10 text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
