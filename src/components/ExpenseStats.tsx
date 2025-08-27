import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { Expense } from "@/types/expense";

interface ExpenseStatsProps {
  expenses: Expense[];
}

const ExpenseStats = ({ expenses }: ExpenseStatsProps) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate this month's expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });
  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate last month's expenses for comparison
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
  });
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate average expense
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;

  // Calculate month-over-month change
  const monthlyChange = lastMonthTotal > 0 
    ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 
    : 0;

  const stats = [
    {
      title: "Total Expenses",
      value: `$${totalExpenses.toFixed(2)}`,
      icon: DollarSign,
      gradient: "gradient-primary",
      change: null
    },
    {
      title: "This Month",
      value: `$${thisMonthTotal.toFixed(2)}`,
      icon: Calendar,
      gradient: "gradient-success",
      change: {
        value: Math.abs(monthlyChange),
        isPositive: monthlyChange < 0, // For expenses, lower is better
        label: monthlyChange === 0 ? "No change" : `${Math.abs(monthlyChange).toFixed(1)}% vs last month`
      }
    },
    {
      title: "Average Expense",
      value: `$${averageExpense.toFixed(2)}`,
      icon: TrendingUp,
      gradient: "gradient-accent",
      change: null
    },
    {
      title: "Total Transactions",
      value: expenses.length.toString(),
      icon: TrendingDown,
      gradient: "gradient-success",
      change: null
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="stat-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`${stat.gradient} rounded-lg p-2`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            {stat.change && (
              <p className={`text-xs flex items-center gap-1 ${
                stat.change.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change.isPositive ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <TrendingUp className="h-3 w-3" />
                )}
                {stat.change.label}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExpenseStats;