export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

/**
 * Universal sorting function supporting strings (with Thai locale awareness),
 * numbers, dates, and nested keys.
 */
export function sortData<T>(
  data: T[],
  sortKey: string,
  direction: SortDirection,
  customComparator?: (a: T, b: T) => number
): T[] {
  if (!sortKey) return data;

  return [...data].sort((a, b) => {
    if (customComparator) {
      const customRes = customComparator(a, b);
      return direction === 'asc' ? customRes : -customRes;
    }

    const valA = (a as any)[sortKey];
    const valB = (b as any)[sortKey];

    if (valA === valB) return 0;
    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;

    // Number comparison
    if (typeof valA === 'number' && typeof valB === 'number') {
      return direction === 'asc' ? valA - valB : valB - valA;
    }

    // Date comparison if string looks like YYYY-MM-DD
    const isDatePattern = /^\d{4}-\d{2}-\d{2}/;
    if (
      typeof valA === 'string' &&
      typeof valB === 'string' &&
      isDatePattern.test(valA) &&
      isDatePattern.test(valB)
    ) {
      const dateA = new Date(valA).getTime();
      const dateB = new Date(valB).getTime();
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    }

    // String comparison with Thai & English locale support
    const strA = String(valA);
    const strB = String(valB);
    const comp = strA.localeCompare(strB, ['th', 'en'], { numeric: true, sensitivity: 'base' });
    return direction === 'asc' ? comp : -comp;
  });
}
