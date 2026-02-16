# Contract Guard 🧾

A simple tool to review residential real estate contracts. Upload executed PDFs, let the AI extract the key details, run a compliance checklist, and draft a deficiency email instantly.

## How it works

Built with **Next.js 16** and **Tailwind 4**. For AI, it uses the **Vercel AI SDK** with **OpenAI GPT‑5 Nano** through the **Vercel AI Gateway**. Authentication is handled by **Clerk**, and analysis history is stored in **Convex**.

It’s multimodal, so the model reads your PDF pages to find signatures, dates, addenda, and disclosures.

## Quick Start

1. **Clone & Install**

   ```bash
   git clone https://github.com/mohamedafrash/contract-guard.git
   cd contract-guard
   pnpm install
   ```

2. **Environment**
   Create `.env.local` and add your keys:

   ```bash
   AI_GATEWAY_API_KEY=your_key_here
   # or
   OPENAI_API_KEY=your_key_here

   # optional (defaults to Vercel AI Gateway)
   AI_GATEWAY_BASE_URL=https://ai-gateway.vercel.sh/v1

   # Convex (https://dashboard.convex.dev)
   NEXT_PUBLIC_CONVEX_URL=https://your-project-name.convex.cloud
   CONVEX_ADMIN_KEY=your_convex_admin_key_here

   # Clerk Authentication (https://dashboard.clerk.com)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   ```

3. **Start Convex**
   ```bash
   pnpm convex dev
   ```

4. **Run**
   ```bash
   pnpm dev
   ```

## Key bits

- **Authentication:** Clerk-powered sign-in/sign-up with dark mode support.
- **PDF Upload:** Multiple contract files per review.
- **Summary Extraction:** Address, parties, price, dates.
- **Compliance Checklist:** Present/Missing/Unclear/Not Applicable.
- **Email Draft:** Only missing or unclear items.
- **Copy to Clipboard:** One-click ready to send.
- **Review History:** Each user can open their previous generated analyses.

Feel free to fork it, tweak the checklist in `app/api/analyze/route.ts`, or use it as a starting point for your own AI workflows.

## License

MIT. See the [LICENSE](LICENSE) file for details.
