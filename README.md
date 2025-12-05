# Retab Widgets Demo

A Next.js demo application showcasing all [Retab](https://retab.com) React widgets for document extraction workflows.

## Features

- Interactive widget browser with accordion navigation
- Live preview of all 6 Retab widget components:
  - **DataComponent** - Display/edit extracted data (form, table, code views)
  - **FileComponent** - Document preview with PDF rendering
  - **ExtractionsList** - Browse extractions with search and filters
  - **ExtractionReviewer** - Complete human-in-the-loop review interface
  - **ExtractionComponent** - Side-by-side file and data view
  - **UploadJobsList** - Upload files and track processing

## Setup

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in your Retab credentials:

```env
# Server-side only (get from https://retab.com/dashboard/settings)
RETAB_API_KEY=sk_retab_xxx

# Client-side
NEXT_PUBLIC_RETAB_PROJECT_ID=proj_xxx
NEXT_PUBLIC_RETAB_BASE_URL=https://api.retab.com
```

### 3. Run the development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the widgets demo.

## Project Structure

```
app/
├── api/retab/token/route.ts   # Token endpoint for auth
├── providers.tsx              # RetabProvider (client-side)
├── layout.tsx                 # Root layout (server-side)
├── page.tsx                   # Widgets demo page
└── globals.css
```

## Documentation

- [Widgets Introduction](https://docs.retab.com/widgets/introduction)
- [Widgets Reference](https://docs.retab.com/widgets/widgets)
- [Hooks Reference](https://docs.retab.com/widgets/hooks)
- [Next.js Quickstart](https://docs.retab.com/widgets/nextjs_quickstart)
