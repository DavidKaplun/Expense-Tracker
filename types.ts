/**
 * Domain types for the Expense Tracker API.
 *
 * These mirror the Prisma schema in server/prisma/schema.prisma and the
 * responses in server/routes/. They describe data *after* JSON
 * serialization, which is why dates are strings rather than Date objects.
 */

// ---------------------------------------------------------------------------
// Database models
// ---------------------------------------------------------------------------

/** A user account. `password_hash` is never sent to the client. */
export interface User {
  id: number;
  username: string;
}

/** A spending category as stored in the database. */
export interface Category {
  id: number;
  user_id: number;
  name: string;
}

/**
 * A single expense.
 *
 * `date` and `created_at` are ISO 8601 strings, not Date objects: JSON has
 * no date type, so Prisma's DateTime is serialized on the way out.
 * `date` is a date-only column, so its time component is always midnight UTC.
 */
export interface Expense {
  id: number;
  category_id: number;
  user_id: number;
  amount: number;
  description: string;
  date: string;
  invoice_path: string | null;
  created_at: string;
}

/**
 * An expense from an endpoint that joins in its category
 * (Prisma `include: { category: true }`).
 *
 * Kept separate from Expense rather than making `category` optional, because
 * which endpoints join and which don't is fixed and knowable — an optional
 * field would force needless null checks on the endpoints that always join.
 */
export interface ExpenseWithCategory extends Expense {
  category: Category;
}

// ---------------------------------------------------------------------------
// Endpoint responses
// ---------------------------------------------------------------------------

/** POST /auth/register */
export interface RegisterResponse {
  message: string;
  userId: number;
}

/** POST /auth/login */
export interface LoginResponse {
  token: string;
  userId: number;
}

/**
 * A row from GET /categories.
 *
 * This is an aggregate, not the Category model. Note that `expenses` here is
 * a *count*, while `expenses` on the Prisma Category is the list of related
 * expenses. Same name, different type — hence the separate interface.
 */
export interface CategorySummary {
  id: number;
  name: string;
  /** Number of expenses in this category within the requested period. */
  expenses: number;
  /** Sum of those expenses' amounts. */
  amount: number;
  /** This category's share of the period total, 0-100. Zero if no spending. */
  percent: number;
}

/** Time window accepted by GET /categories?filter= */
export type CategoryFilter = 'month' | 'year' | 'all';

/** GET /expenses/stats — all zero when the user has no expenses. */
export interface ExpenseStats {
  avgMonthly: number;
  avgYearly: number;
  monthCount: number;
  yearCount: number;
}

/** GET /expenses/monthly and GET /expenses/yearly */
export interface PeriodSummary {
  total: number;
  expenses: ExpenseWithCategory[];
}

/** DELETE /expenses/:id */
export interface DeleteResponse {
  message: string;
}

/**
 * POST /invoice/extract — fields parsed out of an uploaded receipt.
 *
 * Every extracted field is nullable: the model returns null for anything it
 * can't determine. `category` is typed as a plain string, not a union of the
 * known category names — the model is *asked* for one of them, but nothing
 * validates the response, so a narrower type would be a promise the code
 * can't keep.
 */
export interface InvoiceExtraction {
  description: string | null;
  amount: number | null;
  /** "YYYY-MM-DD", or null if undetermined. */
  date: string | null;
  category: string | null;
  /** Scans consumed this month, including this one. */
  scansUsed: number;
  /** Monthly scan allowance. */
  scansLimit: number;
}

// ---------------------------------------------------------------------------
// Request payloads
// ---------------------------------------------------------------------------

/** Body for POST /expenses. */
export interface NewExpense {
  amount: number;
  description: string;
  /** "YYYY-MM-DD". */
  date: string;
  category_id: number;
  invoice_path?: string | null;
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

/** Shape every endpoint uses for a failure response. */
export interface ApiErrorBody {
  error: string;
}
