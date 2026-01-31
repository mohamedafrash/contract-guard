# Contract Guard 🧾

A simple tool to review residential real estate contracts. Upload executed PDFs, let the AI extract the key details, run a compliance checklist, and draft a deficiency email instantly.

## How it works
Built with **Next.js 16** and **Tailwind 4**. For AI, it uses the **Vercel AI SDK** with **OpenAI GPT‑5 Nano** through the **Vercel AI Gateway**.

It’s multimodal, so the model reads your PDF pages to find signatures, dates, addenda, and disclosures.

## Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/mohamedafrash/contract-guard.git
   cd contract-guard
   pnpm install
   ```

2. **Environment**
   Create `.env.local` and add your key:
   ```bash
   AI_GATEWAY_API_KEY=your_key_here
   # or
   OPENAI_API_KEY=your_key_here

   # optional (defaults to Vercel AI Gateway)
   AI_GATEWAY_BASE_URL=https://ai-gateway.vercel.sh/v1
   ```

3. **Run**
   ```bash
   pnpm dev
   ```

## Key bits
- **PDF Upload:** Multiple contract files per review.
- **Summary Extraction:** Address, parties, price, dates.
- **Compliance Checklist:** Present/Missing/Unclear/Not Applicable.
- **Email Draft:** Only missing or unclear items.
- **Copy to Clipboard:** One-click ready to send.

Feel free to fork it, tweak the checklist in `app/api/analyze/route.ts`, or use it as a starting point for your own AI workflows.

## License
MIT. See the [LICENSE](LICENSE) file for details.
