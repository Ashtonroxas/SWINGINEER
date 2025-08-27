import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit3, Calendar, DollarSign, Tag } from "lucide-react";
import { Expense, EXPENSE_CATEGORIES } from "@/types/expense";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onEditExpense: (id: string, expense: Omit<Expense, 'id'>) => void;
}

const ExpenseList = ({ expenses, onDeleteExpense, onEditExpense }: ExpenseListProps) => {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: ""
  });

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setEditForm({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;

    onEditExpense(editingExpense.id, {
      title: editForm.title,
      amount: parseFloat(editForm.amount),
      category: editForm.category,
      date: editForm.date,
      createdAt: editingExpense.createdAt
    });

    setEditingExpense(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Food & Dining": "bg-orange-100 text-orange-700 border-orange-200",
      "Transportation": "bg-blue-100 text-blue-700 border-blue-200",
      "Shopping": "bg-purple-100 text-purple-700 border-purple-200",
      "Entertainment": "bg-pink-100 text-pink-700 border-pink-200",
      "Bills & Utilities": "bg-red-100 text-red-700 border-red-200",
      "Healthcare": "bg-green-100 text-green-700 border-green-200",
      "Travel": "bg-cyan-100 text-cyan-700 border-cyan-200",
      "Education": "bg-indigo-100 text-indigo-700 border-indigo-200",
      "Other": "bg-gray-100 text-gray-700 border-gray-200"
    };
    return colors[category as keyof typeof colors] || colors["Other"];
  };

  if (expenses.length === 0) {
    return (
      <Card className="expense-card text-center py-12">
        <CardContent>
          <div className="gradient-primary rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No expenses yet</h3>
          <p className="text-muted-foreground">Start tracking your expenses by adding your first one above.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="expense-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="gradient-success rounded-lg p-2">
            <Tag className="h-5 w-5 text-white" />
          </div>
          Recent Expenses ({expenses.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border hover:bg-muted/50 transition-colors animate-slide-up"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex flex-col">
                  <h4 className="font-semibold text-foreground">{expense.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge className={`text-xs ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(expense.date)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-primary">
                  ${expense.amount.toFixed(2)}
                </span>
                
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(expense)}
                        className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Expense</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-title">Title</Label>
                          <Input
                            id="edit-title"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="rounded-xl"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-amount">Amount</Label>
                          <Input
                            id="edit-amount"
                            type="number"
                            step="0.01"
                            value={editForm.amount}
                            onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                            className="rounded-xl"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-category">Category</Label>
                          <Select
                            value={editForm.category}
                            onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                          >
                            <SelectTrigger className="rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {EXPENSE_CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-date">Date</Label>
                          <Input
                            id="edit-date"
                            type="date"
                            value={editForm.date}
                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            className="rounded-xl"
                            required
                          />
                        </div>
                        
                        <Button type="submit" className="w-full">
                          Update Expense
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteExpense(expense.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseList;