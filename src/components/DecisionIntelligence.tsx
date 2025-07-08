import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/hooks/use-toast";
import { TrendingUp, AlertTriangle, DollarSign, Calendar as CalendarIcon, Users, Star, Activity, Brain, Target, Zap } from "lucide-react";

interface LeadScore {
  id: string;
  leadName: string;
  score: number;
  likelihood: "Hot" | "Warm" | "Cold";
  factors: string[];
  occasion: string;
  pax: number;
  budget: string;
  source: string;
}

interface PaymentRisk {
  id: string;
  leadName: string;
  riskLevel: "High" | "Medium" | "Low";
  riskFactors: string[];
  confidence: number;
  eventDate: string;
  amount: number;
}

interface DemandAlert {
  date: string;
  demand: number;
  bookings: number;
  suggestedPricing: string;
  alertLevel: "High" | "Medium" | "Low";
}

export function DecisionIntelligence() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const [leadScores] = useState<LeadScore[]>([
    {
      id: "1",
      leadName: "Sarah & John Wedding",
      score: 92,
      likelihood: "Hot",
      factors: ["Premium budget range", "Peak season", "High-end requirements", "Referral source"],
      occasion: "Wedding",
      pax: 250,
      budget: "₹5,00,000 - ₹7,50,000",
      source: "Referral"
    },
    {
      id: "2",
      leadName: "Sharma Family Function",
      score: 73,
      likelihood: "Warm",
      factors: ["Mid-range budget", "Flexible date", "Previous client family"],
      occasion: "Family Function",
      pax: 150,
      budget: "₹2,50,000 - ₹4,00,000",
      source: "WeddingWire"
    },
    {
      id: "3",
      leadName: "Corporate Event - TechCorp",
      score: 45,
      likelihood: "Cold",
      factors: ["Budget constraints", "Multiple venue comparison", "Off-season"],
      occasion: "Corporate",
      pax: 100,
      budget: "₹1,50,000 - ₹2,00,000",
      source: "Website"
    }
  ]);

  const [paymentRisks] = useState<PaymentRisk[]>([
    {
      id: "1",
      leadName: "Patel Reception",
      riskLevel: "High",
      riskFactors: ["First-time client", "Large event scale", "Delayed response pattern"],
      confidence: 78,
      eventDate: "2024-03-15",
      amount: 450000
    },
    {
      id: "2",
      leadName: "Kumar Anniversary",
      riskLevel: "Medium",
      riskFactors: ["Mid-range budget", "Payment timeline concerns"],
      confidence: 65,
      eventDate: "2024-02-28",
      amount: 180000
    }
  ]);

  const [demandAlerts] = useState<DemandAlert[]>([
    {
      date: "2024-03-15",
      demand: 95,
      bookings: 8,
      suggestedPricing: "+15% premium",
      alertLevel: "High"
    },
    {
      date: "2024-04-12",
      demand: 78,
      bookings: 5,
      suggestedPricing: "+8% premium",
      alertLevel: "Medium"
    },
    {
      date: "2024-05-20",
      demand: 92,
      bookings: 7,
      suggestedPricing: "+12% premium",
      alertLevel: "High"
    }
  ]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDemandColor = (level: string) => {
    switch (level) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const generateAIInsight = () => {
    toast({
      title: "AI Insight Generated",
      description: "New recommendations have been generated based on latest data patterns",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Decision Intelligence MCPs</h2>
          <p className="text-muted-foreground">AI-powered insights for critical business decisions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateAIInsight}>
            <Brain className="w-4 h-4 mr-2" />
            Generate AI Insights
          </Button>
          <Button variant="outline">
            <Activity className="w-4 h-4 mr-2" />
            Model Performance
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {leadScores.filter(l => l.likelihood === "Hot").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Score ≥ 80
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {paymentRisks.filter(r => r.riskLevel === "High").length}
            </div>
            <p className="text-xs text-muted-foreground">
              High risk flagged
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Surge Dates</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {demandAlerts.filter(d => d.alertLevel === "High").length}
            </div>
            <p className="text-xs text-muted-foreground">
              High demand periods
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">
              Model accuracy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Alert className="border-orange-200 bg-orange-50">
          <Zap className="h-4 w-4" />
          <AlertTitle>High Demand Alert</AlertTitle>
          <AlertDescription>
            March 15th shows 95% demand surge. Consider applying +15% premium pricing.
          </AlertDescription>
        </Alert>
        
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Payment Risk Warning</AlertTitle>
          <AlertDescription>
            2 high-risk bookings detected. Review payment terms and advance requirements.
          </AlertDescription>
        </Alert>
      </div>

      {/* MCP-01: Lead Qualification Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            MCP-01: Lead Qualification Scores
          </CardTitle>
          <CardDescription>AI-generated likelihood to convert scores</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead Name</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Likelihood</TableHead>
                <TableHead>Occasion</TableHead>
                <TableHead>Pax</TableHead>
                <TableHead>Key Factors</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leadScores.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.leadName}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={lead.score} className="w-16" />
                      <span className="text-sm font-medium">{lead.score}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getScoreColor(lead.score)}>
                      {lead.likelihood}
                    </Badge>
                  </TableCell>
                  <TableCell>{lead.occasion}</TableCell>
                  <TableCell>{lead.pax}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          View Factors
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>AI Analysis for {lead.leadName}</DialogTitle>
                          <DialogDescription>
                            Key factors contributing to the qualification score
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                          {lead.factors.map((factor, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <span className="text-sm">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      Prioritize
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MCP-04: Payment Risk Flags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            MCP-04: Payment Risk Assessment
          </CardTitle>
          <CardDescription>AI-identified payment risk indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead Name</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Risk Factors</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentRisks.map((risk) => (
                <TableRow key={risk.id}>
                  <TableCell className="font-medium">{risk.leadName}</TableCell>
                  <TableCell>
                    <Badge className={getRiskColor(risk.riskLevel)}>
                      {risk.riskLevel} Risk
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={risk.confidence} className="w-16" />
                      <span className="text-sm">{risk.confidence}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(risk.eventDate).toLocaleDateString()}</TableCell>
                  <TableCell>₹{risk.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Payment Risk Analysis</DialogTitle>
                          <DialogDescription>
                            Risk factors identified for {risk.leadName}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                          {risk.riskFactors.map((factor, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              <span className="text-sm">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      Mitigate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MCP-10: Demand Surge Calendar */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              MCP-10: Demand Heatmap
            </CardTitle>
            <CardDescription>High-demand dates with pricing recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demand Surge Alerts</CardTitle>
            <CardDescription>Dates requiring dynamic pricing adjustments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demandAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{new Date(alert.date).toLocaleDateString()}</div>
                    <div className="text-sm text-muted-foreground">
                      {alert.bookings} bookings, {alert.demand}% demand
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getRiskColor(alert.alertLevel)}>
                      {alert.alertLevel}
                    </Badge>
                    <div className="text-sm font-medium text-green-600 mt-1">
                      {alert.suggestedPricing}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}