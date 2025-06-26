'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table as TableIcon, Grid3X3 } from 'lucide-react'

interface TableModalProps {
  isOpen: boolean
  onClose: () => void
  onTableInsert: (rows: number, cols: number, withHeaderRow: boolean) => void
}

export default function TableModal({ 
  isOpen, 
  onClose, 
  onTableInsert
}: TableModalProps) {
  const [rows, setRows] = useState<number>(3)
  const [cols, setCols] = useState<number>(3)
  const [withHeaderRow, setWithHeaderRow] = useState<boolean>(true)
  const [hoveredCell, setHoveredCell] = useState<{row: number, col: number} | null>(null)

  const maxRows = 8  // Reduced for better mobile experience
  const maxCols = 6  // Reduced for better mobile experience

  const handleCellHover = (row: number, col: number) => {
    setHoveredCell({ row, col })
    setRows(row + 1)
    setCols(col + 1)
  }

  const handleCellClick = (row: number, col: number) => {
    setRows(row + 1)
    setCols(col + 1)
  }

  const handleInsert = () => {
    onTableInsert(rows, cols, withHeaderRow)
    handleClose()
  }

  const handleClose = () => {
    setRows(3)
    setCols(3)
    setWithHeaderRow(true)
    setHoveredCell(null)
    onClose()
  }

  const renderTablePreview = () => {
    const cells = []
    
    for (let row = 0; row < maxRows; row++) {
      for (let col = 0; col < maxCols; col++) {
        const isSelected = row < rows && col < cols
        const isHovered = hoveredCell && row <= hoveredCell.row && col <= hoveredCell.col
        
        cells.push(
          <div
            key={`${row}-${col}`}
            className={`
              w-4 h-4 sm:w-6 sm:h-6 border border-gray-300 cursor-pointer transition-colors
              ${isSelected || isHovered
                ? 'bg-blue-500 border-blue-600'
                : 'bg-white hover:bg-gray-100'
              }
            `}
            onMouseEnter={() => handleCellHover(row, col)}
            onClick={() => handleCellClick(row, col)}
          />
        )
      }
    }

    return (
      <div className="flex flex-col items-center space-y-2">
        <div
          className="inline-grid gap-0 p-2 sm:p-4 bg-gray-50 rounded-lg max-w-full overflow-hidden"
          style={{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }}
          onMouseLeave={() => setHoveredCell(null)}
        >
          {cells}
        </div>
        <p className="text-xs sm:text-sm text-gray-600 text-center">
          Click or hover to select table size
        </p>
      </div>
    )
  }

  const renderActualTablePreview = () => {
    const tableRows = []
    
    for (let row = 0; row < rows; row++) {
      const cells = []
      const isHeaderRow = row === 0 && withHeaderRow
      
      for (let col = 0; col < cols; col++) {
        cells.push(
          <td 
            key={col}
            className={`
              border border-gray-400 px-3 py-2 text-sm
              ${isHeaderRow 
                ? 'bg-gray-100 font-semibold text-gray-900' 
                : 'bg-white text-gray-700'
              }
            `}
          >
            {isHeaderRow ? `Header ${col + 1}` : `Cell ${row + 1}-${col + 1}`}
          </td>
        )
      }
      
      tableRows.push(
        <tr key={row}>
          {cells}
        </tr>
      )
    }

    return (
      <div className="overflow-x-auto">
        <table className="border-collapse border border-gray-400 text-sm">
          <tbody>
            {tableRows}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TableIcon className="w-5 h-5" />
            Insert Table
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Table Size Selector */}
          <div className="space-y-3">
            <Label className="text-sm sm:text-base font-medium">Select Table Size</Label>
            <div className="flex flex-col items-center space-y-3">
              {renderTablePreview()}
              <p className="text-sm text-gray-600 font-medium">
                {rows} × {cols} table
                {withHeaderRow && ' (with header row)'}
              </p>
            </div>
          </div>

          {/* Manual Size Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Rows</Label>
              <Select value={rows.toString()} onValueChange={(value) => setRows(parseInt(value))}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: maxRows }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} row{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Columns</Label>
              <Select value={cols.toString()} onValueChange={(value) => setCols(parseInt(value))}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: maxCols }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} column{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Header Row Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="headerRow"
              checked={withHeaderRow}
              onCheckedChange={(checked) => setWithHeaderRow(checked as boolean)}
            />
            <Label htmlFor="headerRow" className="text-sm font-medium">
              Include header row
            </Label>
          </div>

          {/* Table Preview */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-medium">Preview</Label>
            <div className="border rounded-lg p-2 sm:p-4 bg-white overflow-x-auto">
              {renderActualTablePreview()}
            </div>
          </div>

          {/* Table Features Info */}
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Table Features:</h4>
            <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
              <li>• Professional borders and styling</li>
              <li>• Resizable columns (drag column borders)</li>
              <li>• Add/remove rows and columns after insertion</li>
              <li>• Header row styling with bold text</li>
              <li>• Responsive design for mobile devices</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleInsert} className="w-full sm:w-auto">
            <Grid3X3 className="w-4 h-4 mr-2" />
            Insert Table
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
