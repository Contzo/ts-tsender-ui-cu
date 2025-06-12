TSender UI - Modern Token Airdrop Interface 🚀

This is a sleek, modern interface for sending token airdrops built with React and TypeScript. It improves upon the original Cyfrin implementation with better form handling, real-time notifications, and scientific notation support. Connect your wallet and start airdropping tokens in seconds!

What's Cool About This Version? ✨
Smart Form Handling: Uses react-hook-form for smooth form validation and error messages

Scientific Notation: Enter amounts like 1e18 instead of typing 18 zeros!

Real-time Updates: Get instant transaction updates with toast notifications

Clean Code: Contract interactions organized in service classes

Multi-chain Support: Works with any EVM chain (just add contract addresses)

Modern UI: Clean, responsive design that works on any device

How to Get Started 🚀
Clone the repo:

bash
git clone https://github.com/Contzo/ts-tsender-ui-cu.git
cd ts-tsender-ui-cu
Install packages:

bash
npm install

# or

yarn install
Start the dev server:

bash
npm run dev

# or

yarn dev
Open your browser to http://localhost:3000

How to Use It 📝
Connect your wallet (MetaMask works best)

Enter your token's contract address

Add recipient addresses (separate with commas or new lines)

Enter amounts in wei (use 1e18 for 1 token with 18 decimals)

Approve token spending (first transaction)

Send your airdrop (second transaction)

Tech Under the Hood ⚙️
Frontend: Next.js 14 (App Router)

Styling: Tailwind CSS

Forms: React Hook Form

Blockchain: Wagmi + Viem

Notifications: React Hot Toast

Testing: Vitest

Shutouts 🙌
Big thanks to:

The original Cyfrin TSender UI for inspiration

Patrick Collins for awesome Web3 content

The React community for amazing libraries
