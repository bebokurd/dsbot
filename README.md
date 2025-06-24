# Discord TikTok & YouTube Downloader Bot

A modern Discord bot built with Node.js and discord.js that allows users to download TikTok videos (no watermark) and YouTube videos via slash commands. Also includes a REST API for TikTok video info.

## Features
- `/tiktok <url>`: Download TikTok videos without watermark.
- `/youtube <url>`: Download YouTube videos (uploads to transfer.sh if too large).
- **REST API:** `/api/tiktok?url=VIDEO_URL` returns TikTok video info and direct download link.
- Rate limiting: 3 commands per minute per user and 3 API requests per minute per IP.
- Rich embed responses with video title and thumbnail.
- Error handling and logging.

## Setup

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env` and fill in your Discord bot token:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env`:
     ```
     DISCORD_TOKEN=your_discord_bot_token_here
     ```

4. **Run the TikTok API server**
   ```bash
   node api/server.js
   ```
   (Keep this running in a separate terminal)

5. **Run the Discord bot**
   ```bash
   npm run start
   # or for development with auto-reload
   npx nodemon index.js
   ```

## Usage
- Use `/tiktok <url>` to download TikTok videos without watermark.
- Use `/youtube <url>` to download YouTube videos.
- If the video is too large for Discord, a download link will be provided.
- Use the REST API: `GET /api/tiktok?url=VIDEO_URL` to get TikTok video info and download link.

## File Structure
- `commands/` - Slash command modules
- `utils/` - Utilities (rate limiter, logger, embed)
- `config/` - Configuration loader
- `api/` - Express API for TikTok video info

## Notes
- Max file size: 8MB (normal bots), 100MB (Nitro bots)
- All commands are logged to `bot.log`
- API is rate-limited to 3 requests/min per IP

## License
MIT 