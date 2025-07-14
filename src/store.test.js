import { describe, it, expect } from 'vitest';
import { FIELD_TYPES, getDefaultValueForFieldType } from './store';

describe('Store - Field Types', () => {
  describe('FIELD_TYPES', () => {
    it('should include MARKDOWN field type', () => {
      expect(FIELD_TYPES.MARKDOWN).toBe('markdown');
    });

    it('should have all expected field types', () => {
      const expectedTypes = ['text', 'number', 'date', 'select', 'checkbox', 'markdown'];
      const actualTypes = Object.values(FIELD_TYPES);
      
      expectedTypes.forEach(type => {
        expect(actualTypes).toContain(type);
      });
    });
  });

  describe('getDefaultValueForFieldType', () => {
    it('should return empty string for MARKDOWN field type', () => {
      const defaultValue = getDefaultValueForFieldType(FIELD_TYPES.MARKDOWN);
      expect(defaultValue).toBe('');
    });

    it('should return correct default values for all field types', () => {
      expect(getDefaultValueForFieldType(FIELD_TYPES.TEXT)).toBe('');
      expect(getDefaultValueForFieldType(FIELD_TYPES.NUMBER)).toBe(0);
      expect(getDefaultValueForFieldType(FIELD_TYPES.DATE)).toBe('');
      expect(getDefaultValueForFieldType(FIELD_TYPES.SELECT)).toBe('');
      expect(getDefaultValueForFieldType(FIELD_TYPES.CHECKBOX)).toBe(false);
      expect(getDefaultValueForFieldType(FIELD_TYPES.MARKDOWN)).toBe('');
    });

    it('should return empty string for unknown field types', () => {
      expect(getDefaultValueForFieldType('unknown')).toBe('');
    });
  });
});
