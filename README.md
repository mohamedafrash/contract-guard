# Contract Guard

Contract Guard is a web app that helps real estate teams review residential purchase agreements. Upload executed PDFs and it will extract key transaction details, check a compliance checklist, and draft a deficiency email for missing or unclear items.

## Features

- PDF upload with multiple files per review
- Transaction summary extraction (address, parties, price, dates)
- Compliance checklist with status and notes
- Automated deficiency email draft (only missing/unclear items)
- Copy-to-clipboard email output
- Simple, client-first UI with Tailwind styling

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Vercel AI SDK + AI Gateway (OpenAI GPT‑5 Nano)
- Zod for structured outputs
- Tailwind CSS
- TypeScript

## Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- pnpm

### Install

```bash
pnpm install
```

### Configure Environment

Create a `.env.local` file in the project root:

```bash
AI_GATEWAY_API_KEY=your_gateway_key
# or
OPENAI_API_KEY=your_openai_key

# Optional (defaults to Vercel AI Gateway)
AI_GATEWAY_BASE_URL=https://ai-gateway.vercel.sh/v1
```

### Run Dev Server

```bash
pnpm dev
```

Open http://localhost:3000

### Lint

```bash
pnpm lint
```

## How It Works

1. The client reads PDFs and sends them to `/api/analyze` as base64.
2. The API calls the AI model via the Vercel AI SDK.
3. The response is validated against a strict schema (Zod).
4. The UI renders the summary, checklist, and email draft.

## API

### `POST /api/analyze`

**Request**

```json
{
  "files": [
    { "base64": "<data>", "type": "application/pdf" }
  ]
}
```

**Response**

```json
{
  "summary": {
    "propertyAddress": "...",
    "buyerName": "...",
    "sellerName": "...",
    "purchasePrice": "...",
    "contractDate": "...",
    "closingDate": "..."
  },
  "checklist": [
    {
      "id": "...",
      "ruleName": "...",
      "description": "...",
      "status": "PRESENT | MISSING | UNCLEAR | NOT_APPLICABLE",
      "notes": "...",
      "pageReference": 5
    }
  ],
  "missingItemsEmailDraft": "..."
}
```

Notes:
- `pageReference` can be `null` when not applicable.
- The response is JSON-structured and validated before returning.

## Project Structure

```
app/
  api/analyze/route.ts        # AI analysis endpoint
  components/                 # UI components
  services/                   # Client-side API call
  types.ts                    # Shared types
public/                       # Static assets
```

## Contributing

Contributions are welcome. Please open an issue or PR with a clear description of the change.

Suggested workflow:

1. Fork the repo
2. Create a feature branch
3. Run `pnpm lint` before submitting

## Deployment

Recommended: Vercel

1. Set env vars in the Vercel dashboard
2. Deploy

## Disclaimer

This tool assists with document review but does not constitute legal advice. Always verify results manually.

## License

MIT. See the [LICENSE](LICENSE) file for details.
