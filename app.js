tailwind.config = {
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#1B4332', light: '#2D6A4F', dark: '#0F2818' },
        gold: { DEFAULT: '#95D5B2', light: '#B7E4C7', dark: '#52B788' },
        slate: { 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155', 800: '#1E293B', 900: '#0F172A' }
      }
    }
  }
}

window.__MARKET__ = {"medianPrice":565000,"avgPSF_overall":313,"avgPSF_byVillage":{"MARLBOROUGH":313},"premiumPSF_byVillage":{"MARLBOROUGH":400},"avgRentPSF":1.75,"rent2BR":2200,"rent3BR":2800,"taxRate":0.01054,"insuranceAnnual":3000,"maintenancePct":0.01,"mortgageRate":0.06,"downPaymentPct":0.25,"closingCostPct":0.03,"sellingCostPct":0.05,"renoPerSqft":85,"holdingMonths_flip":6,"vacancyRate":0.05,"medianDOM":30,"capRate_stabilized":0.05,"capRate_valueAdd":0.065,"refiLTV":0.75};
window.__STATS__ = {total: 10802, opportunities: 8759, flips: 12, holds: 1083, brrrrs: 7664, valueAdds: 0};

const { useState, useMemo, useCallback, useEffect } = React;
const fmt = (n, style = "currency") => {
  if (n == null || isNaN(n)) return "\u2014";
  if (style === "currency") return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  if (style === "percent") return n.toFixed(1) + "%";
  if (style === "number") return new Intl.NumberFormat("en-US").format(Math.round(n));
  return String(n);
};
const calcMortgage = (principal, rate, years = 30) => {
  if (principal <= 0 || rate <= 0) return 0;
  const r = rate / 12, n = years * 12;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};
const scoreColor = (s) => s >= 10 ? "text-emerald-700 bg-emerald-50" : s >= 8 ? "text-amber-700 bg-amber-50" : s >= 5 ? "text-blue-700 bg-blue-50" : "text-slate-500 bg-slate-50";
const scoreEmoji = (s) => s >= 10 ? "\u{1F7E2}" : s >= 7 ? "\u{1F7E1}" : "\u{1F534}";
const gradeColor = (g) => g === "A" ? "bg-emerald-100 text-emerald-800" : g === "B" ? "bg-blue-100 text-blue-800" : g === "C" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600";
const stratColor = (s) => s === "Flip" ? "bg-emerald-600" : s === "Hold" ? "bg-blue-600" : s === "BRRRR" ? "bg-purple-600" : s === "Value-Add" ? "bg-amber-600" : "bg-slate-400";
// ── SVG Icons ──────────────────────────────────────────────
const LogoSVG = () => React.createElement("svg",{viewBox:"0 0 80 80",width:80,height:80,className:"mx-auto"},
  React.createElement("rect",{x:10,y:35,width:60,height:40,rx:4,fill:"#2D6A4F",stroke:"#D4A843",strokeWidth:2}),
  React.createElement("polygon",{points:"40,8 5,38 75,38",fill:"#2D6A4F",stroke:"#D4A843",strokeWidth:2}),
  React.createElement("rect",{x:30,y:50,width:20,height:25,rx:2,fill:"#D4A843",opacity:.8}),
  React.createElement("circle",{cx:58,cy:22,r:14,fill:"none",stroke:"#D4A843",strokeWidth:3}),
  React.createElement("line",{x1:68,y1:32,x2:78,y2:42,stroke:"#D4A843",strokeWidth:3,strokeLinecap:"round"}),
  React.createElement("rect",{x:18,y:45,width:8,height:8,rx:1,fill:"#D4A843",opacity:.5}),
  React.createElement("rect",{x:54,y:45,width:8,height:8,rx:1,fill:"#D4A843",opacity:.5}),
);

const PhoneRotateIcon = () => React.createElement("svg",{viewBox:"0 0 64 64",width:64,height:64,style:{animation:"rotatePhone 2s ease-in-out infinite"}},
  React.createElement("rect",{x:18,y:8,width:28,height:48,rx:4,fill:"none",stroke:"#D4A843",strokeWidth:2.5}),
  React.createElement("circle",{cx:32,cy:50,r:2,fill:"#D4A843"}),
  React.createElement("path",{d:"M52 32 c4-8 2-16-4-20",fill:"none",stroke:"#D4A843",strokeWidth:2,strokeLinecap:"round"}),
  React.createElement("polygon",{points:"48,10 50,16 44,14",fill:"#D4A843"}),
);

// ── RotatePrompt ───────────────────────────────────────────
function RotatePrompt({onContinue}) {
  const [landscape, setLandscape] = useState(false);
  useEffect(() => {
    const check = () => {
      if (window.innerWidth > window.innerHeight) {
        setLandscape(true);
      }
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);
  useEffect(() => {
    if (landscape) {
      const t = setTimeout(() => onContinue(), 800);
      return () => clearTimeout(t);
    }
  }, [landscape, onContinue]);

  return React.createElement("div",{className:"fixed inset-0 flex flex-col items-center justify-center p-8",style:{background:"#0F2818",zIndex:100}},
    React.createElement(LogoSVG),
    React.createElement("h1",{className:"text-white text-2xl font-bold mt-6 mb-2 text-center"},"Marlborough MA"),
    React.createElement("p",{style:{color:"#D4A843"},className:"text-sm font-medium mb-8"},"Investment Analyzer"),
    React.createElement("div",{className:"mb-4"},React.createElement(PhoneRotateIcon)),
    React.createElement("p",{className:"text-white text-lg font-semibold mb-2"},"Rotate to Landscape"),
    React.createElement("p",{className:"text-slate-400 text-sm mb-8 text-center"},"For the best experience on mobile"),
    React.createElement("button",{onClick:onContinue,className:"text-slate-500 text-xs underline hover:text-slate-300 transition-colors"},"Continue in portrait anyway"),
  );
}

// ── IntroGuide ─────────────────────────────────────────────
const IntroOverlay = ({ onClose }) => {
  const [page, setPage] = useState(0);
  const pages = [
    // Page 0: Welcome
    () => React.createElement("div",{className:"fade-in"},
      React.createElement("h2",{className:"text-2xl font-bold text-navy mb-2"},"Welcome to Your Investment Analyzer"),
      React.createElement("p",{className:"text-slate-500 mb-6"},"We've analyzed 10,800+ Marlborough properties and scored each for investment potential."),
      React.createElement("div",{className:"grid grid-cols-2 gap-3"},
        ...[["Flip","Buy, renovate, sell for profit","bg-emerald-50 border-emerald-200 text-emerald-700"],
            ["Hold","Long-term rental income","bg-blue-50 border-blue-200 text-blue-700"],
            ["BRRRR","Buy, Rehab, Rent, Refinance, Repeat","bg-purple-50 border-purple-200 text-purple-700"],
            ["Value-Add","Underdeveloped land or repositioning","bg-amber-50 border-amber-200 text-amber-700"]
        ].map(([t,d,c]) => React.createElement("div",{key:t,className:"rounded-lg border p-3 "+c},
          React.createElement("div",{className:"font-bold text-sm mb-1"},t),
          React.createElement("div",{className:"text-xs opacity-75"},d)
        ))
      ),
    ),
    // Page 1: Scoring
    () => React.createElement("div",{className:"fade-in"},
      React.createElement("h2",{className:"text-2xl font-bold text-navy mb-2"},"How Properties Are Scored"),
      React.createElement("p",{className:"text-slate-500 mb-4"},"Each property is scored 0–12 across four factors (3 points each):"),
      React.createElement("div",{className:"grid grid-cols-2 gap-3 mb-4"},
        ...[["Price Efficiency","$/sqft relative to area median"],
            ["Seller Motivation","Years of ownership (tenure)"],
            ["Profit Potential","Estimated flip ROI %"],
            ["Lead Quality","Predictive lead score & grade"]
        ].map(([t,d]) => React.createElement("div",{key:t,className:"bg-slate-50 rounded-lg p-3"},
          React.createElement("div",{className:"font-semibold text-sm text-navy"},t),
          React.createElement("div",{className:"text-xs text-slate-500"},d)
        ))
      ),
      React.createElement("div",{className:"flex gap-3 items-center justify-center"},
        ...[["10–12","Strong","bg-emerald-500 text-white"],
            ["7–9","Moderate","bg-amber-400 text-amber-900"],
            ["3–6","Worth Watching","bg-slate-300 text-slate-700"]
        ].map(([r,l,c]) => React.createElement("div",{key:r,className:"flex items-center gap-2"},
          React.createElement("span",{className:"inline-block px-2 py-1 rounded-full text-xs font-bold "+c},r),
          React.createElement("span",{className:"text-sm text-slate-600"},l)
        ))
      ),
    ),
    // Page 2: How to Use
    () => React.createElement("div",{className:"fade-in"},
      React.createElement("h2",{className:"text-2xl font-bold text-navy mb-4"},"How to Use"),
      React.createElement("div",{className:"grid grid-cols-2 gap-4"},
        ...[[1,"Filter & Search","Use strategy chips, grade filters, and the search bar to narrow results"],
            [2,"Click to Expand","Tap any property row to see full financial analysis with editable inputs"],
            [3,"Star Properties","Build a shortlist by starring your favorite opportunities"],
            [4,"Send Your List","Email your shortlist or download as CSV for further analysis"]
        ].map(([n,t,d]) => React.createElement("div",{key:n,className:"flex gap-3"},
          React.createElement("div",{className:"flex-none w-8 h-8 rounded-full bg-gold text-white flex items-center justify-center font-bold text-sm"},n),
          React.createElement("div",null,
            React.createElement("div",{className:"font-semibold text-navy text-sm"},t),
            React.createElement("div",{className:"text-xs text-slate-500"},d)
          )
        ))
      ),
    ),
    // Page 3: Data Notes
    () => React.createElement("div",{className:"fade-in"},
      React.createElement("h2",{className:"text-2xl font-bold text-navy mb-4"},"Important Data Notes"),
      React.createElement("div",{className:"space-y-3"},
        ...[["Assessed Values","City assessments typically lag market value by 10–20%. Actual purchase prices will differ.","bg-blue-50 border-blue-200"],
            ["Lead Scores","Our predictive model scores seller likelihood based on tenure, ownership patterns, and property characteristics.","bg-emerald-50 border-emerald-200"],
            ["ARV & Reno Estimates","After-repair values and renovation costs are starting points. Always verify with local comps and contractor bids.","bg-amber-50 border-amber-200"]
        ].map(([t,d,c]) => React.createElement("div",{key:t,className:"rounded-lg border p-4 "+c},
          React.createElement("div",{className:"font-bold text-sm text-navy mb-1"},t),
          React.createElement("div",{className:"text-xs text-slate-600 leading-relaxed"},d)
        ))
      ),
    ),
  ];

  return React.createElement("div",{className:"fixed inset-0 flex items-center justify-center p-4",style:{background:"rgba(15,40,24,.9)",zIndex:90}},
    React.createElement("div",{className:"bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 slide-in"},
      // Progress dots
      React.createElement("div",{className:"flex justify-center gap-2 mb-6"},
        ...pages.map((_,i) => React.createElement("div",{key:i,className:"w-2.5 h-2.5 rounded-full transition-colors "+(i===page?"bg-gold":"bg-slate-200")}))
      ),
      // Content
      pages[page](),
      // Navigation
      React.createElement("div",{className:"flex items-center justify-between mt-6 pt-4 border-t border-slate-100"},
        React.createElement("button",{onClick:onClose,className:"text-slate-400 text-sm hover:text-slate-600"},"Skip"),
        React.createElement("div",{className:"text-sm text-slate-400"},page+1+" / "+pages.length),
        page < pages.length - 1
          ? React.createElement("button",{onClick:()=>setPage(page+1),className:"bg-navy text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-navy-light transition-colors"},
              "Next \u2192")
          : React.createElement("button",{onClick:onClose,className:"bg-gold text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-gold-light transition-colors"},
              "Get Started \u2192")
      ),
    ),
  );
};
const Card = ({ label, value, sub, icon }) => React.createElement("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-2.5 md:p-4 flex flex-col" }, React.createElement("div", { className: "text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5" }, icon, " ", label), React.createElement("div", { className: "text-lg md:text-2xl font-bold text-navy leading-tight" }, value), sub && React.createElement("div", { className: "text-[10px] md:text-xs text-slate-500 mt-0.5" }, sub));
const RangeSlider = ({ min, max, step = 1, value, onChange, label, suffix = "" }) => {
  const pct = (value - min) / (max - min) * 100;
  return React.createElement("div", null, React.createElement("div", { className: "flex items-center justify-between mb-0.5" }, React.createElement("span", { className: "text-[10px] font-semibold text-slate-500 uppercase tracking-wide" }, label), React.createElement("span", { className: "text-[11px] font-bold text-navy bg-navy/5 px-1.5 py-0.5 rounded" }, value, suffix)), React.createElement("div", { className: "relative h-6 flex items-center" }, React.createElement("div", { className: "absolute left-0 right-0 h-1.5 bg-slate-200 rounded-full overflow-hidden" }, React.createElement("div", { className: "h-full bg-gold rounded-full transition-all", style: { width: pct + "%" } })), React.createElement("input", { type: "range", min, max, step, value, onChange, className: "range-input absolute w-full" })), React.createElement("div", { className: "flex justify-between text-[9px] text-slate-300" }, React.createElement("span", null, min, suffix), React.createElement("span", null, max, suffix)));
};
const FilterBar = ({ filters, setFilters, villages, filtered }) => {
  const strategies = ["Flip", "Hold", "BRRRR", "Value-Add"];
  const grades = ["A", "B", "C", "D"];
  const types = ["SF", "Multi", "Apt", "Condo"];
  const typeMap = { "SF": "SF", "Multi": "MultiSmall", "Apt": "AptSmall", "Condo": "Condo" };
  const toggle = (key, val) => {
    setFilters((f) => {
      const arr = [...f[key]];
      const idx = arr.indexOf(val);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(val);
      return { ...f, [key]: arr };
    });
  };
  const [showMore, setShowMore] = useState(false);
  const Chip = ({ active, label, onClick, color, small }) => React.createElement("button", { onClick, className: (small ? "px-2 py-1 text-[10px]" : "px-2.5 py-1.5 text-[11px]") + " rounded-full font-semibold transition-all " + (active ? color || "bg-navy text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200") }, label);
  const resetFilters = () => setFilters({ strategies: [], villages: [], grades: [], types: [], minScore: 3, minPrice: 0, maxPrice: 1e7, minTenure: 0, minROI: 0, search: "" });
  return React.createElement("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-2 lg:p-3 no-print" }, React.createElement("div", { className: "flex items-center gap-2 flex-wrap" }, React.createElement("input", { type: "text", placeholder: "Search address, owner...", value: filters.search, onChange: (e) => setFilters((f) => ({ ...f, search: e.target.value })), className: "flex-1 min-w-[120px] max-w-[200px] lg:max-w-[260px] px-2.5 py-1.5 text-[11px] lg:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/40" }), strategies.map((s) => React.createElement(Chip, { key: s, label: s, active: filters.strategies.includes(s), onClick: () => toggle("strategies", s), color: filters.strategies.includes(s) ? stratColor(s) + " text-white" : "", small: true })), grades.map((g) => React.createElement(Chip, { key: g, label: g, active: filters.grades.includes(g), onClick: () => toggle("grades", g), small: true })), React.createElement("span", { className: "text-[10px] text-slate-400 font-medium ml-auto" }, filtered, " results"), React.createElement("button", { onClick: () => setShowMore(!showMore), className: "text-[10px] text-gold font-semibold hover:text-gold-dark" }, showMore ? "Less" : "More"), React.createElement("button", { onClick: resetFilters, className: "text-[10px] text-slate-400 hover:text-red-400" }, "Reset")), showMore && React.createElement("div", { className: "mt-2 pt-2 border-t border-slate-100 fade-in" }, React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2" }, React.createElement(RangeSlider, { label: "Min Score", min: 0, max: 12, value: filters.minScore, onChange: (e) => setFilters((f) => ({ ...f, minScore: +e.target.value })) }), React.createElement(RangeSlider, { label: "Min Tenure", min: 0, max: 125, value: filters.minTenure, onChange: (e) => setFilters((f) => ({ ...f, minTenure: +e.target.value })), suffix: " yrs" }), React.createElement(RangeSlider, { label: "Min ROI", min: 0, max: 100, step: 5, value: filters.minROI, onChange: (e) => setFilters((f) => ({ ...f, minROI: +e.target.value })), suffix: "%" }), React.createElement("div", null, React.createElement("div", { className: "text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1" }, "Price Range"), React.createElement("div", { className: "flex gap-1" }, React.createElement("input", { type: "number", step: "50000", placeholder: "Min", value: filters.minPrice || "", onChange: (e) => setFilters((f) => ({ ...f, minPrice: +e.target.value })), className: "w-full px-1.5 py-1 text-[11px] border border-slate-200 rounded" }), React.createElement("input", { type: "number", step: "50000", placeholder: "Max", value: filters.maxPrice < 1e7 ? filters.maxPrice : "", onChange: (e) => setFilters((f) => ({ ...f, maxPrice: +e.target.value || 1e7 })), className: "w-full px-1.5 py-1 text-[11px] border border-slate-200 rounded" })))), React.createElement("div", { className: "flex items-center gap-2 mt-2 flex-wrap" }, React.createElement("span", { className: "text-[10px] text-slate-400 font-semibold" }, "Type:"), types.map((t) => React.createElement(Chip, { key: t, label: t, active: filters.types.includes(typeMap[t]), onClick: () => toggle("types", typeMap[t]), small: true })), React.createElement("span", { className: "text-[10px] text-slate-400 font-semibold ml-2" }, "Village:"), React.createElement("select", { value: filters.villages[0] || "", onChange: (e) => setFilters((f) => ({ ...f, villages: e.target.value ? [e.target.value] : [] })), className: "text-[11px] border border-slate-200 rounded px-1.5 py-1" }, React.createElement("option", { value: "" }, "All"), villages.map((v) => React.createElement("option", { key: v, value: v }, v))))));
};
const Row = ({ label, value, highlight }) => React.createElement("div", { className: "flex items-center justify-between py-0.5 " + (highlight ? "font-bold" : "") }, React.createElement("span", { className: "text-[10px] lg:text-xs " + (highlight ? "text-navy" : "text-slate-600") }, label), React.createElement("span", { className: "text-[11px] lg:text-sm font-medium " + (highlight ? "text-navy" : "text-slate-700") }, value));
const PropertyDetail = ({ prop, market, onClose, onToggleStar, isStarred }) => {
  const [btnText, setBtnText] = useState("Recalculate Analysis");
  const parseNum = s => parseFloat(String(s).replace(/[^0-9.]/g, "")) || 0;
  const fmtInit = n => Math.round(n).toLocaleString();
  const [inputs, setInputs] = useState({
    purchase: fmtInit(prop.assessedValue), reno: fmtInit(prop.estRenoBudget),
    arv: fmtInit(prop.estARV), rent: fmtInit(prop.estMonthlyRent),
    rate: (market.mortgageRate * 100).toFixed(1), down: String(market.downPaymentPct * 100),
    hold: String(prop.strategy === "Flip" ? market.holdingMonths_flip : 12), comm: "4.0"
  });


  const runCalc = (vals) => {
    const pp = vals.purchasePrice;
    const reno = vals.renoBudget;
    const arv = vals.arvEstimate;
    const rent = vals.monthlyRent;
    const rate = vals.interestRate / 100;
    const dp = vals.downPayment / 100;
    const months = vals.holdingMonths;
    const commPct = vals.comm / 100;
    const purchaseComm = pp * commPct;
    const holdCost = pp * (rate * months / 12);
    const sellingCost = arv * 0.05;
    const totalCost = reno + holdCost + sellingCost + purchaseComm;
    const netProfit = arv - pp - totalCost;
    const roi = pp + reno > 0 ? netProfit / (pp + reno) * 100 : 0;
    const loanAmt = pp * (1 - dp);
    const monthlyMortgage = calcMortgage(loanAmt, rate);
    const monthlyTax = pp * market.taxRate / 12;
    const monthlyIns = market.insuranceAnnual / 12;
    const monthlyMaint = pp * market.maintenancePct / 12;
    const monthlyVacancy = rent * market.vacancyRate;
    const totalExpense = monthlyMortgage + monthlyTax + monthlyIns + monthlyMaint + monthlyVacancy;
    const cashflow = rent - totalExpense;
    const annualRent = rent * 12;
    const annualNOI = annualRent * (1 - market.vacancyRate) - pp * market.taxRate - market.insuranceAnnual - pp * market.maintenancePct;
    const capRate = pp > 0 ? annualNOI / pp * 100 : 0;
    const grossYield = pp > 0 ? annualRent / pp * 100 : 0;
    const refiAmt = arv * market.refiLTV;
    const cashIn = pp * dp + reno + purchaseComm;
    const cashLeft = cashIn - (refiAmt - loanAmt);
    const refiMortgage = calcMortgage(refiAmt, rate);
    const brrrCashflow = rent - (refiMortgage + monthlyTax + monthlyIns + monthlyMaint + monthlyVacancy);
    const score = (() => {
      let s = 0;
      const psf = prop.sqft > 0 ? pp / prop.sqft : 999;
      if (psf < 350) s += 3; else if (psf < 450) s += 2; else if (psf < 550) s += 1;
      if (prop.tenure >= 50) s += 3; else if (prop.tenure >= 35) s += 2; else if (prop.tenure >= 25) s += 1;
      if (roi > 30) s += 3; else if (roi > 20) s += 2; else if (roi > 10) s += 1;
      if (prop.leadScore >= 11 && prop.leadGrade === "A") s += 3; else if (prop.leadScore >= 9 || prop.leadGrade === "A") s += 2; else if (prop.leadScore >= 7 || prop.leadGrade === "B") s += 1;
      return s;
    })();
    return { pp, reno, arv, rent, netProfit, roi, holdCost, sellingCost, purchaseComm, cashflow, monthlyMortgage, monthlyTax, monthlyIns, monthlyMaint, monthlyVacancy, totalExpense, capRate, grossYield, annualRent, annualNOI, refiAmt, cashIn, cashLeft, refiMortgage, brrrCashflow, score };
  };


  const [calc, setCalc] = useState(() => runCalc({
    purchasePrice: prop.assessedValue, renoBudget: prop.estRenoBudget,
    arvEstimate: prop.estARV, monthlyRent: prop.estMonthlyRent,
    interestRate: market.mortgageRate * 100, downPayment: market.downPaymentPct * 100,
    holdingMonths: prop.strategy === "Flip" ? market.holdingMonths_flip : 12, comm: 4
  }));

  const handleRecalc = () => {
    setBtnText("Calculating...");
    setCalc(runCalc({
      purchasePrice: parseNum(inputs.purchase), renoBudget: parseNum(inputs.reno),
      arvEstimate: parseNum(inputs.arv), monthlyRent: parseNum(inputs.rent),
      interestRate: parseNum(inputs.rate), downPayment: parseNum(inputs.down),
      holdingMonths: parseNum(inputs.hold), comm: parseNum(inputs.comm)
    }));
    setTimeout(() => {
      setBtnText("Updated \u2713");
      setTimeout(() => setBtnText("Recalculate Analysis"), 1500);
    }, 100);
  };

  return React.createElement("div", { className: "detail-modal", onClick: (e) => { if (e.target === e.currentTarget) onClose(); } },
    React.createElement("div", { className: "bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-auto my-2 lg:my-6 overflow-hidden", key: prop.id },
      React.createElement("div", { className: "bg-navy text-white px-3 lg:px-6 py-3 flex items-center justify-between" },
        React.createElement("div", { className: "min-w-0" },
          React.createElement("h3", { className: "text-sm lg:text-xl font-bold truncate" }, prop.address),
          React.createElement("p", { className: "text-[10px] lg:text-sm text-slate-300 truncate" }, prop.village, ", MA ", prop.zip, " \u00B7 ", prop.homeType, " \u00B7 ", prop.owner)),
        React.createElement("div", { className: "flex gap-2 flex-shrink-0 ml-2" },
          React.createElement("button", { onClick: () => onToggleStar(prop.id), className: "px-2 lg:px-3 py-1.5 rounded-lg text-[11px] lg:text-sm font-medium transition-all " + (isStarred ? "bg-gold text-white" : "bg-white/10 text-white hover:bg-white/20") }, isStarred ? "\u2605" : "\u2606"),
          React.createElement("button", { onClick: onClose, className: "px-2 lg:px-3 py-1.5 rounded-lg text-[11px] lg:text-sm bg-white/10 text-white hover:bg-white/20" }, "\u2715"))),
      React.createElement("div", { className: "px-3 lg:px-6 py-3 lg:py-4" },
        React.createElement("div", { className: "flex items-center gap-2 mb-3 flex-wrap" },
          React.createElement("span", { className: "px-2 py-1 rounded-full text-[10px] lg:text-xs font-bold text-white " + stratColor(prop.strategy) }, prop.strategy),
          React.createElement("span", { className: "px-2 py-1 rounded-full text-[10px] lg:text-xs font-bold " + scoreColor(calc.score) }, "Score: ", calc.score, "/12"),
          React.createElement("span", { className: "px-2 py-1 rounded-full text-[10px] lg:text-xs font-bold " + gradeColor(prop.leadGrade) }, "Grade ", prop.leadGrade),
          prop.yearBuilt && React.createElement("span", { className: "text-[10px] text-slate-400" }, "Built ", prop.yearBuilt)),
        React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6" },
          React.createElement("div", { className: "space-y-0.5 col-span-2 lg:col-span-1" },
            React.createElement("h4", { className: "font-bold text-[11px] lg:text-sm text-navy mb-1 border-b-2 border-gold pb-1" }, "Adjustable Inputs"),
            ...["Purchase","Reno Budget","ARV","Rent/mo","Rate","Down Pmt","Hold","Purchase Comm"].map((label, i) => {
              const fields = ["purchase","reno","arv","rent","rate","down","hold","comm"];
              const prefixes = ["$","$","$","$",null,null,null,null];
              const suffixes = [null,null,null,null,"%","%","mo","%"];
              return React.createElement("div", { key: label, className: "flex items-center justify-between py-1 border-b border-slate-100" },
                React.createElement("span", { className: "text-[10px] lg:text-xs text-slate-600" }, label),
                React.createElement("div", { className: "flex items-center gap-0.5" },
                  prefixes[i] && React.createElement("span", { className: "text-[10px] text-slate-400" }, prefixes[i]),
                  React.createElement("input", { type: "text", inputMode: "decimal", value: inputs[fields[i]] || "",
                    onChange: function(e) { var f = fields[i]; setInputs(function(prev) { var n = {}; for (var k in prev) n[k] = prev[k]; n[f] = e.target.value; return n; }); },
                    className: "w-20 lg:w-24 text-right text-[11px] lg:text-sm font-medium px-1.5 py-0.5 border border-slate-200 rounded focus:ring-2 focus:ring-gold/40 focus:outline-none" }),
                  suffixes[i] && React.createElement("span", { className: "text-[10px] text-slate-400" }, suffixes[i])));
            }),
            React.createElement("button", { onClick: handleRecalc,
              className: "w-full mt-3 py-2.5 rounded-lg font-bold text-white text-sm transition-all " +
                (btnText === "Updated \u2713" ? "bg-emerald-500" : "bg-gold hover:opacity-90")
            }, btnText)),
          React.createElement("div", { className: "space-y-0.5" },
            React.createElement("h4", { className: "font-bold text-[11px] lg:text-sm text-navy mb-1 border-b-2 border-emerald-500 pb-1" }, "Flip Analysis"),
            React.createElement(Row, { label: "Purchase", value: fmt(calc.pp) }),
            React.createElement(Row, { label: "+ Reno", value: fmt(calc.reno) }),
            React.createElement(Row, { label: "+ Hold", value: fmt(calc.holdCost) }),
            React.createElement(Row, { label: "+ Purch Comm", value: fmt(calc.purchaseComm) }),
            React.createElement(Row, { label: "+ Selling (5%)", value: fmt(calc.sellingCost) }),
            React.createElement(Row, { label: "ARV", value: fmt(calc.arv) }),
            React.createElement("div", { className: "border-t-2 border-navy pt-1 mt-1" },
              React.createElement(Row, { label: "Profit", value: fmt(calc.netProfit), highlight: true }),
              React.createElement(Row, { label: "ROI", value: fmt(calc.roi, "percent"), highlight: true })),
            React.createElement("h4", { className: "font-bold text-[11px] lg:text-sm text-navy mt-3 mb-1 border-b-2 border-purple-500 pb-1" }, "BRRRR"),
            React.createElement(Row, { label: "Cash In", value: fmt(calc.cashIn) }),
            React.createElement(Row, { label: "Refi (75%)", value: fmt(calc.refiAmt) }),
            React.createElement(Row, { label: "Cash Left", value: fmt(calc.cashLeft), highlight: true }),
            React.createElement(Row, { label: "CF/mo", value: fmt(calc.brrrCashflow) })),
          React.createElement("div", { className: "space-y-0.5" },
            React.createElement("h4", { className: "font-bold text-[11px] lg:text-sm text-navy mb-1 border-b-2 border-blue-500 pb-1" }, "Hold / Rental"),
            React.createElement(Row, { label: "Rent", value: fmt(calc.rent) }),
            React.createElement(Row, { label: "- Mortgage", value: fmt(-calc.monthlyMortgage) }),
            React.createElement(Row, { label: "- Tax", value: fmt(-calc.monthlyTax) }),
            React.createElement(Row, { label: "- Ins", value: fmt(-calc.monthlyIns) }),
            React.createElement(Row, { label: "- Maint", value: fmt(-calc.monthlyMaint) }),
            React.createElement(Row, { label: "- Vacancy", value: fmt(-calc.monthlyVacancy) }),
            React.createElement("div", { className: "border-t-2 border-navy pt-1 mt-1" },
              React.createElement(Row, { label: "CF/mo", value: fmt(calc.cashflow), highlight: true }),
              React.createElement(Row, { label: "NOI/yr", value: fmt(calc.annualNOI) }),
              React.createElement(Row, { label: "Yield", value: fmt(calc.grossYield, "percent") }),
              React.createElement(Row, { label: "Cap Rate", value: fmt(calc.capRate, "percent") })))),
        React.createElement("div", { className: "mt-3 bg-slate-50 rounded-lg p-2 text-[10px] lg:text-xs text-slate-500" },
          React.createElement("strong", null, "Data:"), " ", fmt(prop.assessedValue), " \u00B7 ", fmt(prop.sqft, "number"), " sqft \u00B7 ", fmt(prop.pricePerSqft), "/sqft \u00B7 Tenure: ", prop.tenure, " yrs \u00B7 Lead: ", prop.leadScore, " \u00B7 ", prop.segment, prop.lotSize ? " \u00B7 Lot: " + prop.lotSize + " ac" : "", prop.zoning ? " \u00B7 Zone: " + prop.zoning : ""))));
};
const CompareView = ({ properties, market, onClose }) => {
  if (properties.length === 0) return null;
  const metrics = [
    ["Assessed Value", (p) => fmt(p.assessedValue)],
    ["Sqft", (p) => fmt(p.sqft, "number")],
    ["$/Sqft", (p) => fmt(p.pricePerSqft)],
    ["Year Built", (p) => p.yearBuilt || "\u2014"],
    ["Tenure (yrs)", (p) => p.tenure],
    ["Lead Score", (p) => p.leadScore],
    ["Grade", (p) => p.leadGrade],
    ["Strategy", (p) => p.strategy],
    ["Inv Score", (p) => p.investmentScore + "/12"],
    ["Est ARV", (p) => fmt(p.estARV)],
    ["Reno Budget", (p) => fmt(p.estRenoBudget)],
    ["Est Profit", (p) => fmt(p.estProfit)],
    ["Est ROI", (p) => fmt(p.estROI, "percent")],
    ["Monthly Rent", (p) => fmt(p.estMonthlyRent)],
    ["Gross Yield", (p) => fmt(p.estGrossYield, "percent")],
    ["BRRRR Cash Left", (p) => fmt(p.brrrr_cashLeft)]
  ];
  return React.createElement("div", { className: "bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6 fade-in" }, React.createElement("div", { className: "flex items-center justify-between mb-4" }, React.createElement("h3", { className: "font-bold text-navy text-lg" }, "Property Comparison (", properties.length, ")"), React.createElement("button", { onClick: onClose, className: "text-sm text-slate-500 hover:text-slate-700" }, "Close Comparison")), React.createElement("div", { className: "overflow-x-auto" }, React.createElement("table", { className: "w-full text-sm" }, React.createElement("thead", null, React.createElement("tr", { className: "bg-navy text-white" }, React.createElement("th", { className: "text-left px-3 py-2 font-semibold" }, "Metric"), properties.map((p) => React.createElement("th", { key: p.id, className: "text-right px-3 py-2 font-semibold" }, p.address.substring(0, 25))))), React.createElement("tbody", null, metrics.map(([label, fn], i) => React.createElement("tr", { key: label, className: i % 2 === 0 ? "bg-slate-50" : "" }, React.createElement("td", { className: "px-3 py-1.5 font-medium text-slate-600" }, label), properties.map((p) => React.createElement("td", { key: p.id, className: "text-right px-3 py-1.5" }, fn(p)))))))));
};
const App = () => {
  const [allData, setAllData] = useState(window.__PROPERTIES__ || null);
  const market = window.__MARKET__;
  const stats = window.__STATS__;
  useEffect(() => {
    if (!allData) {
      const s = document.createElement("script");
      s.src = "data.js";
      s.onload = () => setAllData(window.__PROPERTIES__);
      document.body.appendChild(s);
    }
  }, []);
  const [filters, setFilters] = useState({
    strategies: [],
    villages: [],
    grades: [],
    types: [],
    minScore: 3,
    minPrice: 0,
    maxPrice: 1e7,
    minTenure: 0,
    minROI: 0,
    search: ""
  });
  const [appPhase, setAppPhase] = useState("rotate");
  const [sortKey, setSortKey] = useState("investmentScore");
  const [sortDir, setSortDir] = useState(-1);
  const [expandedId, setExpandedId] = useState(null);
  const [starred, setStarred] = useState(() => { try { var s = JSON.parse(localStorage.getItem("marlborough_starred") || "[]"); return new Set(s); } catch(e) { return new Set(); } });
  useEffect(() => { localStorage.setItem("marlborough_starred", JSON.stringify([...starred])); }, [starred]);
  const [showCompare, setShowCompare] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;
  const villages = useMemo(() => [...new Set((allData||[]).map((p) => p.village))].sort(), [allData]);
  const filtered = useMemo(() => {
    if (!allData) return [];
    let d = allData.filter((p) => {
      if (filters.strategies.length && !filters.strategies.includes(p.strategy)) return false;
      if (filters.villages.length && !filters.villages.includes(p.village)) return false;
      if (filters.grades.length && !filters.grades.includes(p.leadGrade)) return false;
      if (filters.types.length && !filters.types.includes(p.homeType)) return false;
      if (p.investmentScore < filters.minScore) return false;
      if (p.assessedValue < filters.minPrice || p.assessedValue > filters.maxPrice) return false;
      if (p.tenure < filters.minTenure) return false;
      if (p.estROI < filters.minROI) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!p.address.toLowerCase().includes(s) && !p.owner.toLowerCase().includes(s) && !p.segment.toLowerCase().includes(s) && !p.village.toLowerCase().includes(s)) return false;
      }
      return true;
    });
    d.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (av == null) av = -Infinity;
      if (bv == null) bv = -Infinity;
      return (av < bv ? -1 : av > bv ? 1 : 0) * sortDir;
    });
    return d;
  }, [allData, filters, sortKey, sortDir]);
  const paged = useMemo(() => filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE), [filtered, page]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  useEffect(() => setPage(0), [filters, sortKey, sortDir]);
  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => d * -1);
    else {
      setSortKey(key);
      setSortDir(-1);
    }
  };
  const toggleStar = (id) => setStarred((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    return n;
  });
  const starredProps = useMemo(() => (allData||[]).filter((p) => starred.has(p.id)), [allData, starred]);
  const buildListText = (props) => {
    let txt = "Marlborough MA \u2014 Property Shortlist (" + props.length + " properties)\n";
    txt += "Sent from Marlborough Investment Analyzer on " + new Date().toLocaleDateString() + "\n\n";
    props.forEach((p, i) => {
      txt += (i + 1) + ". " + p.address + ", " + p.village + " MA " + p.zip + "\n";
      txt += "   Owner: " + p.owner + " | Type: " + p.homeType + " | Strategy: " + p.strategy + "\n";
      txt += "   Assessed: " + fmt(p.assessedValue) + " | " + fmt(p.sqft, "number") + " sqft | $/sqft: " + fmt(p.pricePerSqft) + "\n";
      txt += "   Score: " + p.investmentScore + "/12 | Grade: " + p.leadGrade + " | Tenure: " + p.tenure + " yrs\n";
      txt += "   Est ARV: " + fmt(p.estARV) + " | Reno: " + fmt(p.estRenoBudget) + " | Profit: " + fmt(p.estProfit) + " | ROI: " + fmt(p.estROI, "percent") + "\n";
      if (p.homeType === "MultiSmall" || p.homeType === "AptSmall") {
        txt += "   Rent: " + fmt(p.estMonthlyRent) + "/mo | Yield: " + fmt(p.estGrossYield, "percent") + " | Cashflow: " + fmt(p.estMonthlyCashflow) + "/mo\n";
      }
      txt += "   Segment: " + p.segment + "\n\n";
    });
    return txt;
  };
  const sendListToZev = () => {
    if (starredProps.length === 0) return;
    const subject = encodeURIComponent("Marlborough Investment Shortlist \u2014 " + starredProps.length + " Properties");
    const body = encodeURIComponent(buildListText(starredProps));
    const mailtoUrl = "mailto:zev.steinmetz@raveis.com?subject=" + subject + "&body=" + body;
    if (mailtoUrl.length > 2000) {
      navigator.clipboard.writeText(buildListText(starredProps)).then(() => {
        setSendStatus("copied");
        setTimeout(() => setSendStatus(null), 4000);
      });
      const shortBody = encodeURIComponent("Marlborough Investment Shortlist \u2014 " + starredProps.length + " properties\n\nFull list copied to clipboard. Please paste below.\n\nProperties: " + starredProps.map((p) => p.address).join(", "));
      window.open("mailto:zev.steinmetz@raveis.com?subject=" + subject + "&body=" + shortBody, "_self");
    } else {
      window.open(mailtoUrl, "_self");
      setSendStatus("sent");
      setTimeout(() => setSendStatus(null), 3000);
    }
  };
  const downloadCSV = () => {
    if (starredProps.length === 0) return;
    const headers = ["Address", "Village", "ZIP", "Owner", "Type", "Assessed Value", "Sqft", "$/Sqft", "Tenure", "Lead Score", "Grade", "Strategy", "Inv Score", "Est ARV", "Reno Budget", "Est Profit", "ROI%", "Monthly Rent", "Gross Yield%", "Segment"];
    const rows = starredProps.map((p) => [p.address, p.village, p.zip, p.owner, p.homeType, p.assessedValue, p.sqft, p.pricePerSqft, p.tenure, p.leadScore, p.leadGrade, p.strategy, p.investmentScore, p.estARV, p.estRenoBudget, p.estProfit, p.estROI, p.estMonthlyRent, p.estGrossYield, p.segment]);
    let csv = headers.join(",") + "\n";
    rows.forEach((r) => { csv += r.map((v) => '"' + String(v != null ? v : "").replace(/"/g, '""') + '"').join(",") + "\n"; });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Marlborough_Shortlist_" + new Date().toISOString().slice(0, 10) + ".csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const clearList = () => setStarred(new Set());
  const SortHeader = ({ k, label }) => React.createElement("th", { onClick: () => handleSort(k), className: "px-1 py-1.5 lg:px-2 lg:py-2.5 text-left text-[10px] lg:text-xs font-semibold cursor-pointer hover:bg-navy-light select-none whitespace-nowrap" }, label, " ", sortKey === k ? (sortDir === 1 ? "\u25B2" : "\u25BC") : "");
  if (appPhase === "guide") {
    return React.createElement(IntroOverlay, { onClose: () => setAppPhase("app") });
  }
  if (appPhase === "rotate") {
    return React.createElement(RotatePrompt, { onContinue: () => setAppPhase("guide") });
  }
  if (!allData) {
    return React.createElement("div", { className: "fixed inset-0 bg-navy flex flex-col items-center justify-center" }, React.createElement(LogoSVG), React.createElement("div", { className: "text-gold font-bold text-sm mb-2" }, "Loading properties..."), React.createElement("div", { style: { width: 100, height: 3, background: "#2D6A4F", borderRadius: 3, overflow: "hidden" } }, React.createElement("div", { style: { width: "40%", height: "100%", background: "#95D5B2", borderRadius: 3, animation: "loadbar 1.2s ease-in-out infinite" } })), React.createElement("style", null, "@keyframes loadbar{0%{width:10%;margin-left:0}50%{width:50%;margin-left:25%}100%{width:10%;margin-left:90%}}"));
  }
  return React.createElement("div", { className: "min-h-screen", style: { background: "#F8FAFC" } }, showIntro && React.createElement(IntroOverlay, { onClose: () => setShowIntro(false) }), React.createElement("header", { className: "bg-navy text-white py-3 md:py-5 px-4 md:px-6 shadow-lg app-header" }, React.createElement("div", { className: "max-w-[1600px] mx-auto flex items-center justify-between gap-3" }, React.createElement("div", { className: "flex items-center gap-3 min-w-0" }, React.createElement(LogoSVG), React.createElement("div", { className: "min-w-0" }, React.createElement("h1", { className: "text-base md:text-2xl font-bold tracking-tight truncate" }, "Marlborough MA \u2014 Investment Analyzer"), React.createElement("p", { className: "text-slate-400 text-[11px] md:text-xs mt-0.5" }, "Steinmetz Real Estate | William Raveis"))), React.createElement("button", { onClick: () => setShowIntro(true), className: "px-3 py-2 rounded-lg text-xs md:text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors no-print flex-shrink-0", title: "How to use this tool" }, "? Guide"))), React.createElement("div", { className: "max-w-[1600px] mx-auto px-3 md:px-4 -mt-3 md:-mt-4" }, React.createElement("div", { className: "grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 dash-cards" }, React.createElement(Card, { label: "Properties Analyzed", value: fmt(stats.total, "number"), icon: "" }), React.createElement(Card, { label: "Median Price", value: fmt(market.medianPrice), sub: "Marlborough overall", icon: "" }), React.createElement(Card, { label: "Median $/sqft", value: fmt(market.avgPSF_overall), sub: "All conditions", icon: "" }), React.createElement(Card, { label: "Mortgage Rate", value: "6.00%", sub: "30yr fixed", icon: "" }), React.createElement(Card, { label: "Tax Rate", value: "$10.54/1K", sub: "FY2026", icon: "" }), React.createElement(Card, { label: "Opportunities", value: fmt(stats.opportunities, "number"), sub: stats.flips + " flip \u00B7 " + stats.holds + " hold \u00B7 " + stats.brrrrs + " BRRRR", icon: "" }))), starred.size > 0 && React.createElement("div", { className: "max-w-[1600px] mx-auto px-3 md:px-4 mt-4 no-print shortlist-bar" }, React.createElement("div", { className: "bg-gold/10 border border-gold/30 rounded-xl px-3 md:px-4 py-3" }, React.createElement("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2" }, React.createElement("span", { className: "text-sm font-bold text-gold-dark" }, "Your Shortlist (", starred.size, " properties)"), React.createElement("div", { className: "flex items-center gap-2 flex-wrap" }, React.createElement("button", { onClick: sendListToZev, className: "px-3 md:px-4 py-2 bg-navy text-white rounded-lg text-sm font-bold hover:bg-navy-light transition-colors flex items-center gap-1.5" }, React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" })), React.createElement("span", { className: "hidden sm:inline" }, "Send List to Zev"), React.createElement("span", { className: "sm:hidden" }, "Send")), React.createElement("button", { onClick: downloadCSV, className: "px-3 md:px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5" }, React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" })), React.createElement("span", { className: "hidden sm:inline" }, "Download CSV"), React.createElement("span", { className: "sm:hidden" }, "CSV")), starred.size <= 4 && React.createElement("button", { onClick: () => setShowCompare(!showCompare), className: "px-3 md:px-4 py-2 bg-gold text-white rounded-lg text-sm font-bold hover:bg-gold-dark transition-colors" }, showCompare ? "Hide" : "Compare"), React.createElement("button", { onClick: clearList, className: "px-3 py-2 text-red-400 hover:text-red-600 text-sm font-medium", title: "Clear all" }, "Clear"))), sendStatus === "copied" && React.createElement("div", { className: "mb-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700 font-medium" }, "List copied to clipboard \u2014 paste it into the email that just opened."), sendStatus === "sent" && React.createElement("div", { className: "mb-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700 font-medium" }, "Opening email client with your shortlist..."), React.createElement("div", { className: "flex items-center gap-2 flex-wrap" }, starredProps.map((p) => React.createElement("span", { key: p.id, className: "px-2 py-1.5 bg-white rounded-lg text-xs font-medium text-navy shadow-sm flex items-center gap-1" }, React.createElement("span", { className: "w-2 h-2 rounded-full flex-shrink-0 " + stratColor(p.strategy) }), React.createElement("span", { className: "truncate max-w-[140px] sm:max-w-none" }, p.address), React.createElement("span", { className: "hidden sm:inline text-slate-400" }, p.village), React.createElement("span", { className: "px-1.5 py-0.5 rounded text-[10px] font-bold " + scoreColor(p.investmentScore) }, p.investmentScore), React.createElement("button", { onClick: () => toggleStar(p.id), className: "ml-0.5 text-red-400 hover:text-red-600" }, "\u00D7")))))), showCompare && React.createElement("div", { className: "max-w-[1600px] mx-auto px-4 mt-4" }, React.createElement(CompareView, { properties: starredProps, market, onClose: () => setShowCompare(false) })), React.createElement("div", { className: "max-w-[1600px] mx-auto px-2 lg:px-4 py-2 lg:py-4 main-content" }, React.createElement(FilterBar, { filters, setFilters, villages, filtered: filtered.length }), React.createElement("div", { className: "mt-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" }, React.createElement("div", { className: "overflow-x-auto scrollbar-thin" }, React.createElement("table", { className: "w-full data-table", style: { tableLayout: "auto" } }, React.createElement("thead", { className: "bg-navy text-white sticky top-0 z-10" }, React.createElement("tr", null, React.createElement("th", { className: "px-1 py-1.5 w-6" }), React.createElement(SortHeader, { k: "address", label: "Address" }), React.createElement(SortHeader, { k: "village", label: "Village" }), React.createElement(SortHeader, { k: "homeType", label: "Type" }), React.createElement(SortHeader, { k: "assessedValue", label: "Value" }), React.createElement(SortHeader, { k: "tenure", label: "Yrs" }), React.createElement(SortHeader, { k: "leadGrade", label: "Grd" }), React.createElement(SortHeader, { k: "strategy", label: "Strategy" }), React.createElement(SortHeader, { k: "investmentScore", label: "Score" }), React.createElement(SortHeader, { k: "estROI", label: "ROI%" }), React.createElement(SortHeader, { k: "estProfit", label: "Profit" }))), React.createElement("tbody", { className: "divide-y divide-slate-100" }, paged.map((p) => React.createElement("tr", { key: p.id, onClick: () => setExpandedId(expandedId === p.id ? null : p.id), className: "cursor-pointer hover:bg-slate-50 transition-colors " + (expandedId === p.id ? "bg-blue-50" : "") + " " + (starred.has(p.id) ? "border-l-4 border-l-gold" : "") }, React.createElement("td", { className: "px-1 py-1 text-center" }, React.createElement("button", { onClick: (e) => { e.stopPropagation(); toggleStar(p.id); }, className: "text-xs " + (starred.has(p.id) ? "text-gold" : "text-slate-300 hover:text-slate-400") }, starred.has(p.id) ? "\u2605" : "\u2606")), React.createElement("td", { className: "px-1 py-1 text-[11px] lg:text-[13px] font-medium text-navy addr-cell", title: p.address }, p.address), React.createElement("td", { className: "px-1 py-1 text-[10px] lg:text-[11px] text-slate-600 whitespace-nowrap" }, p.village), React.createElement("td", { className: "px-1 py-1 text-[10px] lg:text-[11px] text-slate-600" }, p.homeType), React.createElement("td", { className: "px-1 py-1 text-[11px] lg:text-[13px] font-medium text-right whitespace-nowrap" }, fmt(p.assessedValue)), React.createElement("td", { className: "px-1 py-1 text-[11px] lg:text-[13px] text-center" }, p.tenure), React.createElement("td", { className: "px-1 py-1" }, React.createElement("span", { className: "px-1 py-0.5 rounded text-[9px] lg:text-[10px] font-bold " + gradeColor(p.leadGrade) }, p.leadGrade)), React.createElement("td", { className: "px-1 py-1" }, React.createElement("span", { className: "px-1 py-0.5 rounded text-[9px] lg:text-[10px] font-bold text-white " + stratColor(p.strategy) }, p.strategy)), React.createElement("td", { className: "px-1 py-1" }, React.createElement("span", { className: "px-1 py-0.5 rounded text-[9px] lg:text-[10px] font-bold " + scoreColor(p.investmentScore) }, p.investmentScore)), React.createElement("td", { className: "px-1 py-1 text-[11px] lg:text-[13px] text-right font-medium", style: { color: p.estROI > 20 ? "#059669" : p.estROI > 10 ? "#D97706" : "#64748B" } }, fmt(p.estROI, "percent")), React.createElement("td", { className: "px-1 py-1 text-[11px] lg:text-[13px] text-right font-medium whitespace-nowrap" }, fmt(p.estProfit))))))), React.createElement("div", { className: "flex items-center justify-between px-2 lg:px-4 py-1.5 lg:py-3 border-t border-slate-200 bg-slate-50" }, React.createElement("div", { className: "text-[10px] lg:text-xs text-slate-500" }, page * PAGE_SIZE + 1, "\u2013", Math.min((page + 1) * PAGE_SIZE, filtered.length), " of ", fmt(filtered.length, "number")), React.createElement("div", { className: "flex gap-1" }, React.createElement("button", { disabled: page === 0, onClick: () => setPage((p) => p - 1), className: "px-2 lg:px-3 py-1 rounded text-xs lg:text-sm bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50" }, "Prev"), Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    let pg = i;
    if (totalPages > 5) {
      if (page < 3) pg = i;
      else if (page > totalPages - 3) pg = totalPages - 5 + i;
      else pg = page - 2 + i;
    }
    return React.createElement("button", { key: pg, onClick: () => setPage(pg), className: "px-2 lg:px-3 py-1 rounded text-xs lg:text-sm " + (page === pg ? "bg-navy text-white" : "bg-white border border-slate-200 hover:bg-slate-50") }, pg + 1);
  }), React.createElement("button", { disabled: page >= totalPages - 1, onClick: () => setPage((p) => p + 1), className: "px-2 lg:px-3 py-1 rounded text-xs lg:text-sm bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50" }, "Next"))))), expandedId && (() => {
    const p = (allData||[]).find((x) => x.id === expandedId);
    return p ? React.createElement(PropertyDetail, { prop: p, market, onClose: () => setExpandedId(null), onToggleStar: toggleStar, isStarred: starred.has(p.id) }) : null;
  })(), React.createElement("footer", { className: "bg-navy text-slate-400 text-xs text-center py-3 mt-4 app-footer" }, "Marlborough MA Investment Analysis \u00B7 Steinmetz Real Estate \u00B7 William Raveis \u00B7 Generated ", new Date().toLocaleDateString()));
};
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, null));

// Generate favicon via canvas
setTimeout(function(){
  var s=32,c=document.createElement('canvas');c.width=s;c.height=s;var x=c.getContext('2d');
  var r=5;x.beginPath();x.moveTo(r,0);x.lineTo(s-r,0);x.quadraticCurveTo(s,0,s,r);x.lineTo(s,s-r);x.quadraticCurveTo(s,s,s-r,s);x.lineTo(r,s);x.quadraticCurveTo(0,s,0,s-r);x.lineTo(0,r);x.quadraticCurveTo(0,0,r,0);x.closePath();
  var g=x.createLinearGradient(0,0,s,s);g.addColorStop(0,'#1B4332');g.addColorStop(1,'#0F2818');x.fillStyle=g;x.fill();
  x.strokeStyle='#95D5B2';x.lineWidth=2;x.lineCap='round';x.lineJoin='round';
  x.beginPath();x.moveTo(6,14);x.lineTo(16,6);x.lineTo(26,14);x.stroke();
  x.lineWidth=1.2;x.globalAlpha=0.7;x.beginPath();x.moveTo(8,14);x.lineTo(8,24);x.lineTo(24,24);x.lineTo(24,14);x.stroke();
  x.globalAlpha=1;x.lineWidth=1;x.beginPath();x.rect(14,19,4,5);x.stroke();
  x.beginPath();x.rect(9.5,16,4,3);x.stroke();x.beginPath();x.rect(18.5,16,4,3);x.stroke();
  x.globalAlpha=0.8;x.lineWidth=1.2;x.beginPath();x.arc(24,10,5,0,Math.PI*2);x.stroke();
  x.beginPath();x.arc(24,10,1.5,0,Math.PI*2);x.fillStyle='#95D5B2';x.fill();
  var lnk=document.getElementById('dynamic-favicon');if(lnk)lnk.href=c.toDataURL('image/png');
},100);
