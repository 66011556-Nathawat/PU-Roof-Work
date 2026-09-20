import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortDirection } from '../utils/sorting';
import { useTheme } from '../context/ThemeContext';

interface SortableHeaderProps {
  label: string;
  field: string;
  currentSortKey: string;
  currentDirection: SortDirection;
  onSort: (field: string) => void;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  field,
  currentSortKey,
  currentDirection,
  onSort,
  align = 'left',
  className = '',
}) => {
  const { isDark } = useTheme();
  const isActive = currentSortKey === field;

  const alignCls =
    align === 'right'
      ? 'justify-end text-right'
      : align === 'center'
      ? 'justify-center text-center'
      : 'justify-start text-left';

  return (
    <th
      onClick={() => onSort(field)}
      className={`px-4 py-3 select-none cursor-pointer transition-colors group ${
        isActive
          ? isDark
            ? 'text-sky-400 bg-sky-950/20'
            : 'text-sky-700 bg-sky-50/70'
          : isDark
          ? 'hover:text-white hover:bg-slate-800/40'
          : 'hover:text-slate-900 hover:bg-slate-200/50'
      } ${className}`}
      title={`Click to sort by ${label} (${
        isActive ? (currentDirection === 'asc' ? 'Switch to Descending' : 'Switch to Ascending') : 'Ascending'
      })`}
    >
      <div className={`flex items-center gap-1.5 ${alignCls}`}>
        <span>{label}</span>
        <span className="inline-flex items-center">
          {isActive ? (
            currentDirection === 'asc' ? (
              <ArrowUp className="w-3.5 h-3.5 text-sky-500 animate-fadeIn" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5 text-sky-500 animate-fadeIn" />
            )
          ) : (
            <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-30 group-hover:opacity-100 transition-opacity" />
          )}
        </span>
      </div>
    </th>
  );
};
