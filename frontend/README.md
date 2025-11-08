# ReelByte Frontend

Modern, mesmerizing video-focused marketplace platform built with cutting-edge 2025 technologies.

## Tech Stack

- **React 19** - Latest React with Server Components support
- **TypeScript** - Type-safe development
- **Vite 6** - Lightning-fast build tool
- **Bun** - Ultra-fast JavaScript runtime and package manager
- **React Router v7** - Modern routing with data loading
- **TailwindCSS v3.4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Framer Motion 11+** - Smooth animations
- **TanStack Query v5** - Powerful data synchronization
- **Zustand** - Lightweight state management
- **Axios** - HTTP client
- **React Hook Form** - Form validation
- **Zod** - Schema validation

## Prerequisites

- [Bun](https://bun.sh) - Install via: `curl -fsSL https://bun.sh/install | bash`
- Node.js 18+ (optional, Bun can replace Node.js)

## Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws
```

### 3. Development Server

```bash
bun run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Lint code with ESLint |
| `bun run type-check` | TypeScript type checking |
| `bun run format` | Format code with Prettier |

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, icons, fonts
│   ├── components/     # React components
│   │   ├── ui/        # shadcn/ui components
│   │   ├── navigation/
│   │   ├── cards/
│   │   └── ...
│   ├── pages/          # Page components
│   ├── layouts/        # Layout components
│   ├── hooks/          # Custom hooks
│   ├── stores/         # Zustand stores
│   ├── lib/           # Utilities and libraries
│   ├── routes/        # Router configuration
│   ├── styles/        # Global styles
│   ├── types/         # TypeScript types
│   ├── App.tsx        # Root component
│   └── main.tsx       # Entry point
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── components.json     # shadcn/ui config
```

## Adding shadcn/ui Components

```bash
bunx shadcn-ui@latest add button
bunx shadcn-ui@latest add card
bunx shadcn-ui@latest add dialog
# ... and more
```

## Building for Production

```bash
bun run build
```

The optimized production build will be in the `dist/` directory.

### Preview Production Build

```bash
bun run preview
```

## Docker Support

### Build Docker Image

```bash
docker build -t reelbyte-frontend .
```

### Run Container

```bash
docker run -p 80:80 reelbyte-frontend
```

## Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

Format code before committing:

```bash
bun run format
bun run lint
```

## Performance Optimizations

- Code splitting with React.lazy()
- Route-based code splitting
- Image lazy loading
- Vendor chunk splitting
- Tree shaking
- Minification and compression

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

Proprietary - All rights reserved
