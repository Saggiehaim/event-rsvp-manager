# Event Hub

A beautiful event management application where you can create events, share event details, and manage RSVPs.

## Features

- 📅 Create and manage events with posters, dates, and locations
- 👥 Guest RSVP system with attendee count tracking
- 🗺️ Location support with Google Maps integration (optional)
- 📱 Fully responsive design
- 💾 Persistent data storage using Spark KV
- 🎨 Modern, minimalist UI with smooth animations

## Development

### Prerequisites
- Node.js 20 or higher
- npm

### Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Deployment to GitHub Pages

This application is ready to deploy to GitHub Pages. See [DEPLOY.md](./DEPLOY.md) for detailed instructions.

### Quick Deploy

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to the main branch.

**To enable automatic deployment:**

1. Go to your repository **Settings → Pages**
2. Under "Build and deployment", select **"GitHub Actions"** as the source
3. Push to the main branch - deployment happens automatically!

Your site will be available at: `https://<username>.github.io/<repository>/`

## Admin Access

Access the admin panel to manage all events at: `?page=shadmin` or `/shadmin`

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Framer Motion for animations
- GitHub Spark runtime (KV storage)

## License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
