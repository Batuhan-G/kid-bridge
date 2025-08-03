// Expense category mappings
export const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  EDUCATION: 'Eğitim',
  HEALTH: 'Sağlık',
  CLOTHING: 'Giyim',
  TRANSPORTATION: 'Ulaşım',
  FOOD: 'Yemek',
  ENTERTAINMENT: 'Eğlence',
  OTHER: 'Diğer'
};

// Reverse mapping for form values
export const EXPENSE_CATEGORY_VALUES: Record<string, string> = {
  'Eğitim': 'EDUCATION',
  'Sağlık': 'HEALTH',
  'Giyim': 'CLOTHING',
  'Ulaşım': 'TRANSPORTATION',
  'Yemek': 'FOOD',
  'Eğlence': 'ENTERTAINMENT',
  'Diğer': 'OTHER'
};

// Get label from backend enum value
export const getExpenseCategoryLabel = (value: string): string => {
  return EXPENSE_CATEGORY_LABELS[value] || value;
};

// Get backend enum value from label
export const getExpenseCategoryValue = (label: string): string => {
  return EXPENSE_CATEGORY_VALUES[label] || label;
};