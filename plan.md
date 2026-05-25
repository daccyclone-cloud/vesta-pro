# Crypto Investment Platform Implementation Plan

The objective is to build a functional crypto investment platform prototype. Since this environment does not support a live MongoDB or a remote Node.js backend with persistent state, we will implement a high-fidelity frontend simulation. The "backend" logic (wallets, balance tracking, and ledger) will be handled via client-side state and `localStorage` to ensure functionality within the constraints.

## Scope Summary
- **Frontend**: A modern, responsive React dashboard using Tailwind CSS and shadcn/ui.
- **Mock Backend**: A service layer that simulates the Express/Mongoose logic provided in the request.
- **Blockchain Integration**: Use `ethers.js` (client-side) to generate real Ethereum-compatible wallets and interact with public providers (if a key is available) or simulate transaction broadcasting.
- **Persistence**: User accounts, balances, and transaction history will persist in `localStorage`.

## Affected Areas
- `src/App.tsx`: Main application structure and routing.
- `src/lib/mock-backend.ts`: Implementation of the registration, sync-deposit, and withdrawal logic.
- `src/components/`: New components for Registration, Dashboard, and Transaction Ledger.
- `package.json`: Addition of `ethers` and `bcryptjs` (client-side compatible version) or similar hashing.

## Assumptions & Open Questions
- **Security**: Since this is a client-side simulation, private keys are stored in `localStorage` in plaintext or simple encryption. This is for **demonstration only**.
- **Provider**: Without a real Alchemy API key, we will simulate the "sync" process by checking a public explorer or just providing a mock "Success" state.

## Phase 1: Setup & Dependencies
- Install necessary packages: `ethers`, `lucide-react`, `clsx`, `tailwind-merge`.
- Define data schemas (Typescript interfaces) for Users and Transactions based on the requested Mongoose models.
- **Owner**: `frontend_engineer`

## Phase 2: Mock Backend & Storage Logic
- Create a `MockBackend` service in `src/lib/`.
- Implement `register()`: Generates a wallet using `ethers.Wallet.createRandom()`, hashes "password" (mock), and saves to `localStorage`.
- Implement `syncDeposit()`: Simulates checking the blockchain.
- Implement `withdraw()`: Deducts from mock balance and "broadcasts" a transaction (simulated).
- **Owner**: `frontend_engineer`

## Phase 3: UI Development - Authentication
- Build the "Create Account" card.
- Validation for email and password.
- Display the generated "Deposit Address" upon successful registration.
- **Owner**: `frontend_engineer`

## Phase 4: UI Development - Dashboard & Ledger
- Build the "Investment Dashboard".
- Components for:
    - Balance Display.
    - "Check & Sync" button with loading states.
    - Withdrawal form (Address, Amount).
    - Transaction History Table (Ledger).
- **Owner**: `frontend_engineer`

## Phase 5: Refinement & Quick Fixes
- Add toast notifications for success/error messages.
- Style refinements to match a "Terminal/Crypto" aesthetic.
- Final testing of the end-to-end flow (Register -> Deposit Sync -> Withdraw).
- **Owner**: `quick_fix_engineer`
