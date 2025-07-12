import { FIELD_TYPES } from '../store';

// Filter operators
export const FILTER_OPERATORS = {
  EQUALS: 'equals',
  NOT_EQUALS: 'not_equals',
  CONTAINS: 'contains',
  NOT_CONTAINS: 'not_contains',
  STARTS_WITH: 'starts_with',
  ENDS_WITH: 'ends_with',
  IS_EMPTY: 'is_empty',
  IS_NOT_EMPTY: 'is_not_empty',
  GREATER_THAN: 'greater_than',
  LESS_THAN: 'less_than',
  GREATER_EQUAL: 'greater_equal',
  LESS_EQUAL: 'less_equal',
  IS_CHECKED: 'is_checked',
  IS_NOT_CHECKED: 'is_not_checked'
};

// Sort directions
export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc'
};

// Get available operators for a field type
export const getOperatorsForFieldType = (fieldType) => {
  switch (fieldType) {
    case FIELD_TYPES.TEXT:
      return [
        FILTER_OPERATORS.EQUALS,
        FILTER_OPERATORS.NOT_EQUALS,
        FILTER_OPERATORS.CONTAINS,
        FILTER_OPERATORS.NOT_CONTAINS,
        FILTER_OPERATORS.STARTS_WITH,
        FILTER_OPERATORS.ENDS_WITH,
        FILTER_OPERATORS.IS_EMPTY,
        FILTER_OPERATORS.IS_NOT_EMPTY
      ];
    case FIELD_TYPES.NUMBER:
    case FIELD_TYPES.DATE:
      return [
        FILTER_OPERATORS.EQUALS,
        FILTER_OPERATORS.NOT_EQUALS,
        FILTER_OPERATORS.GREATER_THAN,
        FILTER_OPERATORS.LESS_THAN,
        FILTER_OPERATORS.GREATER_EQUAL,
        FILTER_OPERATORS.LESS_EQUAL,
        FILTER_OPERATORS.IS_EMPTY,
        FILTER_OPERATORS.IS_NOT_EMPTY
      ];
    case FIELD_TYPES.SELECT:
      return [
        FILTER_OPERATORS.EQUALS,
        FILTER_OPERATORS.NOT_EQUALS,
        FILTER_OPERATORS.IS_EMPTY,
        FILTER_OPERATORS.IS_NOT_EMPTY
      ];
    case FIELD_TYPES.CHECKBOX:
      return [
        FILTER_OPERATORS.IS_CHECKED,
        FILTER_OPERATORS.IS_NOT_CHECKED
      ];
    default:
      return [FILTER_OPERATORS.EQUALS, FILTER_OPERATORS.NOT_EQUALS];
  }
};

// Get operator display name
export const getOperatorDisplayName = (operator) => {
  const names = {
    [FILTER_OPERATORS.EQUALS]: 'Equals',
    [FILTER_OPERATORS.NOT_EQUALS]: 'Does not equal',
    [FILTER_OPERATORS.CONTAINS]: 'Contains',
    [FILTER_OPERATORS.NOT_CONTAINS]: 'Does not contain',
    [FILTER_OPERATORS.STARTS_WITH]: 'Starts with',
    [FILTER_OPERATORS.ENDS_WITH]: 'Ends with',
    [FILTER_OPERATORS.IS_EMPTY]: 'Is empty',
    [FILTER_OPERATORS.IS_NOT_EMPTY]: 'Is not empty',
    [FILTER_OPERATORS.GREATER_THAN]: 'Greater than',
    [FILTER_OPERATORS.LESS_THAN]: 'Less than',
    [FILTER_OPERATORS.GREATER_EQUAL]: 'Greater than or equal',
    [FILTER_OPERATORS.LESS_EQUAL]: 'Less than or equal',
    [FILTER_OPERATORS.IS_CHECKED]: 'Is checked',
    [FILTER_OPERATORS.IS_NOT_CHECKED]: 'Is not checked'
  };
  return names[operator] || operator;
};

// Apply a single filter to a record
export const applyFilter = (record, filter, field) => {
  const value = record.data[filter.fieldId];
  const filterValue = filter.value;

  switch (filter.operator) {
    case FILTER_OPERATORS.EQUALS:
      return value === filterValue;
    case FILTER_OPERATORS.NOT_EQUALS:
      return value !== filterValue;
    case FILTER_OPERATORS.CONTAINS:
      return String(value || '').toLowerCase().includes(String(filterValue || '').toLowerCase());
    case FILTER_OPERATORS.NOT_CONTAINS:
      return !String(value || '').toLowerCase().includes(String(filterValue || '').toLowerCase());
    case FILTER_OPERATORS.STARTS_WITH:
      return String(value || '').toLowerCase().startsWith(String(filterValue || '').toLowerCase());
    case FILTER_OPERATORS.ENDS_WITH:
      return String(value || '').toLowerCase().endsWith(String(filterValue || '').toLowerCase());
    case FILTER_OPERATORS.IS_EMPTY:
      return !value || value === '' || value === null || value === undefined;
    case FILTER_OPERATORS.IS_NOT_EMPTY:
      return value && value !== '' && value !== null && value !== undefined;
    case FILTER_OPERATORS.GREATER_THAN:
      if (field.type === FIELD_TYPES.NUMBER) {
        return Number(value) > Number(filterValue);
      }
      if (field.type === FIELD_TYPES.DATE) {
        return new Date(value) > new Date(filterValue);
      }
      return String(value) > String(filterValue);
    case FILTER_OPERATORS.LESS_THAN:
      if (field.type === FIELD_TYPES.NUMBER) {
        return Number(value) < Number(filterValue);
      }
      if (field.type === FIELD_TYPES.DATE) {
        return new Date(value) < new Date(filterValue);
      }
      return String(value) < String(filterValue);
    case FILTER_OPERATORS.GREATER_EQUAL:
      if (field.type === FIELD_TYPES.NUMBER) {
        return Number(value) >= Number(filterValue);
      }
      if (field.type === FIELD_TYPES.DATE) {
        return new Date(value) >= new Date(filterValue);
      }
      return String(value) >= String(filterValue);
    case FILTER_OPERATORS.LESS_EQUAL:
      if (field.type === FIELD_TYPES.NUMBER) {
        return Number(value) <= Number(filterValue);
      }
      if (field.type === FIELD_TYPES.DATE) {
        return new Date(value) <= new Date(filterValue);
      }
      return String(value) <= String(filterValue);
    case FILTER_OPERATORS.IS_CHECKED:
      return Boolean(value) === true;
    case FILTER_OPERATORS.IS_NOT_CHECKED:
      return Boolean(value) === false;
    default:
      return true;
  }
};

// Apply all filters to records
export const applyFilters = (records, filters, fields) => {
  if (!filters || filters.length === 0) {
    return records;
  }

  return records.filter(record => {
    return filters.every(filter => {
      const field = fields.find(f => f.id === filter.fieldId);
      if (!field) return true;
      return applyFilter(record, filter, field);
    });
  });
};

// Sort records by multiple criteria
export const applySorts = (records, sorts, fields) => {
  if (!sorts || sorts.length === 0) {
    return records;
  }

  return [...records].sort((a, b) => {
    for (const sort of sorts) {
      const field = fields.find(f => f.id === sort.fieldId);
      if (!field) continue;

      const aValue = a.data[sort.fieldId];
      const bValue = b.data[sort.fieldId];

      let comparison = 0;

      if (field.type === FIELD_TYPES.NUMBER) {
        comparison = (Number(aValue) || 0) - (Number(bValue) || 0);
      } else if (field.type === FIELD_TYPES.DATE) {
        const aDate = aValue ? new Date(aValue) : new Date(0);
        const bDate = bValue ? new Date(bValue) : new Date(0);
        comparison = aDate.getTime() - bDate.getTime();
      } else if (field.type === FIELD_TYPES.CHECKBOX) {
        comparison = (Boolean(bValue) ? 1 : 0) - (Boolean(aValue) ? 1 : 0);
      } else {
        // Text and Select fields
        const aStr = String(aValue || '').toLowerCase();
        const bStr = String(bValue || '').toLowerCase();
        comparison = aStr.localeCompare(bStr);
      }

      if (comparison !== 0) {
        return sort.direction === SORT_DIRECTIONS.DESC ? -comparison : comparison;
      }
    }
    return 0;
  });
};

// Get filtered and sorted records for a view
export const getViewRecords = (records, view, fields) => {
  let filteredRecords = applyFilters(records, view.filters, fields);
  let sortedRecords = applySorts(filteredRecords, view.sorts, fields);
  return sortedRecords;
};
