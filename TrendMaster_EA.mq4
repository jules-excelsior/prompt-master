//+------------------------------------------------------------------+
//|                                           TrendMaster_EA.mq4    |
//|              Multi-Timeframe Trend + Momentum Expert Advisor     |
//|  Strategy: H4 trend filter + H1 EMA cross + RSI + MACD confirm  |
//+------------------------------------------------------------------+
#property copyright "TrendMaster EA"
#property version   "1.00"
#property strict

//--- Entry Inputs
input int    FastEMA_Period    = 21;          // Fast EMA period
input int    SlowEMA_Period    = 50;          // Slow EMA period
input int    TrendEMA_Period   = 200;         // Trend EMA period (higher TF)
input int    RSI_Period        = 14;          // RSI period
input double RSI_Overbought    = 65.0;        // RSI overbought level
input double RSI_Oversold      = 35.0;        // RSI oversold level
input int    MACD_Fast         = 12;
input int    MACD_Slow         = 26;
input int    MACD_Signal       = 9;

//--- Risk Management Inputs
input double RiskPercent       = 1.5;         // % of balance risked per trade
input double ATR_SL_Multiplier = 1.5;         // ATR multiplier for stop loss
input double RR_Ratio          = 2.0;         // Reward:Risk ratio for take profit
input bool   UseTrailingStop   = true;        // Enable trailing stop
input double ATR_Trail_Mult    = 1.0;         // ATR multiplier for trailing stop

//--- Trade Management Inputs
input int    MagicNumber       = 20240101;    // Unique EA identifier
input int    MaxTradesPerSymbol = 1;          // Max concurrent trades
input int    ATR_Period        = 14;          // ATR period
input int    HigherTF          = PERIOD_H4;  // Higher timeframe for trend filter
input int    Slippage          = 3;           // Max slippage in points

//+------------------------------------------------------------------+
void OnTick()
{
   if (!IsNewBar(Symbol(), Period())) return;

   ManageOpenTrades();

   if (CountOpenTrades() >= MaxTradesPerSymbol) return;

   int signal = GetTradeSignal();
   if (signal ==  1) OpenTrade(OP_BUY);
   if (signal == -1) OpenTrade(OP_SELL);
}

//+------------------------------------------------------------------+
//| Returns true only on the first tick of a new bar                 |
//+------------------------------------------------------------------+
bool IsNewBar(string sym, int tf)
{
   static datetime lastBarTime = 0;
   datetime currentBar = iTime(sym, tf, 0);
   if (currentBar != lastBarTime) {
      lastBarTime = currentBar;
      return true;
   }
   return false;
}

//+------------------------------------------------------------------+
//| Core signal logic — returns 1 (buy), -1 (sell), 0 (no trade)    |
//+------------------------------------------------------------------+
int GetTradeSignal()
{
   //--- Higher timeframe trend filter
   double htf_ema200 = iMA(Symbol(), HigherTF, TrendEMA_Period, 0, MODE_EMA, PRICE_CLOSE, 1);
   double htf_close  = iClose(Symbol(), HigherTF, 1);
   bool uptrend   = htf_close > htf_ema200;
   bool downtrend = htf_close < htf_ema200;

   //--- Current TF: EMA crossover
   double fast_cur = iMA(Symbol(), 0, FastEMA_Period, 0, MODE_EMA, PRICE_CLOSE, 1);
   double fast_prv = iMA(Symbol(), 0, FastEMA_Period, 0, MODE_EMA, PRICE_CLOSE, 2);
   double slow_cur = iMA(Symbol(), 0, SlowEMA_Period, 0, MODE_EMA, PRICE_CLOSE, 1);
   double slow_prv = iMA(Symbol(), 0, SlowEMA_Period, 0, MODE_EMA, PRICE_CLOSE, 2);

   bool cross_up   = fast_prv <= slow_prv && fast_cur > slow_cur;
   bool cross_down = fast_prv >= slow_prv && fast_cur < slow_cur;

   //--- RSI filter
   double rsi = iRSI(Symbol(), 0, RSI_Period, PRICE_CLOSE, 1);

   //--- MACD confirmation (crossover on current bar)
   double macd_main_cur = iMACD(Symbol(), 0, MACD_Fast, MACD_Slow, MACD_Signal, PRICE_CLOSE, MODE_MAIN,   1);
   double macd_sig_cur  = iMACD(Symbol(), 0, MACD_Fast, MACD_Slow, MACD_Signal, PRICE_CLOSE, MODE_SIGNAL, 1);
   double macd_main_prv = iMACD(Symbol(), 0, MACD_Fast, MACD_Slow, MACD_Signal, PRICE_CLOSE, MODE_MAIN,   2);
   double macd_sig_prv  = iMACD(Symbol(), 0, MACD_Fast, MACD_Slow, MACD_Signal, PRICE_CLOSE, MODE_SIGNAL, 2);

   bool macd_up   = macd_main_prv <= macd_sig_prv && macd_main_cur > macd_sig_cur;
   bool macd_down = macd_main_prv >= macd_sig_prv && macd_main_cur < macd_sig_cur;

   //--- BUY: all four conditions aligned bullish
   if (uptrend && cross_up && rsi < RSI_Overbought && macd_up)   return  1;

   //--- SELL: all four conditions aligned bearish
   if (downtrend && cross_down && rsi > RSI_Oversold && macd_down) return -1;

   return 0;
}

//+------------------------------------------------------------------+
//| Open a trade with ATR-based SL/TP and calculated lot size        |
//+------------------------------------------------------------------+
void OpenTrade(int orderType)
{
   double atr     = iATR(Symbol(), 0, ATR_Period, 1);
   double slDist  = atr * ATR_SL_Multiplier;
   double lotSize = CalculateLotSize(slDist);

   if (lotSize <= 0) { Print("Lot size calculation failed"); return; }

   double price, sl, tp;
   color  arrowColor;

   if (orderType == OP_BUY) {
      price      = Ask;
      sl         = price - slDist;
      tp         = price + slDist * RR_Ratio;
      arrowColor = clrDodgerBlue;
   } else {
      price      = Bid;
      sl         = price + slDist;
      tp         = price - slDist * RR_Ratio;
      arrowColor = clrCrimson;
   }

   sl = NormalizeDouble(sl, Digits);
   tp = NormalizeDouble(tp, Digits);

   int ticket = OrderSend(Symbol(), orderType, lotSize, price, Slippage, sl, tp,
                          "TrendMaster", MagicNumber, 0, arrowColor);
   if (ticket < 0)
      Print("OrderSend error: ", GetLastError(), " | Type=", orderType, " Lot=", lotSize);
   else
      Print("Trade opened #", ticket, " | ", (orderType == OP_BUY ? "BUY" : "SELL"),
            " | Lot=", lotSize, " | SL=", sl, " | TP=", tp);
}

//+------------------------------------------------------------------+
//| Position size based on fixed % risk and ATR stop distance        |
//+------------------------------------------------------------------+
double CalculateLotSize(double slDistance)
{
   if (slDistance <= 0) return 0;

   double balance   = AccountBalance();
   double riskAmt   = balance * RiskPercent / 100.0;
   double tickVal   = MarketInfo(Symbol(), MODE_TICKVALUE);
   double tickSize  = MarketInfo(Symbol(), MODE_TICKSIZE);
   double minLot    = MarketInfo(Symbol(), MODE_MINLOT);
   double maxLot    = MarketInfo(Symbol(), MODE_MAXLOT);
   double lotStep   = MarketInfo(Symbol(), MODE_LOTSTEP);

   if (tickVal <= 0 || tickSize <= 0) return minLot;

   double slTicks = slDistance / tickSize;
   double lots    = riskAmt / (slTicks * tickVal);

   lots = MathFloor(lots / lotStep) * lotStep;
   lots = MathMax(minLot, MathMin(maxLot, lots));

   return NormalizeDouble(lots, 2);
}

//+------------------------------------------------------------------+
//| ATR trailing stop — moves SL in direction of profit only         |
//+------------------------------------------------------------------+
void ManageOpenTrades()
{
   if (!UseTrailingStop) return;

   double atr   = iATR(Symbol(), 0, ATR_Period, 1);
   double trail = atr * ATR_Trail_Mult;

   for (int i = OrdersTotal() - 1; i >= 0; i--) {
      if (!OrderSelect(i, SELECT_BY_POS, MODE_TRADES)) continue;
      if (OrderSymbol() != Symbol() || OrderMagicNumber() != MagicNumber) continue;

      double newSL  = 0;
      bool   modify = false;

      if (OrderType() == OP_BUY) {
         newSL = NormalizeDouble(Bid - trail, Digits);
         if (newSL > OrderStopLoss() + Point && newSL < Bid) modify = true;
      }
      else if (OrderType() == OP_SELL) {
         newSL = NormalizeDouble(Ask + trail, Digits);
         if ((OrderStopLoss() == 0 || newSL < OrderStopLoss() - Point) && newSL > Ask) modify = true;
      }

      if (modify && !OrderModify(OrderTicket(), OrderOpenPrice(), newSL, OrderTakeProfit(), 0, clrGold))
         Print("OrderModify error: ", GetLastError());
   }
}

//+------------------------------------------------------------------+
//| Count open trades for this EA on the current symbol              |
//+------------------------------------------------------------------+
int CountOpenTrades()
{
   int count = 0;
   for (int i = OrdersTotal() - 1; i >= 0; i--) {
      if (OrderSelect(i, SELECT_BY_POS, MODE_TRADES))
         if (OrderSymbol() == Symbol() && OrderMagicNumber() == MagicNumber)
            count++;
   }
   return count;
}

//+------------------------------------------------------------------+
int OnInit()  { Print("TrendMaster EA loaded on ", Symbol()); return INIT_SUCCEEDED; }
void OnDeinit(const int reason) { Print("TrendMaster EA removed. Reason: ", reason); }
//+------------------------------------------------------------------+
