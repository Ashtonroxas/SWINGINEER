import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import { useState } from "react";
import { Expense } from "@/types/expense";

interface ExpenseChartProps {
  expenses: Expense[];
}

const ExpenseChart = ({ expenses }: ExpenseChartProps) => {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (acc[category]) {
      acc[category] += expense.amount;
    } else {
      acc[category] = expense.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryData).map(([category, amount]) => ({
    category,
    amount,
    percentage: ((amount / expenses.reduce((sum, exp) => sum + exp.amount, 0)) * 100).toFixed(1)
  }));

  const COLORS = [
    'hsl(217, 91%, 60%)', // Primary
    'hsl(142, 76%, 36%)', // Secondary
    'hsl(25, 95%, 53%)',  // Accent
    'hsl(43, 96%, 56%)',  // Warning
    'hsl(0, 84%, 60%)',   // Destructive
    'hsl(262, 83%, 58%)', // Purple
    'hsl(173, 58%, 39%)', // Teal
    'hsl(198, 93%, 60%)', // Cyan
    'hsl(220, 9%, 46%)'   // Muted
  ];

  if (expenses.length === 0) {
    return (
      <Card className="expense-card text-center py-12">
        <CardContent>
          <div className="gradient-accent rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <PieChartIcon className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No data to display</h3>
          <p className="text-muted-foreground">Add some expenses to see your spending breakdown.</p>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-xl p-3 shadow-elevated">
          <p className="font-medium">{label || payload[0].payload.category}</p>
          <p className="text-primary font-semibold">
            ${payload[0].value.toFixed(2)}
          </p>
          {payload[0].payload.percentage && (
            <p className="text-sm text-muted-foreground">
              {payload[0].payload.percentage}% of total
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="expense-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="gradient-accent rounded-lg p-2">
            <PieChartIcon className="h-5 w-5 text-white" />
          </div>
          Expense Breakdown
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={chartType === 'pie' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('pie')}
            className="h-8"
          >
            <PieChartIcon className="h-3 w-3" />
            Pie
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
            className="h-8"
          >
            <BarChart3 className="h-3 w-3" />
            Bar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'pie' ? (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category} (${percentage}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                  className="animate-fade-in"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} className="animate-fade-in">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Category Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
          {chartData.map((item, index) => (
            <div key={item.category} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs text-muted-foreground truncate">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;