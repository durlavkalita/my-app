declare enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

declare enum FinanceType {
  Expense = "expense",
  Income = "income",
}

declare enum FinanceMethod {
  Cash = "cash",
  UPI = "upi",
  Credit = "credit",
  Other = "other",
}

declare type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  reminder?: string;
  tags?: string[];
};

declare type Finance = {
  id: string;
  amount: string;
  method: FinanceMethod;
  date: string;
  description?: string;
  financeType: FinanceType;
};
