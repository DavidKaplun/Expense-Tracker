import type {
  Category,
  CategoryFilter,
  CategorySummary,
  DeleteResponse,
  Expense,
  ExpenseStats,
  ExpenseWithCategory,
  InvoiceExtraction,
  LoginResponse,
  NewExpense,
  PeriodSummary,
  RegisterResponse,
} from '../types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

/**
 * Thrown when the API answers with a non-2xx status.
 *
 * `message` is the server's own `{ error }` text where there is one, so it is
 * safe to show to the user directly.
 */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Extracts the server's `{ error }` text, falling back to a generic message. */
function errorMessage(body: unknown, status: number): string {
  if (typeof body === 'object' && body !== null && 'error' in body) {
    const { error } = body as { error: unknown };
    if (typeof error === 'string') return error;
  }
  return `Request failed (${status})`;
}

/**
 * Sends a request and returns the parsed body, throwing ApiError on failure.
 *
 * The `as T` is the one unchecked step in this module: nothing validates the
 * payload at runtime, so T is a claim about what the server sends. It is kept
 * honest by types.ts having been written from server/routes/ rather than
 * guessed. Adding a runtime validator here would remove the cast entirely.
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init);
  const body: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(errorMessage(body, res.status), res.status);
  }

  return body as T;
}

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

function jsonHeaders(token?: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...(token ? authHeaders(token) : {}),
  };
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export function registerUser(username: string, password: string): Promise<RegisterResponse> {
  return request<RegisterResponse>('/auth/register', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ username, password }),
  });
}

export function loginUser(username: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ username, password }),
  });
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export function getCategories(
  token: string,
  filter: CategoryFilter = 'all',
): Promise<CategorySummary[]> {
  return request<CategorySummary[]>(`/categories?filter=${filter}`, {
    headers: authHeaders(token),
  });
}

export function createCategory(token: string, name: string): Promise<Category> {
  return request<Category>('/categories', {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify({ name }),
  });
}

/** Expenses in one category. These are not joined with their category. */
export function getCategoryExpenses(
  token: string,
  categoryName: string,
  { month, year }: { month?: string; year?: string } = {},
): Promise<Expense[]> {
  const params = new URLSearchParams();
  if (month) params.set('month', month);
  if (year) params.set('year', year);
  const query = params.toString() ? `?${params}` : '';

  return request<Expense[]>(
    `/categories/${encodeURIComponent(categoryName)}/expenses${query}`,
    { headers: authHeaders(token) },
  );
}

// ---------------------------------------------------------------------------
// Expenses
// ---------------------------------------------------------------------------

export function getExpenses(token: string): Promise<ExpenseWithCategory[]> {
  return request<ExpenseWithCategory[]>('/expenses', {
    headers: authHeaders(token),
  });
}

export function addExpense(token: string, data: NewExpense): Promise<Expense> {
  return request<Expense>('/expenses', {
    method: 'POST',
    headers: jsonHeaders(token),
    body: JSON.stringify(data),
  });
}

export function deleteExpense(token: string, id: number): Promise<DeleteResponse> {
  return request<DeleteResponse>(`/expenses/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}

export function getExpenseStats(token: string): Promise<ExpenseStats> {
  return request<ExpenseStats>('/expenses/stats', {
    headers: authHeaders(token),
  });
}

/** @param month "YYYY-MM" */
export function getMonthlySummary(token: string, month: string): Promise<PeriodSummary> {
  return request<PeriodSummary>(`/expenses/monthly?month=${month}`, {
    headers: authHeaders(token),
  });
}

export function getYearlySummary(token: string, year: number): Promise<PeriodSummary> {
  return request<PeriodSummary>(`/expenses/yearly?year=${year}`, {
    headers: authHeaders(token),
  });
}

// ---------------------------------------------------------------------------
// Invoice
// ---------------------------------------------------------------------------

/**
 * Uploads a receipt for field extraction.
 *
 * No Content-Type header: the browser sets its own multipart boundary, and
 * overriding it breaks the upload.
 */
export function extractInvoice(token: string, file: File): Promise<InvoiceExtraction> {
  const form = new FormData();
  form.append('file', file);

  return request<InvoiceExtraction>('/invoice/extract', {
    method: 'POST',
    headers: authHeaders(token),
    body: form,
  });
}
