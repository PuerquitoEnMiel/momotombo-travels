export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  details?: Record<string, unknown>;
}

export class ApiException extends Error {
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(statusCode: number, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = "ApiException";
    this.statusCode = statusCode;
    this.details = details;
  }

  static isApiException(error: unknown): error is ApiException {
    return error instanceof ApiException;
  }
}
