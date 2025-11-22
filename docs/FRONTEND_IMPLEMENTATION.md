# Frontend Implementation Guide
## React + TypeScript Application

This document explains the frontend architecture and how to implement new features.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Technology Stack](#technology-stack)
3. [Getting Started](#getting-started)
4. [Architecture Overview](#architecture-overview)
5. [Adding New Features](#adding-new-features)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Styling Guide](#styling-guide)
9. [Best Practices](#best-practices)

---

## Project Structure

```
frontend/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── common/       # Common UI components (Button, Input, etc.)
│   │   └── layout/       # Layout components (Header, Sidebar, etc.)
│   ├── pages/            # Page components
│   │   ├── auth/         # Authentication pages
│   │   ├── shipments/    # Shipment pages
│   │   ├── customers/    # Customer pages
│   │   ├── documents/    # Document pages
│   │   └── users/        # User management pages
│   ├── services/         # API service layer
│   │   └── api.ts        # API client and methods
│   ├── store/            # State management (Zustand)
│   │   └── authStore.ts  # Authentication state
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts      # All application types
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── lib/              # Third-party library configurations
│   │   └── utils.ts      # Utility functions (cn, formatDate, etc.)
│   ├── App.tsx           # Main app component with routing
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── .env.example          # Environment variables template
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

---

## Technology Stack

### Core Libraries

- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool (faster than Create React App)
- **React Router v6**: Client-side routing
- **TanStack Query (React Query)**: Server state management
- **Zustand**: Client state management
- **Axios**: HTTP client
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Hot Toast**: Toast notifications
- **date-fns**: Date manipulation

---

## Getting Started

### Installation

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run type-check # Run TypeScript compiler check
```

---

## Architecture Overview

### Routing

The app uses React Router v6 with protected routes:

```tsx
// App.tsx
<Routes>
  {/* Public routes */}
  <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

  {/* Protected routes */}
  <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
    <Route path="/" element={<DashboardPage />} />
    <Route path="/shipments" element={<ShipmentsPage />} />
    {/* ... more routes */}
  </Route>
</Routes>
```

### Authentication Flow

1. User enters credentials on Login page
2. `authStore.login()` sends request to backend
3. Backend returns JWT tokens
4. Tokens stored in localStorage
5. Axios interceptor adds token to all requests
6. If token expires, interceptor refreshes it automatically
7. If refresh fails, user is redirected to login

### Data Fetching Pattern

Using TanStack Query for server state:

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['shipments'],
  queryFn: () => shipmentsAPI.getAll(),
})
```

Benefits:
- Automatic caching
- Background refetching
- Loading and error states
- Optimistic updates

---

## Adding New Features

### Creating a New Page

**1. Create the page component:**

```tsx
// src/pages/reports/ReportsPage.tsx
import { useState } from 'react'
import Button from '@/components/common/Button'

const ReportsPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
      {/* Page content */}
    </div>
  )
}

export default ReportsPage
```

**2. Add route in App.tsx:**

```tsx
import ReportsPage from '@/pages/reports/ReportsPage'

// Inside the protected routes
<Route path="/reports" element={<ReportsPage />} />
```

**3. Add navigation link in MainLayout:**

```tsx
const navigation = [
  // ... existing items
  { name: 'Reports', href: '/reports', icon: FileText },
]
```

### Adding API Endpoints

**1. Define types in `src/types/index.ts`:**

```typescript
export interface Report {
  id: string
  name: string
  type: string
  created_at: string
}
```

**2. Add API methods in `src/services/api.ts`:**

```typescript
export const reportsAPI = {
  getAll: async (): Promise<Report[]> => {
    const response = await api.get<Report[]>('/reports')
    return response.data
  },

  generate: async (type: string): Promise<Report> => {
    const response = await api.post<Report>('/reports/generate', { type })
    return response.data
  },
}
```

**3. Use in component with React Query:**

```tsx
const { data: reports } = useQuery({
  queryKey: ['reports'],
  queryFn: () => reportsAPI.getAll(),
})
```

### Creating Reusable Components

**1. Create component file:**

```tsx
// src/components/common/Card.tsx
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  title?: string
  children: ReactNode
  className?: string
}

const Card = ({ title, children, className }: CardProps) => {
  return (
    <div className={cn('rounded-lg bg-white p-6 shadow-md', className)}>
      {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}
      {children}
    </div>
  )
}

export default Card
```

**2. Use the component:**

```tsx
import Card from '@/components/common/Card'

<Card title="Shipment Details">
  <p>Content goes here</p>
</Card>
```

---

## State Management

### Authentication State (Zustand)

Located in `src/store/authStore.ts`:

```tsx
import { useAuthStore } from '@/store/authStore'

function Component() {
  const { user, isAuthenticated, login, logout } = useAuthStore()

  return (
    <div>
      <p>User: {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Creating New Store

```tsx
// src/store/uiStore.ts
import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
```

---

## API Integration

### Making API Calls

**GET Request:**

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['shipments', id],
  queryFn: () => shipmentsAPI.getById(id),
})
```

**POST/PUT Request (Mutation):**

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()

const createMutation = useMutation({
  mutationFn: (data) => shipmentsAPI.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['shipments'] })
    toast.success('Shipment created!')
  },
  onError: (error) => {
    toast.error('Failed to create shipment')
  },
})

// In component
const handleSubmit = (data) => {
  createMutation.mutate(data)
}
```

**DELETE Request:**

```tsx
const deleteMutation = useMutation({
  mutationFn: (id) => shipmentsAPI.delete(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['shipments'] })
    toast.success('Deleted successfully!')
  },
})
```

---

## Styling Guide

### Using Tailwind CSS

**Basic Example:**

```tsx
<div className="flex items-center justify-between rounded-lg bg-white p-6 shadow-md">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
  <Button className="bg-blue-500 hover:bg-blue-600">Click</Button>
</div>
```

**Responsive Design:**

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
  {/* Items */}
</div>
```

**Conditional Classes:**

```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  isDisabled && 'disabled-classes'
)}>
  Content
</div>
```

### CSS Variables

Defined in `src/index.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  /* ... */
}
```

Use in Tailwind:

```tsx
<div className="bg-primary text-primary-foreground">Content</div>
```

---

## Best Practices

### Component Structure

```tsx
/**
 * Component description
 */
import { useState } from 'react'
import type { ComponentProps } from '@/types'

interface Props {
  title: string
  onAction: () => void
}

const MyComponent = ({ title, onAction }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    // Logic
    onAction()
  }

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  )
}

export default MyComponent
```

### TypeScript

**Always define types:**

```tsx
// ✅ Good
interface User {
  id: string
  name: string
}

const user: User = { id: '1', name: 'John' }

// ❌ Bad
const user: any = { id: '1', name: 'John' }
```

**Use type inference:**

```tsx
// ✅ Good
const [count, setCount] = useState(0) // inferred as number

// ❌ Bad (unnecessary)
const [count, setCount] = useState<number>(0)
```

### Error Handling

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
})

if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />

return <DataDisplay data={data} />
```

### Forms with Validation

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormData = z.infer<typeof schema>

const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Submit</button>
    </form>
  )
}
```

### Code Organization

**File naming:**
- Components: PascalCase (e.g., `ShipmentCard.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Types: index.ts in types folder

**Import ordering:**
1. React imports
2. Third-party libraries
3. Internal components
4. Internal utilities
5. Types
6. Styles

```tsx
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Button from '@/components/common/Button'
import { formatDate } from '@/lib/utils'
import type { Shipment } from '@/types'
import './styles.css'
```

---

## Performance Optimization

### Lazy Loading

```tsx
import { lazy, Suspense } from 'react'

const ReportsPage = lazy(() => import('@/pages/reports/ReportsPage'))

<Suspense fallback={<LoadingSpinner />}>
  <ReportsPage />
</Suspense>
```

### Memoization

```tsx
import { useMemo, useCallback } from 'react'

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])

const handleClick = useCallback(() => {
  // Handler logic
}, [dependency])
```

### React Query Configuration

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
```

---

## Testing

### Unit Tests (Coming Soon)

```bash
npm run test
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

---

## Troubleshooting

### Common Issues

**1. Module not found:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. TypeScript errors:**
```bash
# Restart TS server in VS Code
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

**3. Tailwind classes not working:**
```bash
# Make sure content paths are correct in tailwind.config.js
# Restart dev server
```

---

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Happy Coding! 🚀**
