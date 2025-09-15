import { toast } from "@/hooks/use-toast";

// Error types for better categorization
export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API', 
  VALIDATION = 'VALIDATION',
  PERMISSION = 'PERMISSION',
  STORAGE = 'STORAGE',
  AI_SERVICE = 'AI_SERVICE',
  PAYMENT = 'PAYMENT',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  stack?: string;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: AppError[] = [];
  private isOnline = navigator.onLine;

  constructor() {
    // Monitor network status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrorQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Global error handlers
    window.addEventListener('error', (event) => {
      this.logError({
        type: ErrorType.UNKNOWN,
        message: event.message,
        details: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        },
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: ErrorType.UNKNOWN,
        message: 'Unhandled Promise Rejection',
        details: event.reason,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    });
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Main error logging method
  logError(error: AppError): void {
    // Add to local storage for persistence
    this.saveErrorLocally(error);

    // Add to queue for server transmission
    this.errorQueue.push(error);

    // Try to send immediately if online
    if (this.isOnline) {
      this.flushErrorQueue();
    }

    // Show user-friendly message
    this.showUserFriendlyMessage(error);
  }

  // Helper method for common error scenarios
  handleApiError(error: any, context: string): void {
    let errorType = ErrorType.API;
    let message = 'Something went wrong. Please try again.';
    let userMessage = message;

    if (!navigator.onLine) {
      errorType = ErrorType.NETWORK;
      message = 'Network connection lost';
      userMessage = '🌐 Connection lost. Check your internet and try again.';
    } else if (error.status >= 500) {
      message = 'Server error';
      userMessage = '⚡ Our servers are having a moment. Please try again shortly.';
    } else if (error.status === 404) {
      message = 'Resource not found';
      userMessage = '🔍 We couldn\'t find what you\'re looking for.';
    } else if (error.status === 403) {
      errorType = ErrorType.PERMISSION;
      message = 'Permission denied';
      userMessage = '🔒 You don\'t have permission for this action.';
    } else if (error.status === 429) {
      message = 'Rate limit exceeded';
      userMessage = '⏰ Whoa there! Please wait a moment before trying again.';
    }

    this.logError({
      type: errorType,
      message: `${context}: ${message}`,
      details: {
        status: error.status,
        statusText: error.statusText,
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      },
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userId: this.getUserId(),
      sessionId: this.getSessionId()
    });

    // Show user-friendly toast
    toast({
      title: "Oops!",
      description: userMessage,
      variant: "destructive"
    });
  }

  // Handle AI service specific errors
  handleAIError(error: any, context: string): void {
    let userMessage = '🤖 Our AI is taking a mystical break. Please try again.';
    
    if (error.message?.includes('quota')) {
      userMessage = '✨ High demand! Our mystics are busy. Try again in a moment.';
    } else if (error.message?.includes('timeout')) {
      userMessage = '⏰ The spirits are taking their time. Please wait and try again.';
    }

    this.logError({
      type: ErrorType.AI_SERVICE,
      message: `AI Service Error in ${context}: ${error.message}`,
      details: error,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userId: this.getUserId(),
      sessionId: this.getSessionId()
    });

    toast({
      title: "AI Service Unavailable",
      description: userMessage,
      variant: "destructive"
    });
  }

  // Handle payment errors
  handlePaymentError(error: any): void {
    let userMessage = '💳 Payment processing issue. Please try again or contact support.';
    
    if (error.code === 'card_declined') {
      userMessage = '💳 Your card was declined. Please try a different payment method.';
    } else if (error.code === 'insufficient_funds') {
      userMessage = '💰 Insufficient funds. Please check your account balance.';
    }

    this.logError({
      type: ErrorType.PAYMENT,
      message: `Payment Error: ${error.message}`,
      details: error,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userId: this.getUserId(),
      sessionId: this.getSessionId()
    });

    toast({
      title: "Payment Issue",
      description: userMessage,
      variant: "destructive"
    });
  }

  // Recovery suggestions based on error type
  getRecoverySuggestions(errorType: ErrorType): string[] {
    switch (errorType) {
      case ErrorType.NETWORK:
        return [
          'Check your internet connection',
          'Try refreshing the page',
          'Switch to a different network if available'
        ];
      case ErrorType.AI_SERVICE:
        return [
          'Wait a moment and try again',
          'Try a different fortune category',
          'Use the basic fortune option instead'
        ];
      case ErrorType.PAYMENT:
        return [
          'Check your payment details',
          'Try a different card or payment method',
          'Contact your bank if the issue persists'
        ];
      case ErrorType.STORAGE:
        return [
          'Clear browser cache and cookies',
          'Free up storage space',
          'Try using private/incognito mode'
        ];
      default:
        return [
          'Refresh the page',
          'Try again in a few moments',
          'Contact support if the problem continues'
        ];
    }
  }

  // Show contextual user-friendly messages
  private showUserFriendlyMessage(error: AppError): void {
    const suggestions = this.getRecoverySuggestions(error.type);
    
    // Don't show duplicate messages for the same error type within 5 seconds
    const recentErrors = this.getRecentErrors(5000);
    const isDuplicate = recentErrors.some(e => e.type === error.type);
    
    if (!isDuplicate) {
      toast({
        title: this.getErrorTitle(error.type),
        description: error.message,
        variant: "destructive",
        action: suggestions.length > 0 ? {
          altText: "Show help",
          children: "💡 Help",
          onClick: () => this.showRecoveryHelp(error.type)
        } : undefined
      });
    }
  }

  private getErrorTitle(type: ErrorType): string {
    switch (type) {
      case ErrorType.NETWORK: return "🌐 Connection Issue";
      case ErrorType.AI_SERVICE: return "🤖 AI Service Issue";
      case ErrorType.PAYMENT: return "💳 Payment Issue";
      case ErrorType.VALIDATION: return "📝 Input Issue";
      case ErrorType.PERMISSION: return "🔒 Access Issue";
      case ErrorType.STORAGE: return "💾 Storage Issue";
      default: return "⚠️ Something went wrong";
    }
  }

  private showRecoveryHelp(errorType: ErrorType): void {
    const suggestions = this.getRecoverySuggestions(errorType);
    
    toast({
      title: "💡 Here's how to fix this:",
      description: suggestions.join('\n• '),
      duration: 8000
    });
  }

  // Save error to localStorage for offline persistence
  private saveErrorLocally(error: AppError): void {
    try {
      const existingErrors = JSON.parse(localStorage.getItem('mystic-error-log') || '[]');
      existingErrors.push(error);
      
      // Keep only last 100 errors to prevent storage overflow
      if (existingErrors.length > 100) {
        existingErrors.splice(0, existingErrors.length - 100);
      }
      
      localStorage.setItem('mystic-error-log', JSON.stringify(existingErrors));
    } catch (e) {
      console.warn('Could not save error to localStorage:', e);
    }
  }

  // Send errors to server when online
  private async flushErrorQueue(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    try {
      const errorsToSend = [...this.errorQueue];
      this.errorQueue = [];

      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ errors: errorsToSend })
      });

      console.log(`Sent ${errorsToSend.length} error reports to server`);
    } catch (error) {
      // If sending fails, put errors back in queue
      this.errorQueue = [...this.errorQueue, ...this.errorQueue];
      console.warn('Failed to send error reports:', error);
    }
  }

  private getRecentErrors(timeWindow: number): AppError[] {
    try {
      const errors = JSON.parse(localStorage.getItem('mystic-error-log') || '[]');
      const cutoff = Date.now() - timeWindow;
      return errors.filter((error: AppError) => 
        new Date(error.timestamp).getTime() > cutoff
      );
    } catch {
      return [];
    }
  }

  private getUserId(): string | undefined {
    return localStorage.getItem('mystic-user-id') || undefined;
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('mystic-session-id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('mystic-session-id', sessionId);
    }
    return sessionId;
  }

  // Public method to get error statistics for admin
  getErrorStats(): any {
    try {
      const errors = JSON.parse(localStorage.getItem('mystic-error-log') || '[]');
      const stats = {
        total: errors.length,
        byType: {} as Record<string, number>,
        recent: this.getRecentErrors(24 * 60 * 60 * 1000).length
      };

      errors.forEach((error: AppError) => {
        stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      });

      return stats;
    } catch {
      return { total: 0, byType: {}, recent: 0 };
    }
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Convenience methods
export const logError = (type: ErrorType, message: string, details?: any) => {
  errorHandler.logError({
    type,
    message,
    details,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userId: errorHandler['getUserId'](),
    sessionId: errorHandler['getSessionId']()
  });
};

export const handleApiError = (error: any, context: string) => {
  errorHandler.handleApiError(error, context);
};

export const handleAIError = (error: any, context: string) => {
  errorHandler.handleAIError(error, context);
};

export const handlePaymentError = (error: any) => {
  errorHandler.handlePaymentError(error);
};