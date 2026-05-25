import { ethers } from 'ethers';

/**
 * Vesta Pro - Ultra-Yield Client-Side Engine v5.4
 * Handles Trading, Loans, and Agent Hierarchy.
 * Updated: 100% Daily ROI, 23h Cycles, 1000% Total Return Goal.
 */

export interface Investment {
  id: string;
  assetName: string;
  assetType: 'crypto' | 'stock';
  amount: number;
  targetReturn: number;
  earnedSoFar: number;
  dailyROI: number;
  lastPayoutTimestamp: number;
  timestamp: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  depositAddress: string;
  investmentBalance: number;
  investments: Investment[];
  referralCount: number;
  totalEarnings: number;
  totalDeposited: number; // Tracked for loan unlock
  isAgent: boolean;       // Agent status
  hasActiveLoan: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'roi' | 'trade_win' | 'trade_loss' | 'loan' | 'agent_payout';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  txHash: string;
  timestamp: string;
}

const STORAGE_KEY_USERS = 'vesta_pro_users_v5';
const STORAGE_KEY_TXS = 'vesta_pro_transactions_v5';

export const TRON_DEPOSIT_ADDRESS = "TNq9vFuTM3dMHpnR5NUAuPRtb19CW4aFXx";

const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEY_USERS);
  return data ? JSON.parse(data) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
};

const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(STORAGE_KEY_TXS);
  return data ? JSON.parse(data) : [];
};

const saveTransactions = (txs: Transaction[]) => {
  localStorage.setItem(STORAGE_KEY_TXS, JSON.stringify(txs));
};

export const mockBackend = {
  register: async (email: string, password: string, confirmPassword: string, botCheckAnswer: string, expectedAnswer: string): Promise<{ user: User; message: string }> => {
    if (password !== confirmPassword) throw new Error('Passwords do not match');
    if (botCheckAnswer !== expectedAnswer) throw new Error('Bot verification failed');
    
    const users = getUsers();
    if (users.find((u) => u.email === email)) throw new Error('This email is already registered');

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      passwordHash: password,
      depositAddress: TRON_DEPOSIT_ADDRESS,
      investmentBalance: 0,
      investments: [],
      referralCount: 0,
      totalEarnings: 0,
      totalDeposited: 0,
      isAgent: false,
      hasActiveLoan: false
    };

    saveUsers([...users, newUser]);
    return { user: newUser, message: 'Account secured successfully' };
  },

  login: async (email: string, password: string): Promise<{ user: User; message: string }> => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.passwordHash === password);
    if (!user) throw new Error('Invalid credentials');
    return { user, message: 'Terminal access granted' };
  },

  resetPassword: async (email: string, newPassword: string, retypedPassword: string): Promise<{ message: string }> => {
    if (newPassword !== retypedPassword) throw new Error('Passwords do not match');
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex === -1) throw new Error('User not found');

    users[userIndex].passwordHash = retypedPassword;
    saveUsers(users);
    return { message: 'Security credentials updated successfully' };
  },

  processDailyReturns: async (userId: string): Promise<{ added: number; message: string }> => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return { added: 0, message: "" };

    const user = users[userIndex];
    const now = Date.now();
    const INTERVAL_MS = 23 * 60 * 60 * 1000;

    let totalPayout = 0;
    let hasUpdates = false;

    user.investments = (user.investments || []).map(inv => {
      // If investment goal already reached, skip
      if (inv.earnedSoFar >= inv.targetReturn) return inv;

      const lastPayout = inv.lastPayoutTimestamp || new Date(inv.timestamp).getTime();
      const timePassed = now - lastPayout;
      const cyclesToPay = Math.floor(timePassed / INTERVAL_MS);

      if (cyclesToPay > 0) {
        // Updated yield: 100% per 23h
        const roiMultiplier = (inv.dailyROI || 100) / 100;
        const rawPayout = (inv.amount * roiMultiplier) * cyclesToPay;
        const remainingCap = inv.targetReturn - inv.earnedSoFar;
        const actualPayout = Math.min(rawPayout, remainingCap);

        if (actualPayout > 0) {
          totalPayout += actualPayout;
          inv.earnedSoFar += actualPayout;
          inv.lastPayoutTimestamp = lastPayout + (cyclesToPay * INTERVAL_MS);
          hasUpdates = true;
        }
      }
      return inv;
    });

    if (hasUpdates) {
      user.investmentBalance += totalPayout;
      user.totalEarnings += totalPayout;
      users[userIndex] = user;
      saveUsers(users);

      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        type: 'roi',
        amount: totalPayout,
        status: 'completed',
        txHash: 'INTERNAL_QUANT_HARVEST',
        timestamp: new Date().toISOString(),
      };

      saveTransactions([newTx, ...getTransactions()]);
      return { added: totalPayout, message: `Algorithmic Yield Harvested: +$${totalPayout.toFixed(2)}` };
    }

    return { added: 0, message: "" };
  },

  syncDeposit: async (userId: string): Promise<{ message: string }> => {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error("Terminal node not found");
    
    if (user.investmentBalance < 200 && user.totalDeposited < 200) {
      throw new Error("Threshold Not Met: Minimum $200 total capital required for auto-sync.");
    }
    
    return { message: "Terminal synchronization complete. Ledger updated." };
  },

  confirmDepositWithScreenshot: async (userId: string, file: File, userAmount: number, isAgentFee = false): Promise<{ amount: number; message: string }> => {
    if (!file) throw new Error("Payment proof photo is required.");

    const users = getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');

    const user = users[userIndex];
    
    // AI simulation check
    const match = Math.random() > 0.01;
    if (!match) throw new Error("Verification failed: Amount in picture does not match entered data.");

    if (isAgentFee) {
      if (userAmount !== 700) throw new Error("Agent status requires a specific $700 deposit.");
      user.isAgent = true;
      user.totalDeposited += userAmount;
      users[userIndex] = user;
      saveUsers(users);

      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        type: 'deposit',
        amount: userAmount,
        status: 'completed',
        txHash: 'AGENT_UPGRADE_REF',
        timestamp: new Date().toISOString(),
      };
      saveTransactions([newTx, ...getTransactions()]);
      return { amount: userAmount, message: "Agent status activated successfully!" };
    }

    const deposited = userAmount;
    user.investmentBalance += deposited;
    user.totalDeposited += deposited;
    users[userIndex] = user;
    saveUsers(users);

    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      type: 'deposit',
      amount: deposited,
      status: 'completed',
      txHash: '0x' + Math.random().toString(16).substr(2, 64),
      timestamp: new Date().toISOString(),
    };

    saveTransactions([newTx, ...getTransactions()]);
    return { amount: deposited, message: `Deposit confirmed: $${deposited} added to terminal balance.` };
  },

  invest: async (userId: string, assetName: string, assetType: 'crypto' | 'stock', amount: number): Promise<{ message: string }> => {
    const users = getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');

    const user = users[userIndex];
    if (user.investmentBalance < amount) throw new Error('Insufficient capital');
    if (amount < 200) throw new Error('Minimum entry $200');

    // Updated Target Return: 1000% (10x) of investment
    const targetReturn = amount * 10;

    const newInvestment: Investment = {
      id: Math.random().toString(36).substr(2, 9),
      assetName,
      assetType,
      amount,
      targetReturn,
      earnedSoFar: 0,
      dailyROI: 100, // 100% of investment every 23 hours
      lastPayoutTimestamp: Date.now(),
      timestamp: new Date().toISOString(),
    };

    user.investmentBalance -= amount;
    user.investments.push(newInvestment);
    users[userIndex] = user;
    saveUsers(users);

    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      type: 'investment',
      amount,
      status: 'completed',
      txHash: 'INTERNAL_NODE_DEPLOY',
      timestamp: new Date().toISOString(),
    };

    saveTransactions([newTx, ...getTransactions()]);
    return { message: `Capital deployed to ${assetName} at 100% Daily Yield. Target Return: 1000%` };
  },

  placeTrade: async (userId: string, direction: 'up' | 'down', amount: number): Promise<{ win: boolean; message: string }> => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");

    const user = users[userIndex];
    if (user.investmentBalance < amount) throw new Error("Insufficient balance to trade.");
    if (amount < 200) throw new Error("Minimum trade stake is $200.");

    const win = Math.random() > 0.45; // 55% win rate simulation
    let message = "";

    if (win) {
      const profit = amount; // Net win 1x stake (Total return 2x)
      user.investmentBalance += profit;
      message = `Trade SUCCESS! Prediction correct. +$${profit} added to balance.`;
      
      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        type: 'trade_win',
        amount: profit,
        status: 'completed',
        txHash: 'BINARY_TRADE_EXEC',
        timestamp: new Date().toISOString(),
      };
      saveTransactions([newTx, ...getTransactions()]);
    } else {
      user.investmentBalance -= amount;
      message = `Trade LOSS. Market moved against your prediction. -$${amount} debited.`;
      
      const newTx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        type: 'trade_loss',
        amount: amount,
        status: 'completed',
        txHash: 'BINARY_TRADE_EXEC',
        timestamp: new Date().toISOString(),
      };
      saveTransactions([newTx, ...getTransactions()]);
    }

    users[userIndex] = user;
    saveUsers(users);
    return { win, message };
  },

  requestLoan: async (userId: string): Promise<{ message: string }> => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");

    const user = users[userIndex];
    if (user.totalDeposited < 5000) throw new Error("Loan eligibility not met. Deposit at least $5000 to unlock.");
    if (user.hasActiveLoan) throw new Error("Active loan already exists on this terminal.");

    const loanAmount = 87500;
    user.investmentBalance += loanAmount;
    user.hasActiveLoan = true;
    users[userIndex] = user;
    saveUsers(users);

    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      type: 'loan',
      amount: loanAmount,
      status: 'completed',
      txHash: 'PROTOCOL_LOAN_DISBURSE',
      timestamp: new Date().toISOString(),
    };
    saveTransactions([newTx, ...getTransactions()]);

    return { message: `Loan Approved! $${loanAmount} credited to your operational balance.` };
  },

  withdraw: async (userId: string, destination: string, amount: number): Promise<{ txHash: string }> => {
    const users = getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');

    const user = users[userIndex];
    if (user.investmentBalance < amount) throw new Error('Insufficient balance');

    user.investmentBalance -= amount;
    users[userIndex] = user;
    saveUsers(users);

    const hash = '0x' + Math.random().toString(16).substr(2, 64);
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      type: 'withdrawal',
      amount,
      status: 'completed',
      txHash: hash,
      timestamp: new Date().toISOString(),
    };

    saveTransactions([newTx, ...getTransactions()]);
    return { txHash: hash };
  },

  getTransactions: async (userId: string): Promise<Transaction[]> => {
    return getTransactions().filter((tx) => tx.userId === userId);
  },

  getUser: async (userId: string): Promise<User | null> => {
    const users = getUsers();
    return users.find((u) => u.id === userId) || null;
  }
};