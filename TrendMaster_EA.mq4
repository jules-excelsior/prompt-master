//+------------------------------------------------------------------+
//|                                           TrendMaster_EA.mq4    |
//|              Multi-Timeframe Trend + Pullback Expert Advisor     |
//|  v2.0 — Expert Edition                                           |
//|                                                                  |
//|  SIGNAL LOGIC (all 5 must align):                               |
//|   1. H4 EMA200   — macro trend direction                        |
//|   2. H1 EMA21/50 — micro trend aligned with macro               |
//|   3. ADX(14)>20  — trend has real strength (not ranging)        |
//|   4. Stoch(5,3,3)— pullback timing (buy dip, sell rally)        |
//|   5. RSI 40-60   — momentum present but not exhausted           |
//|                                                                  |
//|  EXIT LOGIC:                                                     |
//|   - Break-even at 1:1 R/R (never let a winner become a loser)   |
//|   - Partial close 50% at 1:1 R/R                                |
//|   - ATR trailing stop on remainder                               |
//|   - Full TP at 2:1 R/R                                          |
//+------------------------------------------------------------------+
#property copyright "TrendMaster EA"
#property version   "2.00"
#property strict

//--- Entry Inputs
input int    TrendEMA_Period    = 200;        // H4 trend EMA period
input int    FastEMA_Period     = 21;         // H1 fast EMA (micro trend)
input int    SlowEMA_Period     = 50;         // H1 slow EMA (micro trend + pullback zone)
input int    ADX_Period         = 14;         // ADX period
input double ADX_MinLevel       = 20.0;       // Min ADX — below this = ranging, skip trade
input int    Stoch_K            = 5;          // Stochastic %K period
input int    Stoch_D            = 3;          // Stochastic %D period
input int    Stoch_Slow         = 3;          // Stochastic slowing
input double Stoch_BuyLevel     = 30.0;       // Stoch oversold — buy when crossing UP from here
input double Stoch_SellLevel    = 70.0;       // Stoch overbought — sell when crossing DOWN from here
input int    RSI_Period         = 14;         // RSI period
input double RSI_BuyMin         = 40.0;       // RSI must be ABOVE this to buy (has momentum)
input double RSI_BuyMax         = 60.0;       // RSI must be BELOW this to buy (not exhausted)
input double RSI_SellMin        = 40.0;       // RSI must be ABOVE this to sell (not oversold)
input double RSI_SellMax        = 60.0;       // RSI must be BELOW this to sell (not exhausted)

//--- Risk Management
input double RiskPercent        = 1.5;        // % of account balance risked per trade
input double ATR_SL_Multiplier  = 1.5;        // ATR × this = stop loss distance
input double RR_FullTP          = 2.0;        // Full take profit at this reward:risk ratio
input bool   UseBreakEven       = true;       // Move SL to break-even once trade reaches 1:1 R/R
input int    BreakEvenBufferPts = 5;          // Extra points beyond break-even when moving SL
input bool   UsePartialClose    = true;       // Close 50% of position at 1:1 R/R
input bool   UseTrailingStop    = true;       // ATR trailing stop on remaining position
input double ATR_Trail_Mult     = 1.2;        // ATR multiplier for trailing stop

//--- Safety Filters
input int    MaxSpreadPoints    = 30;         // Skip entry if spread > this (in points, 30 = 3 pips on 5-digit)
input double DailyLossLimit     = 3.0;        // Stop trading if daily loss exceeds X% of day-open balance
input double ATR_VolatilityMult = 2.5;        // Skip if ATR(14) > X × ATR(50) average — market too erratic
input int    ATR_AvgPeriod      = 50;         // Bars for average ATR (volatility baseline)

//--- Trade Management
input int    MagicNumber        = 20240101;
input int    MaxTradesPerSymbol = 1;
input int    ATR_Period         = 14;
input int    HigherTF           = PERIOD_H4;
input int    Slippage           = 3;

//--- Session Filter
input bool   UseSessionFilter   = true;
input int    BrokerGMTOffset    = 2;          // Your broker's GMT offset (2=winter, 3=summer)
input bool   TradeLondon        = true;       // 08:00–17:00 UTC
input bool   TradeNewYork       = true;       // 13:00–22:00 UTC
input bool   TradeAsian         = false;      // 00:00–08:00 UTC
input bool   OverlapOnly        = false;      // Only 13:00–17:00 UTC overlap (recommended for beginners)

//--- News Filter
input bool   UseNewsFilter      = true;
input int    NewsMinsBefore     = 30;
input int    NewsMinsAfter      = 30;
input bool   FilterNFP          = true;
input bool   CloseTradesOnNews  = false;
input string NewsFile           = "TrendMaster_News.csv";

//--- Globals
datetime newsEvents[];
int      newsEventCount  = 0;
datetime lastNewsLoad    = 0;
double   dayOpenBalance  = 0;
datetime currentDay      = 0;
bool     partialDone[];  // tracks per-ticket whether partial close has fired

#define NEWS_LABEL    "TM_News"
#define SESSION_LABEL "TM_Session"
#define PANEL_LABEL   "TM_Panel"

//+------------------------------------------------------------------+
void OnTick()
{
   if (!IsNewBar(Symbol(), Period())) return;

   // Reset daily balance tracker on new day
   datetime today = StringToTime(TimeToString(TimeCurrent(), TIME_DATE));
   if (today != currentDay) {
      currentDay   = today;
      dayOpenBalance = AccountBalance();
   }

   // Reload news file once per day
   if (UseNewsFilter && TimeCurrent() - lastNewsLoad > 86400)
      LoadNewsFile();

   ManageOpenTrades();

   string session = GetCurrentSession();
   UpdateLabels(session);

   // --- Circuit breakers ---
   if (UseNewsFilter && IsNewsTime())               return;
   if (UseSessionFilter && session == "CLOSED")     return;
   if (IsDailyLossBreached())                       return;
   if (CountOpenTrades() >= MaxTradesPerSymbol)     return;
   if (IsSpreadTooWide())                           return;
   if (IsVolatilityTooHigh())                       return;

   int signal = GetTradeSignal();
   if (signal ==  1) OpenTrade(OP_BUY);
   if (signal == -1) OpenTrade(OP_SELL);
}

//+------------------------------------------------------------------+
//| 5-condition entry signal                                          |
//| Returns 1=buy, -1=sell, 0=no trade                               |
//+------------------------------------------------------------------+
int GetTradeSignal()
{
   // --- 1. Macro trend: H4 EMA200 ---
   double htf_ema = iMA(Symbol(), HigherTF, TrendEMA_Period, 0, MODE_EMA, PRICE_CLOSE, 1);
   double htf_cls = iClose(Symbol(), HigherTF, 1);
   bool uptrend   = htf_cls > htf_ema;
   bool downtrend = htf_cls < htf_ema;

   // --- 2. Micro trend: H1 EMA21 vs EMA50 ---
   double ema21 = iMA(Symbol(), 0, FastEMA_Period, 0, MODE_EMA, PRICE_CLOSE, 1);
   double ema50 = iMA(Symbol(), 0, SlowEMA_Period, 0, MODE_EMA, PRICE_CLOSE, 1);
   bool micro_bull = ema21 > ema50;
   bool micro_bear = ema21 < ema50;

   // --- 3. ADX — trend strength filter ---
   double adx = iADX(Symbol(), 0, ADX_Period, PRICE_CLOSE, MODE_MAIN, 1);
   if (adx < ADX_MinLevel) return 0; // ranging market — skip

   // --- 4. Stochastic pullback timing ---
   double stoch_k_cur = iStochastic(Symbol(), 0, Stoch_K, Stoch_D, Stoch_Slow, MODE_SMA, 0, MODE_MAIN,   1);
   double stoch_d_cur = iStochastic(Symbol(), 0, Stoch_K, Stoch_D, Stoch_Slow, MODE_SMA, 0, MODE_SIGNAL, 1);
   double stoch_k_prv = iStochastic(Symbol(), 0, Stoch_K, Stoch_D, Stoch_Slow, MODE_SMA, 0, MODE_MAIN,   2);
   double stoch_d_prv = iStochastic(Symbol(), 0, Stoch_K, Stoch_D, Stoch_Slow, MODE_SMA, 0, MODE_SIGNAL, 2);

   // %K crosses above %D from oversold = buy pullback
   bool stoch_buy  = (stoch_k_prv <= stoch_d_prv) && (stoch_k_cur > stoch_d_cur) && (stoch_k_prv < Stoch_BuyLevel);
   // %K crosses below %D from overbought = sell rally
   bool stoch_sell = (stoch_k_prv >= stoch_d_prv) && (stoch_k_cur < stoch_d_cur) && (stoch_k_prv > Stoch_SellLevel);

   // --- 5. RSI momentum zone ---
   double rsi = iRSI(Symbol(), 0, RSI_Period, PRICE_CLOSE, 1);
   bool rsi_buy  = (rsi >= RSI_BuyMin  && rsi <= RSI_BuyMax);
   bool rsi_sell = (rsi >= RSI_SellMin && rsi <= RSI_SellMax);

   // --- All 5 must align ---
   if (uptrend   && micro_bull && stoch_buy  && rsi_buy)  return  1;
   if (downtrend && micro_bear && stoch_sell && rsi_sell) return -1;

   return 0;
}

//+------------------------------------------------------------------+
//| Open order with ATR stop loss and 2:1 take profit                |
//+------------------------------------------------------------------+
void OpenTrade(int orderType)
{
   double atr    = iATR(Symbol(), 0, ATR_Period, 1);
   double slDist = atr * ATR_SL_Multiplier;
   double lots   = CalculateLotSize(slDist);
   if (lots <= 0) return;

   double price, sl, tp;
   color  arrow;

   if (orderType == OP_BUY) {
      price = Ask;
      sl    = NormalizeDouble(price - slDist, Digits);
      tp    = NormalizeDouble(price + slDist * RR_FullTP, Digits);
      arrow = clrDodgerBlue;
   } else {
      price = Bid;
      sl    = NormalizeDouble(price + slDist, Digits);
      tp    = NormalizeDouble(price - slDist * RR_FullTP, Digits);
      arrow = clrCrimson;
   }

   int ticket = OrderSend(Symbol(), orderType, lots, price, Slippage, sl, tp,
                          "TM2.0", MagicNumber, 0, arrow);
   if (ticket < 0)
      Print("OrderSend error ", GetLastError(), " | type=", orderType, " lots=", lots);
   else
      Print("Trade #", ticket, " ", (orderType == OP_BUY ? "BUY" : "SELL"),
            " lots=", lots, " SL=", sl, " TP=", tp, " ADX=",
            NormalizeDouble(iADX(Symbol(), 0, ADX_Period, PRICE_CLOSE, MODE_MAIN, 1), 1));
}

//+------------------------------------------------------------------+
//| Trade management: break-even, partial close, trailing stop       |
//+------------------------------------------------------------------+
void ManageOpenTrades()
{
   double atr   = iATR(Symbol(), 0, ATR_Period, 1);
   double trail = atr * ATR_Trail_Mult;

   for (int i = OrdersTotal() - 1; i >= 0; i--) {
      if (!OrderSelect(i, SELECT_BY_POS, MODE_TRADES)) continue;
      if (OrderSymbol() != Symbol() || OrderMagicNumber() != MagicNumber) continue;

      int    ticket   = OrderTicket();
      int    type     = OrderType();
      double openPx   = OrderOpenPrice();
      double curSL    = OrderStopLoss();
      double curTP    = OrderTakeProfit();
      double lots     = OrderLots();
      double slDist   = MathAbs(openPx - curSL);
      if (slDist <= 0) continue;

      double profit1R = slDist;             // distance to 1:1 R/R
      double newSL    = curSL;
      bool   doModify = false;

      if (type == OP_BUY) {
         double floatProfit = Bid - openPx;

         // Break-even: once 1R in profit, move SL to entry + buffer
         if (UseBreakEven && floatProfit >= profit1R) {
            double beSL = NormalizeDouble(openPx + BreakEvenBufferPts * Point, Digits);
            if (beSL > curSL + Point) { newSL = beSL; doModify = true; }
         }

         // Partial close at 1R
         if (UsePartialClose && floatProfit >= profit1R && !IsPartialDone(ticket)) {
            double closeLots = NormalizeDouble(lots * 0.5, 2);
            closeLots = MathMax(closeLots, MarketInfo(Symbol(), MODE_MINLOT));
            if (OrderClose(ticket, closeLots, Bid, Slippage, clrOrange))
               MarkPartialDone(ticket);
         }

         // ATR trailing stop
         if (UseTrailingStop) {
            double trailSL = NormalizeDouble(Bid - trail, Digits);
            if (trailSL > newSL + Point && trailSL < Bid) { newSL = trailSL; doModify = true; }
         }
      }
      else if (type == OP_SELL) {
         double floatProfit = openPx - Ask;

         if (UseBreakEven && floatProfit >= profit1R) {
            double beSL = NormalizeDouble(openPx - BreakEvenBufferPts * Point, Digits);
            if (curSL == 0 || beSL < curSL - Point) { newSL = beSL; doModify = true; }
         }

         if (UsePartialClose && floatProfit >= profit1R && !IsPartialDone(ticket)) {
            double closeLots = NormalizeDouble(lots * 0.5, 2);
            closeLots = MathMax(closeLots, MarketInfo(Symbol(), MODE_MINLOT));
            if (OrderClose(ticket, closeLots, Ask, Slippage, clrOrange))
               MarkPartialDone(ticket);
         }

         if (UseTrailingStop) {
            double trailSL = NormalizeDouble(Ask + trail, Digits);
            if ((curSL == 0 || trailSL < newSL - Point) && trailSL > Ask) { newSL = trailSL; doModify = true; }
         }
      }

      if (doModify && newSL != curSL)
         if (!OrderModify(ticket, openPx, newSL, curTP, 0, clrGold))
            Print("OrderModify error ", GetLastError());
   }
}

//+------------------------------------------------------------------+
//| Partial-close tracking by ticket                                 |
//+------------------------------------------------------------------+
bool IsPartialDone(int ticket)
{
   for (int i = 0; i < ArraySize(partialDone); i += 2)
      if ((int)partialDone[i] == ticket) return (bool)partialDone[i+1];
   return false;
}

void MarkPartialDone(int ticket)
{
   int sz = ArraySize(partialDone);
   ArrayResize(partialDone, sz + 2);
   partialDone[sz]   = ticket;
   partialDone[sz+1] = 1;
}

//+------------------------------------------------------------------+
//| Safety filters                                                   |
//+------------------------------------------------------------------+
bool IsDailyLossBreached()
{
   if (DailyLossLimit <= 0) return false;
   double loss = (dayOpenBalance - AccountEquity()) / dayOpenBalance * 100.0;
   return loss >= DailyLossLimit;
}

bool IsSpreadTooWide()
{
   return (int)(MarketInfo(Symbol(), MODE_SPREAD)) > MaxSpreadPoints;
}

bool IsVolatilityTooHigh()
{
   if (ATR_VolatilityMult <= 0) return false;
   double atrNow = iATR(Symbol(), 0, ATR_Period, 1);
   double atrAvg = iATR(Symbol(), 0, ATR_AvgPeriod, 1);
   return (atrAvg > 0 && atrNow > atrAvg * ATR_VolatilityMult);
}

//+------------------------------------------------------------------+
//| Lot size: fixed % risk on account balance                        |
//+------------------------------------------------------------------+
double CalculateLotSize(double slDistance)
{
   if (slDistance <= 0) return 0;
   double riskAmt  = AccountBalance() * RiskPercent / 100.0;
   double tickVal  = MarketInfo(Symbol(), MODE_TICKVALUE);
   double tickSize = MarketInfo(Symbol(), MODE_TICKSIZE);
   double minLot   = MarketInfo(Symbol(), MODE_MINLOT);
   double maxLot   = MarketInfo(Symbol(), MODE_MAXLOT);
   double lotStep  = MarketInfo(Symbol(), MODE_LOTSTEP);
   if (tickVal <= 0 || tickSize <= 0) return minLot;
   double lots = riskAmt / ((slDistance / tickSize) * tickVal);
   lots = MathFloor(lots / lotStep) * lotStep;
   return NormalizeDouble(MathMax(minLot, MathMin(maxLot, lots)), 2);
}

//+------------------------------------------------------------------+
//| New-bar detector                                                 |
//+------------------------------------------------------------------+
bool IsNewBar(string sym, int tf)
{
   static datetime last = 0;
   datetime cur = iTime(sym, tf, 0);
   if (cur != last) { last = cur; return true; }
   return false;
}

//+------------------------------------------------------------------+
//| Count open EA trades on this symbol                              |
//+------------------------------------------------------------------+
int CountOpenTrades()
{
   int n = 0;
   for (int i = OrdersTotal() - 1; i >= 0; i--)
      if (OrderSelect(i, SELECT_BY_POS, MODE_TRADES))
         if (OrderSymbol() == Symbol() && OrderMagicNumber() == MagicNumber) n++;
   return n;
}

//+------------------------------------------------------------------+
//| Close all EA trades (news emergency)                             |
//+------------------------------------------------------------------+
void CloseAllTrades()
{
   for (int i = OrdersTotal() - 1; i >= 0; i--) {
      if (!OrderSelect(i, SELECT_BY_POS, MODE_TRADES)) continue;
      if (OrderSymbol() != Symbol() || OrderMagicNumber() != MagicNumber) continue;
      double px = (OrderType() == OP_BUY) ? Bid : Ask;
      if (!OrderClose(OrderTicket(), OrderLots(), px, Slippage, clrOrange))
         Print("CloseAllTrades error ", GetLastError());
   }
}

//+------------------------------------------------------------------+
//| News filter                                                      |
//+------------------------------------------------------------------+
bool IsNewsTime()
{
   datetime now    = TimeCurrent();
   int      before = NewsMinsBefore * 60;
   int      after  = NewsMinsAfter  * 60;
   for (int i = 0; i < newsEventCount; i++) {
      long diff = (long)now - (long)newsEvents[i];
      if (diff >= -before && diff <= after) {
         if (CloseTradesOnNews && diff < 0) CloseAllTrades();
         return true;
      }
   }
   if (FilterNFP && IsNFPWindow(now, before, after)) return true;
   return false;
}

bool IsNFPWindow(datetime now, int secBefore, int secAfter)
{
   MqlDateTime dt; TimeToStruct(now, dt);
   MqlDateTime nfp;
   nfp.year = dt.year; nfp.mon = dt.mon; nfp.day = 1;
   nfp.hour = 13; nfp.min = 30; nfp.sec = 0;
   MqlDateTime fd; TimeToStruct(StructToTime(nfp), fd);
   nfp.day = 1 + (5 - fd.day_of_week + 7) % 7;
   long diff = (long)now - (long)StructToTime(nfp);
   return (diff >= -secBefore && diff <= secAfter);
}

void LoadNewsFile()
{
   newsEventCount = 0; ArrayResize(newsEvents, 0);
   lastNewsLoad = TimeCurrent();
   int h = FileOpen(NewsFile, FILE_READ | FILE_TXT | FILE_ANSI);
   if (h == INVALID_HANDLE) { Print("News file not found: ", NewsFile); return; }
   int n = 0;
   while (!FileIsEnding(h)) {
      string line = StringTrimRight(StringTrimLeft(FileReadString(h)));
      if (StringLen(line) == 0 || StringGetCharacter(line, 0) == '#') continue;
      datetime t = StringToTime(line);
      if (t > 0) { ArrayResize(newsEvents, n + 1); newsEvents[n++] = t; }
   }
   FileClose(h);
   newsEventCount = n;
   Print("News filter: ", n, " event(s) loaded from ", NewsFile);
}

//+------------------------------------------------------------------+
//| Session filter                                                   |
//+------------------------------------------------------------------+
string GetCurrentSession()
{
   datetime utc = TimeCurrent() - BrokerGMTOffset * 3600;
   MqlDateTime dt; TimeToStruct(utc, dt);
   if (dt.day_of_week == 0 || dt.day_of_week == 6) return "CLOSED";
   int h = dt.hour;
   bool inOverlap = (h >= 13 && h < 17);
   bool inLondon  = (h >= 8  && h < 17);
   bool inNY      = (h >= 13 && h < 22);
   bool inAsian   = (h >= 0  && h <  8);
   if (OverlapOnly)                              return inOverlap ? "OVERLAP" : "CLOSED";
   if (inOverlap && TradeLondon && TradeNewYork) return "OVERLAP";
   if (inLondon  && TradeLondon)                return "LONDON";
   if (inNY      && TradeNewYork)               return "NEW YORK";
   if (inAsian   && TradeAsian)                 return "ASIAN";
   return "CLOSED";
}

//+------------------------------------------------------------------+
//| On-chart labels                                                  |
//+------------------------------------------------------------------+
void UpdateLabels(string session)
{
   // News label
   bool newsBlocked = UseNewsFilter && IsNewsTime();
   CreateOrUpdateLabel(NEWS_LABEL, "News: " + (newsBlocked ? "BLOCKED" : "CLEAR"),
                       newsBlocked ? clrRed : clrLime, 10, 20);

   // Session label
   color sClr = clrDimGray;
   if (session == "OVERLAP")  sClr = clrGold;
   if (session == "LONDON")   sClr = clrDodgerBlue;
   if (session == "NEW YORK") sClr = clrLimeGreen;
   if (session == "ASIAN")    sClr = clrOrchid;
   CreateOrUpdateLabel(SESSION_LABEL, "Session: " + session, sClr, 10, 38);

   // Info panel
   double dailyPnL = AccountEquity() - dayOpenBalance;
   string blocked  = IsDailyLossBreached() ? " | DAILY LIMIT" : "";
   CreateOrUpdateLabel(PANEL_LABEL,
      StringFormat("ADX: %.1f | Spread: %d | Daily P/L: %.2f%s",
         iADX(Symbol(), 0, ADX_Period, PRICE_CLOSE, MODE_MAIN, 1),
         (int)MarketInfo(Symbol(), MODE_SPREAD), dailyPnL, blocked),
      IsDailyLossBreached() ? clrRed : clrSilver, 10, 56);
}

void CreateOrUpdateLabel(string name, string text, color clr, int x, int y)
{
   if (ObjectFind(0, name) < 0) {
      ObjectCreate(0, name, OBJ_LABEL, 0, 0, 0);
      ObjectSetInteger(0, name, OBJPROP_CORNER,    CORNER_TOP_RIGHT);
      ObjectSetInteger(0, name, OBJPROP_XDISTANCE, x);
      ObjectSetInteger(0, name, OBJPROP_YDISTANCE, y);
      ObjectSetInteger(0, name, OBJPROP_FONTSIZE,  9);
      ObjectSetString (0, name, OBJPROP_FONT,      "Arial Bold");
   }
   ObjectSetString (0, name, OBJPROP_TEXT,  text);
   ObjectSetInteger(0, name, OBJPROP_COLOR, clr);
}

//+------------------------------------------------------------------+
int OnInit()
{
   Print("TrendMaster EA v2.0 loaded on ", Symbol());
   dayOpenBalance = AccountBalance();
   currentDay     = StringToTime(TimeToString(TimeCurrent(), TIME_DATE));
   if (UseNewsFilter) LoadNewsFile();
   UpdateLabels(GetCurrentSession());
   return INIT_SUCCEEDED;
}

void OnDeinit(const int reason)
{
   ObjectDelete(0, NEWS_LABEL);
   ObjectDelete(0, SESSION_LABEL);
   ObjectDelete(0, PANEL_LABEL);
   Print("TrendMaster EA v2.0 removed. Reason: ", reason);
}
//+------------------------------------------------------------------+
