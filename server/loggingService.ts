/**
 * Advanced Logging Service for Mystic Fortune Platform
 * Provides comprehensive logging, error tracking, and debugging capabilities
 */

import fs from 'fs';
import path from 'path';

interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  meta?: any;
  userId?: number;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
  endpoint?: string;
  duration?: number;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class LoggingService {
  private logsDir: string;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 100;
  private flushInterval = 5000; // 5 seconds

  constructor() {
    this.logsDir = path.join(process.cwd(), 'logs');
    this.ensureLogsDirectory();
    this.startBufferFlush();
  }

  private ensureLogsDirectory() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  private startBufferFlush() {
    setInterval(() => {
      this.flushBuffer();
    }, this.flushInterval);
  }

  private flushBuffer() {
    if (this.logBuffer.length === 0) return;

    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(this.logsDir, `${today}.log`);
    
    const logEntries = this.logBuffer.splice(0, this.maxBufferSize);
    const logLines = logEntries.map(entry => JSON.stringify(entry)).join('\n') + '\n';

    try {
      fs.appendFileSync(logFile, logLines);
    } catch (error) {
      console.error('Failed to write logs to file:', error);
    }
  }

  public log(level: LogEntry['level'], message: string, meta?: any, context?: Partial<LogEntry>) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      meta,
      ...context
    };

    // Add to buffer for file logging
    this.logBuffer.push(entry);

    // Also log to console with proper formatting
    const logMessage = `[${entry.timestamp.toISOString()}] ${level.toUpperCase()}: ${message}`;
    
    switch (level) {
      case 'error':
        console.error(logMessage, meta);
        break;
      case 'warn':
        console.warn(logMessage, meta);
        break;
      case 'debug':
        console.debug(logMessage, meta);
        break;
      default:
        console.log(logMessage, meta);
    }

    // Force flush if buffer is full
    if (this.logBuffer.length >= this.maxBufferSize) {
      this.flushBuffer();
    }
  }

  public info(message: string, meta?: any, context?: Partial<LogEntry>) {
    this.log('info', message, meta, context);
  }

  public warn(message: string, meta?: any, context?: Partial<LogEntry>) {
    this.log('warn', message, meta, context);
  }

  public error(message: string, error?: Error, meta?: any, context?: Partial<LogEntry>) {
    const errorMeta = error ? {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      ...meta
    } : meta;

    this.log('error', message, errorMeta, context);
  }

  public debug(message: string, meta?: any, context?: Partial<LogEntry>) {
    this.log('debug', message, meta, context);
  }

  // API request logging middleware
  public logRequest(req: any, res: any, duration: number) {
    this.info(`${req.method} ${req.originalUrl}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id,
      sessionId: req.sessionID
    }, {
      endpoint: req.originalUrl,
      duration,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  }

  // Analytics event logging
  public logAnalyticsEvent(event: string, data: any, context?: Partial<LogEntry>) {
    this.info(`Analytics: ${event}`, data, {
      ...context,
      endpoint: '/analytics'
    });
  }

  // AI service logging
  public logAIRequest(service: string, operation: string, duration: number, success: boolean, meta?: any) {
    const level = success ? 'info' : 'warn';
    this.log(level, `AI ${service}: ${operation}`, {
      duration: `${duration}ms`,
      success,
      ...meta
    }, {
      duration,
      endpoint: `/ai/${service}`
    });
  }

  // Database operation logging
  public logDatabaseOperation(operation: string, table: string, duration: number, success: boolean, meta?: any) {
    const level = success ? 'debug' : 'error';
    this.log(level, `DB ${operation} on ${table}`, {
      duration: `${duration}ms`,
      success,
      ...meta
    }, {
      duration,
      endpoint: '/database'
    });
  }

  // User action logging
  public logUserAction(action: string, userId: number, sessionId: string, meta?: any) {
    this.info(`User Action: ${action}`, meta, {
      userId,
      sessionId,
      endpoint: '/user-action'
    });
  }

  // Error tracking for specific features
  public logFortuneGeneration(category: string, success: boolean, duration: number, userId?: number, error?: Error) {
    if (success) {
      this.info(`Fortune generated: ${category}`, {
        category,
        duration: `${duration}ms`
      }, {
        userId,
        duration,
        endpoint: '/api/fortunes'
      });
    } else {
      this.error(`Fortune generation failed: ${category}`, error, {
        category,
        duration: `${duration}ms`
      }, {
        userId,
        duration,
        endpoint: '/api/fortunes'
      });
    }
  }

  public logViralPrediction(contentType: string, platform: string, score: number, success: boolean, duration: number) {
    this.info(`Viral prediction: ${contentType} on ${platform}`, {
      contentType,
      platform,
      viralScore: score,
      duration: `${duration}ms`,
      success
    }, {
      duration,
      endpoint: '/api/promotion/viral-prediction'
    });
  }

  // Get recent logs for admin dashboard
  public async getRecentLogs(hours: number = 24, level?: LogEntry['level']): Promise<LogEntry[]> {
    const recentLogs: LogEntry[] = [];
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    // Get logs from buffer first
    const bufferLogs = this.logBuffer.filter(log => 
      log.timestamp >= cutoffTime && 
      (!level || log.level === level)
    );
    recentLogs.push(...bufferLogs);

    // Get logs from recent files
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    for (const date of [today, yesterday]) {
      const logFile = path.join(this.logsDir, `${date}.log`);
      
      if (fs.existsSync(logFile)) {
        try {
          const fileContent = fs.readFileSync(logFile, 'utf-8');
          const lines = fileContent.trim().split('\n').filter(line => line);
          
          for (const line of lines) {
            try {
              const logEntry = JSON.parse(line) as LogEntry;
              logEntry.timestamp = new Date(logEntry.timestamp);
              
              if (logEntry.timestamp >= cutoffTime && (!level || logEntry.level === level)) {
                recentLogs.push(logEntry);
              }
            } catch (parseError) {
              // Skip malformed log entries
            }
          }
        } catch (error) {
          this.error('Failed to read log file', error as Error, { file: logFile });
        }
      }
    }

    // Sort by timestamp descending and limit to reasonable number
    return recentLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 100);
  }

  // Get error summary for monitoring
  public async getErrorSummary(hours: number = 24): Promise<any> {
    const errorLogs = await this.getRecentLogs(hours, 'error');
    
    const errorsByEndpoint: { [key: string]: number } = {};
    const errorsByType: { [key: string]: number } = {};
    let totalErrors = 0;

    for (const log of errorLogs) {
      totalErrors++;
      
      if (log.endpoint) {
        errorsByEndpoint[log.endpoint] = (errorsByEndpoint[log.endpoint] || 0) + 1;
      }
      
      if (log.error?.name) {
        errorsByType[log.error.name] = (errorsByType[log.error.name] || 0) + 1;
      }
    }

    return {
      totalErrors,
      errorsByEndpoint,
      errorsByType,
      recentErrors: errorLogs.slice(0, 10)
    };
  }

  // Performance metrics
  public async getPerformanceMetrics(hours: number = 24): Promise<any> {
    const logs = await this.getRecentLogs(hours);
    
    const endpointMetrics: { [key: string]: { count: number; totalDuration: number; avgDuration: number } } = {};
    
    for (const log of logs) {
      if (log.endpoint && log.duration) {
        if (!endpointMetrics[log.endpoint]) {
          endpointMetrics[log.endpoint] = { count: 0, totalDuration: 0, avgDuration: 0 };
        }
        
        endpointMetrics[log.endpoint].count++;
        endpointMetrics[log.endpoint].totalDuration += log.duration;
        endpointMetrics[log.endpoint].avgDuration = 
          endpointMetrics[log.endpoint].totalDuration / endpointMetrics[log.endpoint].count;
      }
    }

    return endpointMetrics;
  }

  // Cleanup old logs
  public cleanupOldLogs(daysToKeep: number = 30) {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    try {
      const files = fs.readdirSync(this.logsDir);
      
      for (const file of files) {
        if (!file.endsWith('.log')) continue;
        
        const fileDate = new Date(file.replace('.log', ''));
        if (fileDate < cutoffDate) {
          const filePath = path.join(this.logsDir, file);
          fs.unlinkSync(filePath);
          this.info(`Cleaned up old log file: ${file}`);
        }
      }
    } catch (error) {
      this.error('Failed to cleanup old logs', error as Error);
    }
  }
}

export const loggingService = new LoggingService();

// Request logging middleware
export function requestLoggingMiddleware(req: any, res: any, next: any) {
  const startTime = Date.now();
  
  // Log request start
  loggingService.debug(`Request started: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id
  });

  // Override res.end to log when request completes
  const originalEnd = res.end;
  res.end = function(chunk: any, encoding: any) {
    const duration = Date.now() - startTime;
    loggingService.logRequest(req, res, duration);
    originalEnd.call(res, chunk, encoding);
  };

  next();
}

// Error handling middleware
export function errorLoggingMiddleware(err: Error, req: any, res: any, next: any) {
  loggingService.error(`Unhandled error in ${req.method} ${req.originalUrl}`, err, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    body: req.body,
    params: req.params,
    query: req.query
  }, {
    endpoint: req.originalUrl,
    userId: req.user?.id,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  next(err);
}