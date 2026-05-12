# Invoice Creator

A standalone HTML/JS web application for creating legal investigation invoices with AI-powered analysis, Google Sheets sync, and PDF import.

## Features

- **Data Import**: Paste spreadsheet data or drop a PAE PDF to auto-fill invoice fields
- **TLI Field Log Support**: Parse 16-column tab-separated TLI logs directly
- **Automatic Totals**: Calculates hours (pre/post rate cutoff), mileage (2025/2026 rates), expenses, and grand total
- **Hours Overage Warning**: Highlights when billed hours exceed authorized hours
- **AI Analysis**: Integrates with multiple AI providers (OpenAI, Anthropic Claude, Google Gemini, DeepSeek, Grok, Perplexity, or custom endpoints) to audit invoices for patterns and errors
- **Google Sheets Sync**: Push/pull invoice data via a Google Apps Script webhook
- **JSON Export/Import**: Backup and restore invoice state locally
- **Name Anonymization**: Optional client/investigator name-to-code mapping for privacy

## Deploy to GitHub Pages

1. **Create a new repository** on GitHub (public or private)
2. **Push the files**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/invoice-creator.git
   git branch -M main
   git push -u origin main
   ```
3. **Enable GitHub Pages**:
   - Settings → Pages → Build and deployment
   - Source: Deploy from a branch → `main` / `(root)`
   - Click Save
4. **Access** at: `https://YOUR_USERNAME.github.io/invoice-creator/`

## Local Development

Open `index.html` directly in a browser works for most features, but **AI analysis requires serving over HTTPS or localhost** due to CORS restrictions.

To run locally with AI enabled:
```bash
# Python
python -m http.server 8000

# or Node.js
npx http-server
```

Then visit `http://localhost:8000`.

## Configuration

Click the ⚙️ Settings button to configure:

- **AI Provider & Model**: Choose from Gemini, GPT-4, Claude, Grok, DeepSeek, Perplexity, or custom OpenAI-compatible endpoint
- **AI API Key**: Your provider's API key
- **AI Instructions**: Custom system prompt for invoice analysis (default provided)
- **Temperature / Max Tokens**: Generation parameters
- **Google Sheets Webhook URL**: Endpoint for syncing (requires Google Apps Script deployment)

Settings are saved to browser localStorage automatically.

## File Structure

```
├── index.html              # Main app (all-in-one HTML/CSS/JS)
├── google_apps_script.gs   # Google Apps Script backend for Sheets sync
└── logo.jpg                # Company logo (optional, falls back to SVG)
```

### Google Sheets Integration

Deploy `google_apps_script.gs` as a Google Apps Script Web App:
1. Open script.google.com → New project
2. Paste code and save
3. Deploy → Web app
   - Execute as: Me
   - Who has access: Anyone (or Anyone with Google account)
4. Copy the Web App URL into the app's Settings

The script stores invoice data per invoice number in the script's Properties service.

## AI Analysis

The AI feature sends the current invoice state (header fields + all line items) to the configured model with a system prompt to:
- Summarize totals per case
- Spot potential billing errors
- Flag unusual mileage entries

**Note**: When running from `file://` protocol, the browser blocks AI `fetch()` calls due to CORS. Use a local server or deploy to GitHub Pages to enable this feature.

## Usage Tips

- **PAE PDF Drop**: Drag a PAE PDF onto the paste area → clears existing invoice and populates header fields
- **TLI Paste**: Copy a TLI Field Log (16 columns) and paste into the textarea → auto-detects and imports hours/mileage/expenses
- **Append Mode**: If invoice already has data, you'll be asked before adding more
- **Print**: Standard browser print dialog (styled for invoice layout)
- **Clear Form**: Wipes all data and restarts fresh
- **Auto-save**: Every change is saved to browser localStorage

## Rates & Cutoff Dates

Current rates (editable in `CONFIG` block of `index.html`):
- Early hours (before Aug 1, 2025): $55/hr
- Late hours (on/after Aug 1, 2025): $59/hr
- Mileage 2025: $0.70/mi
- Mileage 2026: $0.725/mi
- B&W copies: $0.20 each
- Color copies: $1.00 each

## License

MIT — free to use, modify, and distribute.
