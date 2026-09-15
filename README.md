# Momotombo Travels

🌋 Discover Nicaragua with AI-powered travel planning

## Overview

Momotombo Travels is a modern travel platform that helps travelers discover and plan trips to Nicaragua. Built with Next.js 16, NestJS 11, and powered by Google Gemini AI, it offers personalized itineraries, destination discovery, and seamless booking.

## Features

- 🤖 **AI-Powered Planning**: Generate personalized itineraries with Gemini AI
- 🗺️ **Destination Discovery**: Explore destinations with rich media and reviews
- 📅 **Itinerary Management**: Plan, share, and fork itineraries
- 💳 **Booking System**: Seamless Stripe integration for payments
- ⭐ **Reviews & Ratings**: Community-driven destination reviews
- 📝 **Blog**: Travel stories and guides
- 🎫 **Coupons & Promotions**: Discount codes and promotions
- 🔍 **Global Search**: Search across destinations, blogs, and activities
- 👥 **Admin Dashboard**: Content moderation and user management
- 🌐 **Multi-language**: Spanish and English support
- 📊 **Monitoring**: Prometheus metrics, Sentry error tracking, structured logging

## Tech Stack

### Client
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind v4
- **State**: React hooks + Context
- **i18n**: react-i18next
- **Testing**: Vitest + Testing Library + Playwright
- **Error Tracking**: Sentry

### Server
- **Framework**: NestJS 11
- **Database**: PostgreSQL + Prisma 7
- **Auth**: JWT + Passport + Google OAuth
- **AI**: Google Gemini + Pinecone (vector search)
- **Payments**: Stripe
- **Logging**: Pino (structured)
- **Metrics**: Prometheus
- **Testing**: Jest + Supertest

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm 10+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/momotombo-travels.git
cd momotombo-travels
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Server
cp apps/server/.env.example apps/server/.env
# Edit apps/server/.env with your values

# Client
cp apps/client/.env.example apps/client/.env.local
# Edit apps/client/.env.local with your values
```

4. Set up the database:
```bash
cd apps/server
npx prisma migrate dev
npx prisma db seed
```

5. Start development servers:
```bash
# From root directory
npm run dev:server  # Server on http://localhost:3001
npm run dev:client  # Client on http://localhost:3000
```

## Development

### Available Scripts

```bash
# Root
npm run dev:client    # Start client dev server
npm run dev:server    # Start server dev server
npm run build         # Build both apps
npm run lint          # Lint both apps

# Client
npm run test          # Run unit tests (Vitest)
npm run test:e2e      # Run E2E tests (Playwright)
npm run analyze       # Analyze bundle size

# Server
npm run test          # Run unit tests (Jest)
npm run test:e2e      # Run E2E tests
```

### Code Quality

- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Pre-commit Hooks**: Husky + lint-staged
- **Commit Messages**: Conventional Commits

## Testing

### Unit Tests
```bash
# Client
cd apps/client
npm run test

# Server
cd apps/server
npm run test
```

### E2E Tests
```bash
cd apps/client
npm run test:e2e
```

## Deployment

### CI/CD
GitHub Actions automatically:
1. Runs lint and tests on every push/PR
2. Builds both apps
3. Deploys to Cloud Run on main branch

### Manual Deployment
```bash
# Build
npm run build

# Deploy (requires gcloud CLI)
./deploy.ps1
```

## Documentation

- [Architecture](./ARCHITECTURE.md) - System architecture and design decisions
- [Changelog](./CHANGELOG.md) - Version history and changes
- [AGENTS.md](./AGENTS.md) - AI assistant guidelines

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Maintenance tasks

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [NestJS](https://nestjs.com/)
- AI powered by [Google Gemini](https://ai.google.dev/)
- Payments by [Stripe](https://stripe.com/)
- Deployed on [Google Cloud](https://cloud.google.com/)

## Contact

- Website: https://momotombo.travel
- Email: hello@momotombo.travel
- Twitter: @momotombotravel

---

Made with ❤️ in Nicaragua 🇳🇮
