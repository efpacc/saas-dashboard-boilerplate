# Dashboard Boilerplate

A modern, responsive dashboard boilerplate built with Next.js 15, Stack Auth, and Tailwind CSS. This template provides a consistent look and feel that can be adapted for any application.

## Features

- 🎨 **Modern UI Design** - Clean, professional dashboard layout
- 🔐 **Authentication Ready** - Integrated with Stack Auth for user management
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Fast Performance** - Built with Next.js 15 and optimized for speed
- 🎯 **Type Safe** - Full TypeScript support
- 🔧 **Highly Customizable** - Easy to adapt for any application

## Layout Structure

### Sidebar Navigation

- **Dashboard** - Main overview page
- **Projects** - Project management
- **Create** - Create new items/projects
- **Resources** - Templates and resources
- **Analytics** - Data and insights
- **Team** - Team collaboration
- **Settings** - Application settings
- **Help** - Help and support
- **Upgrade** - Premium features

### Header Components

- **Search Bar** - Global search functionality
- **Create Button** - Quick action CTA
- **Stats Indicators** - Live metrics display
- **Notifications** - Alert system
- **User Profile** - Stack Auth integration

### Dashboard Components

- **Hero Section** - Welcome banner with search
- **Stats Cards** - Key metrics display
- **Quick Actions** - Primary action shortcuts
- **Recent Activity** - Activity timeline

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd dashboard-boilerplate
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

4. Configure Stack Auth (if using authentication)

```bash
# Add your Stack Auth credentials to .env.local
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_client_key
STACK_SECRET_SERVER_KEY=your_secret_key
```

5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Customization

### 1. Update Branding

- Change the logo in `src/components/Sidebar.tsx`
- Update colors in `tailwind.config.ts`
- Modify the hero section text in `src/app/page.tsx`

### 2. Navigation Items

Edit the navigation arrays in:

- `src/components/Sidebar.tsx` - Sidebar navigation
- `src/components/Header.tsx` - Header navigation

### 3. Dashboard Content

Customize the dashboard data in `src/app/page.tsx`:

- `statsData` - Update metrics and values
- `quickActionsData` - Modify quick action items
- `recentActivities` - Change activity items

### 4. Page Content

Each page template is located in `src/app/[page]/page.tsx`:

- Replace placeholder content with your app-specific content
- Maintain the layout structure for consistency

## Components

### Reusable Components

#### `StatsCard`

Display key metrics with icons and trends.

```tsx
<StatsCard
  title="Total Users"
  value="1,234"
  icon={Users}
  iconColor="text-blue-600"
  iconBgColor="bg-blue-100"
  trend={{
    value: "+12.5%",
    isPositive: true,
    period: "vs last month",
  }}
/>
```

#### `QuickActions`

Configurable action buttons for common tasks.

```tsx
<QuickActions
  actions={[
    {
      title: "Create Project",
      description: "Start a new project",
      href: "/create",
      icon: Plus,
      iconColor: "bg-blue-500",
      bgColor: "bg-blue-50",
      hoverBgColor: "hover:bg-blue-100",
    },
  ]}
/>
```

#### `RecentActivity`

Display recent actions and events.

```tsx
<RecentActivity
  activities={[
    {
      id: "1",
      title: "Project created",
      time: "5 minutes ago",
      color: "bg-blue-500",
    },
  ]}
/>
```

## Authentication

This boilerplate uses Stack Auth for authentication. To set up:

1. Create a Stack Auth project at [stack-auth.com](https://stack-auth.com)
2. Add your credentials to environment variables
3. Users can sign in/up through the `/handler/sign-in` route
4. User data is automatically synced if you have a database configured

## Database Integration

The boilerplate includes Neon database integration. See the included database utilities in the project.

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

### Other Platforms

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 15
- **Authentication**: Stack Auth
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript
- **Database**: Neon (PostgreSQL)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues:

- Check the [documentation](docs/)
- Create an issue on GitHub
- Contact support

---

Built with ❤️ for developers who want to ship fast without compromising on quality.
