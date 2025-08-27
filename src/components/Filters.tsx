import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { ExpenseFilters, EXPENSE_CATEGORIES } from "@/types/expense";

interface FiltersProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
}

const Filters = ({ filters, onFiltersChange }: FiltersProps) => {
  const handleFilterChange = (key: keyof ExpenseFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <Card className="form-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="gradient-primary rounded-lg p-2">
            <Filter className="h-4 w-4 text-white" />
          </div>
          Filter Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category-filter" className="text-sm font-medium">Category</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger className="rounded-xl border-border focus:border-primary">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="rounded-lg">All categories</SelectItem>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category} className="rounded-lg">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="start-date" className="text-sm font-medium">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="rounded-xl border-border focus:border-primary transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="end-date" className="text-sm font-medium">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="rounded-xl border-border focus:border-primary transition-colors"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Filters;