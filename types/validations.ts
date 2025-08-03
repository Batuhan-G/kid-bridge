export interface FormErrors {
  [key: string]: string | undefined;
}

export interface ExpenseFormData {
  title: string;
  amount: string;
  childId: string;
  category: string;
  date: string;
  description: string;
}

export const validateExpenseForm = (data: ExpenseFormData): FormErrors => {
  const errors: FormErrors = {};

  // Title validation
  if (!data.title.trim()) {
    errors.title = 'Başlık zorunludur';
  } else if (data.title.trim().length < 2) {
    errors.title = 'Başlık en az 2 karakter olmalıdır';
  }

  // Amount validation
  if (!data.amount.trim()) {
    errors.amount = 'Tutar zorunludur';
  } else {
    const numericAmount = parseFloat(data.amount.replace(/\./g, '').replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      errors.amount = 'Geçerli bir tutar giriniz';
    }
  }

  // Child validation
  if (!data.childId) {
    errors.childId = 'Çocuk seçimi zorunludur';
  }

  // Category validation
  if (!data.category) {
    errors.category = 'Kategori seçimi zorunludur';
  }

  // Date validation
  if (!data.date) {
    errors.date = 'Tarih seçimi zorunludur';
  }

  return errors;
};