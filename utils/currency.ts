/**
 * Turkish currency formatting utilities
 */

/**
 * Formats amount input with Turkish locale formatting
 * - Thousand separator: dot (.)
 * - Decimal separator: comma (,)
 * - Max 2 decimal places
 * 
 * @param value - Raw input value
 * @returns Formatted amount string (e.g., "1.250,50")
 */
export const formatAmount = (value: string): string => {
  // Remove all non-numeric characters except comma
  const cleanValue = value.replace(/[^0-9,]/g, '');
  
  // Split by comma to handle decimal part
  const parts = cleanValue.split(',');
  
  // If more than one comma, keep only the first decimal part
  if (parts.length > 2) {
    return parts[0] + ',' + parts[1];
  }
  
  let integerPart = parts[0] || '';
  let decimalPart = parts[1];
  
  // Limit decimal part to 2 digits
  if (decimalPart && decimalPart.length > 2) {
    decimalPart = decimalPart.substring(0, 2);
  }
  
  // Format integer part with thousand separators (dots)
  if (integerPart.length > 3) {
    // Add dots every 3 digits from right
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  
  // Combine parts
  if (decimalPart !== undefined) {
    return integerPart + ',' + decimalPart;
  }
  
  return integerPart;
};

/**
 * Parses formatted Turkish amount to number for API
 * 
 * @param formattedAmount - Formatted amount string (e.g., "1.250,50")
 * @returns Number value for API (e.g., 1250.50)
 */
export const parseAmount = (formattedAmount: string): number => {
  // Remove dots (thousand separators) and replace comma with dot for parsing
  const cleanValue = formattedAmount.replace(/\./g, '').replace(',', '.');
  return Number.parseFloat(cleanValue) || 0;
};

/**
 * Formats number to Turkish currency display
 * 
 * @param amount - Number amount
 * @returns Formatted string (e.g., "1.250,50")
 */
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};