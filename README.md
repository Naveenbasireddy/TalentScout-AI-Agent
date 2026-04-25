# TalentScout AI Agent

TalentScout AI Agent is a React + TypeScript application that helps hiring teams:
- parse a job description,
- match candidates from CSV,
- run outreach workflow,
- and generate a ranked shortlist using transparent scoring.

## Live Prototype

- Deploy URL: _Add after deployment_ (example: Vercel/Netlify URL)
- Local URL (development): `http://localhost:5173`

## Features

- JD parsing for role, skills, and experience
- CSV candidate upload with robust skill parsing
- Candidate matching with canonical skill normalization
- Outreach workflow with:
  - email extraction from CSV (`Email` column),
  - one-click `mailto` outreach,
  - manual response capture (`Interested / Maybe / Not Interested / No Response`)
- Final ranking based on weighted scoring dimensions:
  - Skills: 40%
  - Experience: 25%
  - Availability: 15%
  - Interest: 20%

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Browser `localStorage` for lightweight persistence

## Project Structure

- `src/agents` - parsing, matching, outreach logic
- `src/components` - UI steps and panels
- `src/lib` - CSV parsing, scoring, export utilities
- `docs` - architecture and demo docs
- `samples` - sample CSV inputs

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm 9+

### 1) Install dependencies

```bash
npm install
```

### 2) Run app

```bash
npm run dev
```

### 3) Build and typecheck

```bash
npm run typecheck
npm run build
```

## CSV Format

Expected columns:

`Name,Email,Skills,Experience,Location,Availability`

Examples are provided in:
- `samples/sample_candidates.csv`

## Scoring Logic

Detailed architecture + scoring documentation:
- `docs/ARCHITECTURE.md`

## Sample Input / Output

- Sample candidate input: `samples/sample_candidates.csv`
- Output: generated shortlist table in app UI + `Export CSV` file (`talentscout_results.csv`)

