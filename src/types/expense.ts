export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  createdAt?: string;
}

export interface ExpenseFilters {
  category: string;
  startDate: string;
  endDate: string;
}

export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Education",
  "Other"
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];