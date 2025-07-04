import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Building, LogIn } from "lucide-react";

interface EmployeeLoginProps {
  onLogin: (employeeCode: string) => void;
}

export function EmployeeLogin({ onLogin }: EmployeeLoginProps) {
  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeCode || !password) {
      toast({
        title: "Error",
        description: "Please enter both employee code and password",
        variant: "destructive",
      });
      return;
    }

    // Validate employee code (001-010)
    const codeNum = parseInt(employeeCode);
    if (isNaN(codeNum) || codeNum < 1 || codeNum > 10) {
      toast({
        title: "Error",
        description: "Invalid employee code. Please enter a code between 001-010",
        variant: "destructive",
      });
      return;
    }

    // Validate password (default: "admin")
    if (password !== "admin") {
      toast({
        title: "Error",
        description: "Incorrect password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Format code to 3 digits
    const formattedCode = codeNum.toString().padStart(3, '0');
    
    setTimeout(() => {
      onLogin(formattedCode);
      setIsLoading(false);
      toast({
        title: "Login Successful",
        description: `Welcome, Employee ${formattedCode}`,
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Building className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">BANQUETY</CardTitle>
          <CardDescription>
            Employee Access Portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employeeCode">Employee Code</Label>
              <Input
                id="employeeCode"
                type="text"
                placeholder="Enter your employee code (001-010)"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                maxLength={3}
                className="text-base" // Better for mobile
              />
              <p className="text-xs text-muted-foreground">
                Enter your 3-digit employee code (001-010)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-base" // Better for mobile
              />
              <p className="text-xs text-muted-foreground">
                Default password: admin
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                "Logging in..."
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}