import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PricePredictionRequest {
  occasion: string;
  pax: number;
  function_date: string;
  menu_type: string;
  lead_time_days: number;
  lead_source?: string;
}

interface PricePredictionResponse {
  base_price: number;
  gst_amount: number;
  total_price: number;
  deposit_amount: number;
  lead_score: number;
  lead_label: string;
  payment_risk: string;
  demand_surge: boolean;
  pricing_factors: {
    occasion_multiplier: number;
    pax_rate: number;
    lead_time_factor: number;
    seasonal_factor: number;
  };
}

// AI Pricing Algorithm using dynamic pricing principles
const calculateAIPrice = (request: PricePredictionRequest): PricePredictionResponse => {
  // Base rates per person based on occasion type
  const occasionRates = {
    'wedding': 800,
    'birthday': 600,
    'anniversary': 650,
    'corporate': 750,
    'engagement': 700,
    'reception': 850,
    'sangeet': 750,
    'mehendi': 650,
    'other': 600
  };

  // Menu type multipliers
  const menuMultipliers = {
    'vegetarian': 1.0,
    'non-vegetarian': 1.3,
    'premium': 1.5,
    'deluxe': 1.8,
    'basic': 0.8
  };

  // Lead time pricing (dynamic pricing - less time = higher price)
  const getLeadTimeFactor = (days: number): number => {
    if (days <= 7) return 1.5;  // Rush booking
    if (days <= 15) return 1.3;
    if (days <= 30) return 1.1;
    if (days <= 60) return 1.0;
    return 0.9; // Early booking discount
  };

  // Seasonal factors (Nov-Feb peak season)
  const getSeasonalFactor = (date: string): number => {
    const month = new Date(date).getMonth() + 1;
    if ([11, 12, 1, 2].includes(month)) return 1.4; // Peak wedding season
    if ([3, 4, 10].includes(month)) return 1.2; // Good season
    return 1.0; // Regular season
  };

  // Pax-based efficiency (bulk pricing)
  const getPaxMultiplier = (pax: number): number => {
    if (pax >= 500) return 0.85; // Bulk discount
    if (pax >= 300) return 0.9;
    if (pax >= 200) return 0.95;
    if (pax >= 100) return 1.0;
    return 1.15; // Small event premium
  };

  // Calculate base price
  const baseRate = occasionRates[request.occasion.toLowerCase() as keyof typeof occasionRates] || 600;
  const menuMultiplier = menuMultipliers[request.menu_type.toLowerCase() as keyof typeof menuMultipliers] || 1.0;
  const leadTimeFactor = getLeadTimeFactor(request.lead_time_days);
  const seasonalFactor = getSeasonalFactor(request.function_date);
  const paxMultiplier = getPaxMultiplier(request.pax);

  const basePrice = Math.round(baseRate * request.pax * menuMultiplier * leadTimeFactor * seasonalFactor * paxMultiplier);
  const gstAmount = Math.round(basePrice * 0.18);
  const totalPrice = basePrice + gstAmount;
  const depositAmount = Math.round(totalPrice * 0.3); // 30% advance

  // Lead Scoring (MCP-01)
  const calculateLeadScore = (): { score: number; label: string } => {
    let score = 50; // Base score

    // Occasion impact
    if (['wedding', 'reception'].includes(request.occasion.toLowerCase())) score += 20;
    else if (['corporate', 'engagement'].includes(request.occasion.toLowerCase())) score += 15;
    else score += 10;

    // Pax impact
    if (request.pax >= 300) score += 20;
    else if (request.pax >= 200) score += 15;
    else if (request.pax >= 100) score += 10;
    else score += 5;

    // Lead time impact
    if (request.lead_time_days <= 30) score += 15;
    else if (request.lead_time_days <= 60) score += 10;
    else score += 5;

    // Lead source impact
    if (request.lead_source === 'referral') score += 15;
    else if (request.lead_source === 'website') score += 10;
    else if (request.lead_source === 'social_media') score += 8;
    else score += 5;

    score = Math.min(100, Math.max(0, score));

    let label = 'Cold';
    if (score >= 80) label = 'Hot';
    else if (score >= 60) label = 'Warm';

    return { score, label };
  };

  // Payment Risk Assessment (MCP-04)
  const calculatePaymentRisk = (): string => {
    let riskScore = 0;

    // Budget vs predicted price analysis
    const budgetRange = totalPrice;
    if (budgetRange < totalPrice * 0.8) riskScore += 30; // Under-budget
    else if (budgetRange >= totalPrice * 1.2) riskScore -= 10; // Over-budget (good)

    // Event size risk
    if (request.pax < 50) riskScore += 20; // Small events higher risk
    else if (request.pax > 300) riskScore -= 10; // Large events lower risk

    // Lead time risk
    if (request.lead_time_days < 15) riskScore += 15; // Rush bookings higher risk

    if (riskScore >= 40) return 'High';
    else if (riskScore >= 20) return 'Medium';
    return 'Low';
  };

  // Demand Surge Detection (MCP-10)
  const checkDemandSurge = (): boolean => {
    const functionDate = new Date(request.function_date);
    const month = functionDate.getMonth() + 1;
    const dayOfWeek = functionDate.getDay();

    // Peak season and weekend surge
    const isPeakSeason = [11, 12, 1, 2].includes(month);
    const isWeekend = [0, 6].includes(dayOfWeek); // Sunday or Saturday

    return isPeakSeason && isWeekend;
  };

  const leadScore = calculateLeadScore();
  const paymentRisk = calculatePaymentRisk();
  const demandSurge = checkDemandSurge();

  return {
    base_price: basePrice,
    gst_amount: gstAmount,
    total_price: totalPrice,
    deposit_amount: depositAmount,
    lead_score: leadScore.score,
    lead_label: leadScore.label,
    payment_risk: paymentRisk,
    demand_surge: demandSurge,
    pricing_factors: {
      occasion_multiplier: menuMultiplier,
      pax_rate: baseRate,
      lead_time_factor: leadTimeFactor,
      seasonal_factor: seasonalFactor
    }
  };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const request: PricePredictionRequest = await req.json()

    // Validate required fields
    if (!request.occasion || !request.pax || !request.function_date || !request.menu_type || request.lead_time_days === undefined) {
      throw new Error('Missing required fields: occasion, pax, function_date, menu_type, lead_time_days')
    }

    // Validate pax range
    if (request.pax < 10 || request.pax > 2000) {
      throw new Error('Guest count must be between 10 and 2000')
    }

    // Validate future date
    const functionDate = new Date(request.function_date)
    if (functionDate <= new Date()) {
      throw new Error('Function date must be in the future')
    }

    const prediction = calculateAIPrice(request)

    console.log('AI Price Prediction:', {
      occasion: request.occasion,
      pax: request.pax,
      predicted_price: prediction.total_price,
      lead_score: prediction.lead_score,
      payment_risk: prediction.payment_risk
    })

    return new Response(
      JSON.stringify(prediction),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('AI Price Prediction Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        base_price: 0,
        total_price: 0 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})