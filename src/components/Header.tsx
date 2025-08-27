import { DollarSign, TrendingUp } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border shadow-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary rounded-xl blur-sm opacity-20"></div>
              <div className="relative gradient-primary rounded-xl p-3">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">ExpenseTracker</h1>
              <p className="text-sm text-muted-foreground">Smart expense management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-primary">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium">Stay on budget</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;