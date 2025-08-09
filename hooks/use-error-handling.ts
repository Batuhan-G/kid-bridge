import { useState, useCallback } from 'react';
import { processApiError, formatErrorForToast, isAuthenticationError } from '@/utils/error-handling';
import { useAuth } from '@/lib/auth-context';

interface UseErrorHandlingOptions {
  showToast?: boolean;
  logErrors?: boolean;
  context?: string;
}

interface ErrorState {
  error: string | null;
  isError: boolean;
  errorDetails?: any;
}

export const useErrorHandling = (options: UseErrorHandlingOptions = {}) => {
  const { showToast = false, logErrors = true, context = 'unknown' } = options;
  const { logout } = useAuth();
  
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false,
    errorDetails: null
  });

  const handleError = useCallback((error: any, customContext?: string) => {
    const processedError = processApiError(error);
    const errorContext = customContext || context;

    // Log error if enabled
    if (logErrors) {
      console.error(`Error in ${errorContext}:`, {
        originalMessage: processedError.originalMessage,
        translatedMessage: processedError.translatedMessage,
        statusCode: processedError.statusCode,
        error,
        timestamp: new Date().toISOString()
      });
    }

    // Set error state
    setErrorState({
      error: processedError.translatedMessage,
      isError: true,
      errorDetails: processedError
    });

    // Handle authentication errors
    if (isAuthenticationError(error)) {
      logout();
      return;
    }

    // Show toast if enabled (you'll need to implement toast system)
    if (showToast) {
      const toastData = formatErrorForToast(error, errorContext);
      console.log('Toast would show:', toastData);
    }

    return processedError.translatedMessage;
  }, [context, logErrors, showToast, logout]);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isError: false,
      errorDetails: null
    });
  }, []);

  const withErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    errorContext?: string
  ): Promise<T | null> => {
    try {
      clearError();
      return await operation();
    } catch (error) {
      handleError(error, errorContext);
      return null;
    }
  }, [handleError, clearError]);

  const safeAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    fallback?: T
  ): Promise<T | undefined> => {
    try {
      clearError();
      return await operation();
    } catch (error) {
      handleError(error);
      return fallback;
    }
  }, [handleError, clearError]);

  return {
    error: errorState.error,
    isError: errorState.isError,
    errorDetails: errorState.errorDetails,
    
    handleError,
    clearError,
    withErrorHandling,
    safeAsync
  };
};