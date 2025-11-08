import { translateErrorMessage } from '@/constants/error-messages';

export interface ApiError {
  message: string;
  statusCode?: number;
  field?: string;
  code?: string;
}

export interface TranslatedError {
  originalMessage: string;
  translatedMessage: string;
  statusCode?: number;
  field?: string;
  code?: string;
}

// Helper function to safely get property from object
const safeGet = (obj: any, path: string): any => {
  try {
    return obj && typeof obj === 'object' ? obj[path] : undefined;
  } catch {
    return undefined;
  }
};

// Helper function to safely get nested property
const safeGetNested = (obj: any, path1: string, path2: string): any => {
  try {
    const nested = safeGet(obj, path1);
    return nested ? safeGet(nested, path2) : undefined;
  } catch {
    return undefined;
  }
};

// API error'larını işler ve çevirir
export const processApiError = (error: any): TranslatedError => {
  let originalMessage = '';
  let statusCode: number | undefined;
  let field: string | undefined;
  let code: string | undefined;

  if (typeof error === 'string') {
    originalMessage = error;
  } else if (error && typeof error === 'object') {
    originalMessage = safeGet(error, 'message') || safeGet(error, 'error') || '';
    statusCode = safeGet(error, 'statusCode') || safeGet(error, 'status') || safeGetNested(error, 'response', 'status');
    field = safeGet(error, 'field');
    code = safeGet(error, 'code');
    
    // Axios error format
    const responseData = safeGetNested(error, 'response', 'data');
    if (responseData) {
      originalMessage = safeGet(responseData, 'message') || safeGet(responseData, 'error') || originalMessage;
    }
    
    // Our API response format
    const dataMessage = safeGetNested(error, 'data', 'message');
    if (dataMessage) {
      originalMessage = dataMessage;
    }
  }
  
  if (!originalMessage) {
    originalMessage = 'Beklenmeyen bir hata oluştu';
  }

  // Ensure originalMessage is a string
  const messageStr = String(originalMessage);
  const translatedMessage = translateErrorMessage(messageStr);

  return {
    originalMessage: messageStr,
    translatedMessage,
    statusCode,
    field,
    code
  };
};

// Network error'larını işler
export const handleNetworkError = (error: any): string => {
  if (error instanceof TypeError && safeGet(error, 'message')?.includes('fetch')) {
    return 'Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.';
  }
  
  if (error && safeGet(error, 'name') === 'AbortError') {
    return 'İstek iptal edildi';
  }
  
  if (error && safeGet(error, 'code') === 'NETWORK_ERROR') {
    return 'Ağ bağlantısı hatası';
  }

  if (error && safeGet(error, 'code') === 'ECONNREFUSED') {
    return 'Sunucuya bağlanılamıyor';
  }

  const message = safeGet(error, 'message') || '';
  return translateErrorMessage(message || 'Bağlantı hatası');
};

// Validation error'larını işler
export const handleValidationErrors = (validationError: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (Array.isArray(validationError)) {
    validationError.forEach((error: any, index: number) => {
      const fieldName = safeGet(error, 'property') || safeGet(error, 'field') || `field_${index}`;
      const constraints = safeGet(error, 'constraints');
      const message = safeGet(error, 'message') || 
                     (constraints ? Object.values(constraints).join(', ') : '') ||
                     'Doğrulama hatası';
      errors[fieldName] = translateErrorMessage(String(message));
    });
  } else if (validationError && typeof validationError === 'object') {
    Object.entries(validationError).forEach(([field, message]) => {
      errors[field] = translateErrorMessage(String(message));
    });
  } else {
    errors.general = translateErrorMessage(String(validationError));
  }

  return errors;
};

// Kullanıcı dostu error mesajı döner
export const getDisplayErrorMessage = (error: any, defaultMessage = 'Bir hata oluştu'): string => {
  try {
    const processedError = processApiError(error);
    return processedError.translatedMessage || defaultMessage;
  } catch {
    return defaultMessage;
  }
};

// Error'ı log'lar ve çevirir
export const logAndTranslateError = (error: any, context: string): string => {
  const errorInfo: Record<string, any> = {
    context,
    timestamp: new Date().toISOString()
  };

  if (error && typeof error === 'object') {
    errorInfo.message = safeGet(error, 'message');
    errorInfo.stack = safeGet(error, 'stack');
    errorInfo.statusCode = safeGet(error, 'statusCode') || safeGet(error, 'status');
    
    const responseData = safeGetNested(error, 'response', 'data');
    if (responseData) {
      errorInfo.response = responseData;
    }
  } else {
    errorInfo.error = error;
  }

  console.error(`Error in ${context}:`, errorInfo);
  return getDisplayErrorMessage(error);
};

// Auth error'u kontrol eder
export const isAuthenticationError = (error: any): boolean => {
  if (!error) return false;
  
  const statusCode = safeGet(error, 'statusCode') || safeGet(error, 'status') || safeGetNested(error, 'response', 'status');
  
  if (statusCode === 401) {
    return true;
  }

  const message = safeGet(error, 'message') || safeGet(error, 'error') || '';
  const authErrorKeywords = [
    'authentication failed',
    'token expired',
    'invalid token',
    'unauthorized',
    'please login again',
    'jwt expired',
    'access denied'
  ];

  return authErrorKeywords.some(keyword => 
    String(message).toLowerCase().includes(keyword)
  );
};

// Toast için error formatı
export const formatErrorForToast = (error: any, context?: string) => {
  const processedError = processApiError(error);
  
  let title = 'Hata';
  if (context) {
    const contextTitles: Record<string, string> = {
      login: 'Giriş Hatası',
      register: 'Kayıt Hatası',
      expense: 'Harcama Hatası',
      child: 'Çocuk Bilgisi Hatası',
      message: 'Mesaj Hatası',
      profile: 'Profil Hatası',
      upload: 'Yükleme Hatası',
      delete: 'Silme Hatası',
      update: 'Güncelleme Hatası',
      create: 'Oluşturma Hatası'
    };
    title = contextTitles[context] || 'Hata';
  }

  return {
    title,
    description: processedError.translatedMessage,
    variant: 'destructive' as const
  };
};

// Retry mekanizması
export const retryWithError = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (isAuthenticationError(error)) {
        throw error;
      }

      const statusCode = safeGet(error, 'statusCode') || safeGet(error, 'status') || safeGetNested(error, 'response', 'status');
        
      if (statusCode && statusCode >= 400 && statusCode < 500 && statusCode !== 429) {
        throw error;
      }

      if (attempt === maxRetries) {
        break;
      }

      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
};

// Safe async wrapper
export const safeAsync = <T>(
  operation: () => Promise<T>,
  context: string,
  fallback?: T
) => {
  return async (): Promise<T | undefined> => {
    try {
      return await operation();
    } catch (error) {
      logAndTranslateError(error, context);
      return fallback;
    }
  };
};

// Error tipini kontrol eder
export const isErrorType = (error: any, errorType: 'network' | 'validation' | 'auth' | 'server'): boolean => {
  if (!error) return false;
  
  const message = safeGet(error, 'message') || safeGet(error, 'error') || '';
  const statusCode = safeGet(error, 'statusCode') || safeGet(error, 'status') || safeGetNested(error, 'response', 'status');

  switch (errorType) {
    case 'network':
      return (error instanceof TypeError && String(message).includes('fetch')) ||
             String(message).toLowerCase().includes('network') ||
             String(message).toLowerCase().includes('connection');
    
    case 'validation':
      return statusCode === 400 || 
             statusCode === 422 ||
             String(message).toLowerCase().includes('validation');
    
    case 'auth':
      return isAuthenticationError(error);
    
    case 'server':
      return (statusCode !== undefined && statusCode >= 500) ||
             String(message).toLowerCase().includes('server error') ||
             String(message).toLowerCase().includes('internal error');
    
    default:
      return false;
  }
};

// Error tipine göre retry sayısı
export const getRetryCount = (error: any): number => {
  if (isErrorType(error, 'network')) return 3;
  if (isErrorType(error, 'server')) return 2;
  if (isErrorType(error, 'auth')) return 0;
  if (isErrorType(error, 'validation')) return 0;
  return 1;
};