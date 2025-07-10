import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SimplifiedLoginProps {
  onLogin: (code: string, name: string) => void;
}

export const SimplifiedLogin = ({ onLogin }: SimplifiedLoginProps) => {
  const [userCode, setUserCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('code', userCode)
        .eq('password', password)
        .eq('status', 'active')
        .single();

      if (error || !data) {
        toast({
          title: "Login Failed",
          description: "Invalid user code or password.",
          variant: "destructive",
        });
        return;
      }

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.id);

      toast({
        title: "Login Successful",
        description: `Welcome, ${data.name}!`,
      });

      onLogin(data.code, data.name);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Building className="h-8 w-8 text-primary mr-2" />
            <div>
              <CardTitle className="text-2xl">BANQUETY</CardTitle>
              <CardDescription>SK Precious Banquets</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userCode">User Code</Label>
              <Input
                id="userCode"
                type="text"
                placeholder="Enter your user code (e.g., 000, 001)"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};