export const ERROR_MESSAGES: Record<string, string> = {
  // Authentication errors
  'Authentication failed. Please login again.': 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.',
  'Authentication failed': 'Kimlik doğrulama başarısız',
  'Invalid credentials': 'E-posta veya şifre hatalı',
  'Unauthorized': 'Bu işlem için yetkiniz yok',
  'User not found': 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı',
  'Invalid email or password': 'E-posta veya şifre hatalı',
  'Login failed': 'Giriş başarısız oldu',
  'Token expired': 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.',
  'Invalid token': 'Geçersiz oturum. Lütfen tekrar giriş yapın.',
  'Access denied': 'Erişim reddedildi',

  // Registration errors
  'Email already exists': 'Bu e-posta adresi zaten kullanımda',
  'Email already in use': 'Bu e-posta adresi zaten kullanımda',
  'User already exists': 'Bu kullanıcı zaten mevcut',
  'Registration failed': 'Kayıt işlemi başarısız oldu',
  'Invalid email format': 'Geçersiz e-posta formatı',
  'Password too weak': 'Şifre çok zayıf',
  'Password must be at least 6 characters': 'Şifre en az 6 karakter olmalıdır',
  'Password must be at least 8 characters long': 'Şifre en az 8 karakter olmalıdır',
  'Passwords do not match': 'Şifreler eşleşmiyor',

  // Validation errors (Login için güncellenmiş)
  'Email and password are required': 'E-posta ve şifre zorunludur',
  'Please enter a valid email address': 'Geçerli bir e-posta adresi girin',
  'All fields are required': 'Tüm alanlar zorunludur',
  'First name must be at least 2 characters long': 'Ad en az 2 karakter olmalıdır',
  'Last name must be at least 2 characters long': 'Soyad en az 2 karakter olmalıdır',

  // Network errors
  'Network error': 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.',
  'Connection failed': 'Sunucuya bağlanılamıyor',
  'Request timeout': 'İstek zaman aşımına uğradı',
  'Server unavailable': 'Sunucu şu anda erişilemiyor',
  'Network connection failed': 'Ağ bağlantısı başarısız',
  'Network connection failed. Please check your connection.': 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.',
  'Failed to fetch': 'Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.',

  // Validation errors
  'Validation failed': 'Doğrulama hatası',
  'Required field': 'Bu alan zorunludur',
  'Invalid input': 'Geçersiz giriş',
  'Invalid format': 'Geçersiz format',
  'Field is required': 'Bu alan zorunludur',
  'Invalid email': 'Geçersiz e-posta adresi',
  'Invalid phone number': 'Geçersiz telefon numarası',
  'Invalid date': 'Geçersiz tarih',

  // Permission errors
  'Forbidden': 'Bu işlem için yetkiniz yok',
  'Access forbidden': 'Erişim yasak',
  'Permission denied': 'İzin reddedildi',
  'Not authorized': 'Yetkilendirme hatası',

  // Data errors
  'Not found': 'Bulunamadı',
  'Resource not found': 'Kaynak bulunamadı',
  'Data not found': 'Veri bulunamadı',
  'Invalid data': 'Geçersiz veri',
  'Database error': 'Veritabanı hatası',
  'Save failed': 'Kaydetme işlemi başarısız',
  'Update failed': 'Güncelleme işlemi başarısız',
  'Delete failed': 'Silme işlemi başarısız',

  // File upload errors
  'File too large': 'Dosya çok büyük',
  'Invalid file type': 'Geçersiz dosya türü',
  'Upload failed': 'Yükleme başarısız',
  'File not found': 'Dosya bulunamadı',

  // General errors
  'Internal server error': 'Sunucu hatası oluştu',
  'Something went wrong': 'Bir şeyler ters gitti',
  'Unexpected error': 'Beklenmeyen bir hata oluştu',
  'An unexpected error occurred': 'Beklenmeyen bir hata oluştu',
  'An error occurred': 'Bir hata oluştu',
  'Bad request': 'Hatalı istek',
  'Service unavailable': 'Hizmet şu anda kullanılamıyor',

  // Child/Family specific errors
  'Child not found': 'Çocuk bulunamadı',
  'Parent not found': 'Ebeveyn bulunamadı',
  'Family not found': 'Aile bulunamadı',
  'Child already exists': 'Bu çocuk zaten mevcut',

  // Expense specific errors
  'Expense not found': 'Harcama kaydı bulunamadı',
  'Invalid amount': 'Geçersiz tutar',
  'Amount must be positive': 'Tutar pozitif olmalıdır',
  'Category not found': 'Kategori bulunamadı',
  'Invalid category': 'Geçersiz kategori',

  // Message specific errors
  'Message not found': 'Mesaj bulunamadı',
  'Message too long': 'Mesaj çok uzun',
  'Recipient not found': 'Alıcı bulunamadı',
  'Cannot send message': 'Mesaj gönderilemedi',

  // HTTP Status messages
  'HTTP 400': 'Hatalı istek',
  'HTTP 401': 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.',
  'HTTP 403': 'Bu işlem için yetkiniz yok',
  'HTTP 404': 'Sayfa veya kaynak bulunamadı',
  'HTTP 409': 'Bu işlem başka bir kayıtla çakışıyor',
  'HTTP 422': 'Girilen bilgiler geçersiz',
  'HTTP 429': 'Çok fazla istek gönderildi. Lütfen bekleyin.',
  'HTTP 500': 'Sunucu hatası oluştu',
  'HTTP 502': 'Sunucu geçici olarak erişilemiyor',
  'HTTP 503': 'Hizmet şu anda kullanılamıyor',
  'HTTP 504': 'İstek zaman aşımına uğradı',
};

// Error patterns for partial matching
export const ERROR_PATTERNS: Array<{ pattern: RegExp; message: string }> = [
  { pattern: /authentication.*failed/i, message: 'Kimlik doğrulama başarısız' },
  { pattern: /invalid.*credentials/i, message: 'E-posta veya şifre hatalı' },
  { pattern: /unauthorized/i, message: 'Bu işlem için yetkiniz yok' },
  { pattern: /token.*expired/i, message: 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.' },
  { pattern: /token.*invalid/i, message: 'Geçersiz oturum. Lütfen tekrar giriş yapın.' },
  { pattern: /email.*already.*exists/i, message: 'Bu e-posta adresi zaten kullanımda' },
  { pattern: /email.*already.*use/i, message: 'Bu e-posta adresi zaten kullanımda' },
  { pattern: /user.*not.*found/i, message: 'Kullanıcı bulunamadı' },
  { pattern: /password.*weak/i, message: 'Şifre çok zayıf' },
  { pattern: /password.*short/i, message: 'Şifre çok kısa' },
  { pattern: /network.*error/i, message: 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.' },
  { pattern: /connection.*failed/i, message: 'Sunucuya bağlanılamıyor' },
  { pattern: /server.*error/i, message: 'Sunucu hatası oluştu' },
  { pattern: /not.*found/i, message: 'Bulunamadı' },
  { pattern: /forbidden/i, message: 'Bu işlem için yetkiniz yok' },
  { pattern: /validation.*failed/i, message: 'Doğrulama hatası' },
  { pattern: /invalid.*format/i, message: 'Geçersiz format' },
  { pattern: /field.*required/i, message: 'Bu alan zorunludur' },
  { pattern: /duplicate.*entry/i, message: 'Bu kayıt zaten mevcut' },
  { pattern: /foreign.*key/i, message: 'İlişkili veri hatası' },
];

/**
 * Translates an error message from English/backend to Turkish
 * 
 * @param errorMessage - Original error message from API/backend
 * @returns Turkish translated error message
 */
export const translateErrorMessage = (errorMessage: string): string => {
  if (!errorMessage) {
    return 'Beklenmeyen bir hata oluştu';
  }

  // Ensure errorMessage is a string
  let messageStr = String(errorMessage);
  
  // If it's still "[object Object]", try to extract meaningful info
  if (messageStr === '[object Object]') {
    console.log('Warning: translateErrorMessage received an object:', errorMessage);
    try {
      // Try to extract message from object
      const obj = errorMessage as any;
      messageStr = obj.message || obj.error || obj.toString() || 'Beklenmeyen bir hata oluştu';
    } catch {
      messageStr = 'Beklenmeyen bir hata oluştu';
    }
  }

  // Direct message lookup (exact match)
  const directTranslation = ERROR_MESSAGES[messageStr];
  if (directTranslation) {
    return directTranslation;
  }

  // Pattern matching for partial matches
  for (const { pattern, message } of ERROR_PATTERNS) {
    if (pattern.test(messageStr)) {
      return message;
    }
  }

  // If message contains common keywords, try to extract meaning
  const lowerMessage = messageStr.toLowerCase();
  
  if (lowerMessage.includes('email') && lowerMessage.includes('password')) {
    return 'E-posta veya şifre hatalı';
  }
  
  if (lowerMessage.includes('email') && (lowerMessage.includes('exists') || lowerMessage.includes('duplicate'))) {
    return 'Bu e-posta adresi zaten kullanımda';
  }
  
  if (lowerMessage.includes('password')) {
    return 'Şifre ile ilgili bir hata oluştu';
  }
  
  if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('connection')) {
    return 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.';
  }

  // Return original message if no translation found
  return messageStr;
};