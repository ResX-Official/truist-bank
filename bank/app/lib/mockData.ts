// ─── User ─────────────────────────────────────────────────────────────────────
export const currentUser = {
  name: "Alex Morgan",
  firstName: "Alex",
  email: "alex.morgan@onyx.bank",
  phone: "+1 (415) 555-0182",
  avatarInitials: "AM",
  avatarBg: "linear-gradient(135deg, #1B5FBE, #4895EF)",
  memberSince: "January 2024",
  tier: "Premium",
  location: "San Francisco, CA",
};

// ─── Accounts ─────────────────────────────────────────────────────────────────
export const accounts = [
  {
    id: "acc1",
    name: "Main Checking",
    number: "•••• •••• •••• 4829",
    balance: 24850.5,
    currency: "USD",
    type: "checking",
    change: +1250.0,
    changePercent: +5.29,
    color: "linear-gradient(135deg, #1B5FBE, #4895EF)",
    iban: "US82 ONYX 0003 5529 8765 4829",
  },
  {
    id: "acc2",
    name: "Savings Vault",
    number: "•••• •••• •••• 7714",
    balance: 98440.0,
    currency: "USD",
    type: "savings",
    change: +840.0,
    changePercent: +0.86,
    color: "linear-gradient(135deg, #0E9A63, #3ECFA0)",
    iban: "US82 ONYX 0003 5529 8765 7714",
  },
  {
    id: "acc3",
    name: "Investment Portfolio",
    number: "•••• •••• •••• 2203",
    balance: 42180.75,
    currency: "USD",
    type: "investment",
    change: -1200.0,
    changePercent: -2.76,
    color: "linear-gradient(135deg, #6C3FC5, #9C72E8)",
    iban: "US82 ONYX 0003 5529 8765 2203",
  },
];

export const totalNetWorth = accounts.reduce((sum, a) => sum + a.balance, 0);
export const totalChange = accounts.reduce((sum, a) => sum + a.change, 0);

// ─── Transactions ──────────────────────────────────────────────────────────────
export const transactions = [
  { id: "tx001", name: "Salary Deposit", category: "Income", amount: 8500.0, date: "Feb 27, 2026", time: "9:00 AM", status: "completed", type: "credit", icon: "💼" },
  { id: "tx002", name: "Netflix", category: "Entertainment", amount: -15.99, date: "Feb 27, 2026", time: "2:30 PM", status: "completed", type: "debit", icon: "🎬" },
  { id: "tx003", name: "Amazon", category: "Shopping", amount: -89.99, date: "Feb 26, 2026", time: "4:15 PM", status: "completed", type: "debit", icon: "📦" },
  { id: "tx004", name: "Uber Eats", category: "Food & Drink", amount: -34.5, date: "Feb 26, 2026", time: "7:45 PM", status: "completed", type: "debit", icon: "🍔" },
  { id: "tx005", name: "Freelance Payment", category: "Income", amount: 2500.0, date: "Feb 25, 2026", time: "10:00 AM", status: "completed", type: "credit", icon: "💻" },
  { id: "tx006", name: "Spotify", category: "Entertainment", amount: -9.99, date: "Feb 25, 2026", time: "12:00 PM", status: "completed", type: "debit", icon: "🎵" },
  { id: "tx007", name: "Starbucks", category: "Food & Drink", amount: -7.5, date: "Feb 24, 2026", time: "8:15 AM", status: "completed", type: "debit", icon: "☕" },
  { id: "tx008", name: "Transfer from Sarah", category: "Transfer", amount: 250.0, date: "Feb 24, 2026", time: "3:20 PM", status: "completed", type: "credit", icon: "💸" },
  { id: "tx009", name: "Apple Store", category: "Shopping", amount: -1299.0, date: "Feb 23, 2026", time: "2:00 PM", status: "completed", type: "debit", icon: "🍎" },
  { id: "tx010", name: "Gym Membership", category: "Health", amount: -49.99, date: "Feb 22, 2026", time: "12:00 PM", status: "completed", type: "debit", icon: "💪" },
  { id: "tx011", name: "Grocery Store", category: "Food & Drink", amount: -127.8, date: "Feb 21, 2026", time: "4:30 PM", status: "completed", type: "debit", icon: "🛒" },
  { id: "tx012", name: "Investment Return", category: "Investment", amount: 1500.0, date: "Feb 20, 2026", time: "4:00 PM", status: "completed", type: "credit", icon: "📈" },
  { id: "tx013", name: "Rent Payment", category: "Housing", amount: -2200.0, date: "Feb 19, 2026", time: "9:00 AM", status: "completed", type: "debit", icon: "🏠" },
  { id: "tx014", name: "Electric Bill", category: "Utilities", amount: -89.4, date: "Feb 18, 2026", time: "11:30 AM", status: "pending", type: "debit", icon: "⚡" },
  { id: "tx015", name: "Health Insurance", category: "Insurance", amount: -145.0, date: "Feb 17, 2026", time: "9:00 AM", status: "completed", type: "debit", icon: "🛡" },
  { id: "tx016", name: "Dividend Payment", category: "Investment", amount: 320.5, date: "Feb 15, 2026", time: "2:00 PM", status: "completed", type: "credit", icon: "💰" },
  { id: "tx017", name: "Transfer to Savings", category: "Transfer", amount: -500.0, date: "Feb 13, 2026", time: "10:00 AM", status: "completed", type: "debit", icon: "🏦" },
  { id: "tx018", name: "Airbnb Booking", category: "Travel", amount: -380.0, date: "Feb 12, 2026", time: "3:00 PM", status: "completed", type: "debit", icon: "✈️" },
  { id: "tx019", name: "Amazon Refund", category: "Shopping", amount: 45.99, date: "Feb 10, 2026", time: "11:00 AM", status: "completed", type: "credit", icon: "↩️" },
  { id: "tx020", name: "Car Insurance", category: "Insurance", amount: -230.0, date: "Feb 8, 2026", time: "9:00 AM", status: "failed", type: "debit", icon: "🚗" },
];

// ─── Spending categories ───────────────────────────────────────────────────────
export const spendingCategories = [
  { category: "Food & Drink", amount: 169.79, percent: 27, color: "#4895EF" },
  { category: "Shopping", amount: 1342.99, percent: 22, color: "#9C72E8" },
  { category: "Housing", amount: 2200.0, percent: 18, color: "#3ECFA0" },
  { category: "Insurance", amount: 375.0, percent: 12, color: "#F48C5A" },
  { category: "Entertainment", amount: 25.98, percent: 8, color: "#F59E0B" },
  { category: "Travel", amount: 380.0, percent: 7, color: "#EC4899" },
  { category: "Health", amount: 49.99, percent: 4, color: "#74B9FF" },
  { category: "Utilities", amount: 89.4, percent: 2, color: "#6EE7B7" },
];

// ─── Monthly spending (bar chart) ─────────────────────────────────────────────
export const monthlySpending = [
  { month: "Aug", income: 9200, expense: 4100 },
  { month: "Sep", income: 8800, expense: 5200 },
  { month: "Oct", income: 11000, expense: 3800 },
  { month: "Nov", income: 9500, expense: 6100 },
  { month: "Dec", income: 12000, expense: 8200 },
  { month: "Jan", income: 10500, expense: 4900 },
  { month: "Feb", income: 11000, expense: 5633 },
];

// ─── Cards ────────────────────────────────────────────────────────────────────
export const cards = [
  {
    id: "c1",
    type: "physical",
    name: "ONYX Platinum",
    number: "4829",
    holder: "ALEX MORGAN",
    expiry: "09/28",
    cvv: "•••",
    limit: 15000,
    spent: 4823.47,
    status: "active",
    color: "linear-gradient(135deg, #091525 0%, #1B3A6B 32%, #0d2240 62%, #152f5c 100%)",
    frozen: false,
  },
  {
    id: "c2",
    type: "virtual",
    name: "ONYX Virtual",
    number: "7714",
    holder: "ALEX MORGAN",
    expiry: "12/26",
    cvv: "•••",
    limit: 5000,
    spent: 127.99,
    status: "active",
    color: "linear-gradient(135deg, #1a0a2e, #3b1f6e, #1a0a2e)",
    frozen: false,
  },
  {
    id: "c3",
    type: "virtual",
    name: "Subscriptions",
    number: "3301",
    holder: "ALEX MORGAN",
    expiry: "06/27",
    cvv: "•••",
    limit: 500,
    spent: 92.47,
    status: "active",
    color: "linear-gradient(135deg, #0E2E1A, #0E5F2E, #0E2E1A)",
    frozen: false,
  },
];

// ─── Investments ──────────────────────────────────────────────────────────────
export const investments = [
  { name: "S&P 500 ETF", ticker: "SPY", shares: 12.5, price: 592.4, value: 7405.0, change: 2.14, changeAmt: 155.45, allocation: 17.6 },
  { name: "Apple Inc.", ticker: "AAPL", shares: 28, price: 228.5, value: 6398.0, change: -0.82, changeAmt: -52.92, allocation: 15.2 },
  { name: "NVIDIA Corp.", ticker: "NVDA", shares: 15, price: 850.3, value: 12754.5, change: 4.62, changeAmt: 562.84, allocation: 30.2 },
  { name: "Bitcoin", ticker: "BTC", shares: 0.12, price: 74200.0, value: 8904.0, change: 1.85, changeAmt: 161.67, allocation: 21.1 },
  { name: "Ethereum", ticker: "ETH", shares: 1.8, price: 3985.0, value: 7173.0, change: -1.24, changeAmt: -90.06, allocation: 17.0 },
];

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminMetrics = {
  totalUsers: 2487392,
  activeToday: 18432,
  totalVolume: 12400000000,
  flaggedTx: 24,
  newUsersToday: 1284,
  revenueToday: 284900,
  successRate: 99.97,
  avgTransferTime: 1.4,
};

export const adminUsers = [
  { id: "USR001", name: "Alex Morgan", email: "alex.morgan@gmail.com", type: "Premium", balance: 24850.5, status: "active", joined: "Jan 15, 2024", txCount: 147, country: "US" },
  { id: "USR002", name: "Sarah Chen", email: "sarah.chen@outlook.com", type: "Business", balance: 142900.0, status: "active", joined: "Feb 3, 2024", txCount: 892, country: "SG" },
  { id: "USR003", name: "Marcus Steele", email: "m.steele@gmail.com", type: "Premium", balance: 8420.75, status: "active", joined: "Mar 22, 2024", txCount: 63, country: "GB" },
  { id: "USR004", name: "Priya Nair", email: "priya.nair@yahoo.com", type: "Starter", balance: 2180.0, status: "active", joined: "Apr 5, 2024", txCount: 28, country: "IN" },
  { id: "USR005", name: "James Okafor", email: "j.okafor@gmail.com", type: "Business", balance: 89400.0, status: "suspended", joined: "May 12, 2024", txCount: 341, country: "NG" },
  { id: "USR006", name: "Emma Larsson", email: "emma.l@proton.me", type: "Premium", balance: 31200.0, status: "active", joined: "Jun 8, 2024", txCount: 215, country: "SE" },
  { id: "USR007", name: "Carlos Mendes", email: "c.mendes@gmail.com", type: "Starter", balance: 890.4, status: "pending", joined: "Jul 30, 2024", txCount: 4, country: "BR" },
  { id: "USR008", name: "Yuki Tanaka", email: "yuki.t@icloud.com", type: "Premium", balance: 54100.0, status: "active", joined: "Aug 14, 2024", txCount: 486, country: "JP" },
];

export const adminTransactions = [
  { id: "TX8834291", from: "Sarah Chen", to: "ACME Corp", amount: 24500.0, type: "Business Transfer", status: "completed", time: "14 min ago", flag: false },
  { id: "TX8834290", from: "Unknown", to: "Alex Morgan", amount: 9800.0, type: "Incoming Wire", status: "flagged", time: "22 min ago", flag: true },
  { id: "TX8834289", from: "James Okafor", to: "Offshore LLC", amount: 48000.0, type: "International", status: "blocked", time: "35 min ago", flag: true },
  { id: "TX8834288", from: "Yuki Tanaka", to: "Amazon JP", amount: 1240.0, type: "Purchase", status: "completed", time: "48 min ago", flag: false },
  { id: "TX8834287", from: "Emma Larsson", to: "ONYX Savings", amount: 5000.0, type: "Internal Transfer", status: "completed", time: "1h ago", flag: false },
  { id: "TX8834286", from: "Priya Nair", to: "Insurance Co", amount: 850.0, type: "Bill Pay", status: "pending", time: "1h 12m ago", flag: false },
  { id: "TX8834285", from: "Marcus Steele", to: "Coinbase", amount: 3200.0, type: "Crypto Buy", status: "flagged", time: "1h 28m ago", flag: true },
];

export const userGrowth = [
  { month: "Aug", users: 1820000 },
  { month: "Sep", users: 1950000 },
  { month: "Oct", users: 2080000 },
  { month: "Nov", users: 2200000 },
  { month: "Dec", users: 2310000 },
  { month: "Jan", users: 2400000 },
  { month: "Feb", users: 2487392 },
];
