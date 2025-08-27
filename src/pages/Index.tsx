import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import Filters from "@/components/Filters";
import ExpenseChart from "@/components/ExpenseChart";
import ExpenseStats from "@/components/ExpenseStats";
import { Expense, ExpenseFilters } from "@/types/expense";

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      title: "Grocery Shopping",
      amount: 85.50,
      category: "Food & Dining",
      date: "2024-01-15",
      createdAt: "2024-01-15T10:00:00Z"
    },
    {
      id: "2",
      title: "Gas Station",
      amount: 45.00,
      category: "Transportation",
      date: "2024-01-14",
      createdAt: "2024-01-14T15:30:00Z"
    },
    {
      id: "3",
      title: "Netflix Subscription",
      amount: 15.99,
      category: "Entertainment",
      date: "2024-01-10",
      createdAt: "2024-01-10T09:00:00Z"
    }
  ]);

  const [filters, setFilters] = useState<ExpenseFilters>({
    category: "all",
    startDate: "",
    endDate: ""
  });

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesCategory = filters.category === "all" || expense.category === filters.category;
      const matchesStartDate = !filters.startDate || expense.date >= filters.startDate;
      const matchesEndDate = !filters.endDate || expense.date <= filters.endDate;
      
      return matchesCategory && matchesStartDate && matchesEndDate;
    });
  }, [expenses, filters]);

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString()
    };
    
    setExpenses(prev => [newExpense, ...prev]);
    toast({
      title: "Expense Added",
      description: `Successfully added ${expenseData.title} for $${expenseData.amount.toFixed(2)}`,
    });
  };

  const handleEditExpense = (id: string, expenseData: Omit<Expense, 'id'>) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === id ? { ...expenseData, id } : expense
      )
    );
    toast({
      title: "Expense Updated",
      description: `Successfully updated ${expenseData.title}`,
    });
  };

  const handleDeleteExpense = (id: string) => {
    const expenseToDelete = expenses.find(exp => exp.id === id);
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    toast({
      title: "Expense Deleted",
      description: expenseToDelete ? `Deleted ${expenseToDelete.title}` : "Expense deleted",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <ExpenseStats expenses={expenses} />
        
        {/* Add Expense Form */}
        <ExpenseForm onAddExpense={handleAddExpense} />
        
        {/* Filters */}
        <Filters filters={filters} onFiltersChange={setFilters} />
        
        {/* Chart and List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ExpenseChart expenses={filteredExpenses} />
          <ExpenseList 
            expenses={filteredExpenses}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
