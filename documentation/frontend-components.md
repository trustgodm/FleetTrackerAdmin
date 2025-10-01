# Frontend Components Documentation

This document provides a comprehensive overview of all frontend components, pages, and UI elements in the FleetTracker-Admin system.

## 📁 Component Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── ActivityFeed.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── FleetChart.tsx
│   │   ├── Header.tsx
│   │   ├── MetricCard.tsx
│   │   ├── NotificationPanel.tsx
│   │   ├── Sidebar.tsx
│   │   └── VehicleList.tsx
│   └── ui/
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       └── tooltip.tsx
├── pages/
│   ├── Analytics.tsx
│   ├── Departments.tsx
│   ├── Fleet.tsx
│   ├── Fuel.tsx
│   ├── Help.tsx
│   ├── Index.tsx
│   ├── Maintenance.tsx
│   ├── NotFound.tsx
│   ├── Settings.tsx
│   └── Tracking.tsx
└── hooks/
    ├── use-mobile.tsx
    └── use-toast.ts
```

## 🎨 UI Components (Shadcn/ui)

### Core Components

#### Button Component
```typescript
import { Button } from "@/components/ui/button"

// Variants: default, destructive, outline, secondary, ghost, link
// Sizes: default, sm, lg, icon
<Button variant="default" size="default">
  Click me
</Button>
```

#### Card Components
```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

#### Input Components
```typescript
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>
```

#### Badge Component
```typescript
import { Badge } from "@/components/ui/badge"

// Variants: default, secondary, destructive, outline
<Badge variant="default">Active</Badge>
```

#### Tabs Component
```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account content</TabsContent>
  <TabsContent value="password">Password content</TabsContent>
</Tabs>
```

### Form Components

#### Form with Validation
```typescript
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"

const form = useForm({
  defaultValues: {
    name: "",
    email: "",
  },
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

#### Select Component
```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a department" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="gmo">GMO</SelectItem>
    <SelectItem value="north">North Shaft</SelectItem>
    <SelectItem value="main">Main Shaft</SelectItem>
  </SelectContent>
</Select>
```

### Data Display Components

#### Table Component
```typescript
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Vehicle ID</TableHead>
      <TableHead>Driver</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>TRP-001</TableCell>
      <TableCell>John Doe</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

#### Calendar Component
```typescript
import { Calendar } from "@/components/ui/calendar"

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-md border"
/>
```

### Navigation Components

#### Sidebar Component
```typescript
import { Sidebar } from "@/components/ui/sidebar"

<Sidebar>
  <SidebarHeader>
    <SidebarTitle>FleetTracker</SidebarTitle>
  </SidebarHeader>
  <SidebarContent>
    <SidebarMenu>
      <SidebarMenuItem href="/dashboard">Dashboard</SidebarMenuItem>
      <SidebarMenuItem href="/fleet">Fleet</SidebarMenuItem>
      <SidebarMenuItem href="/tracking">Tracking</SidebarMenuItem>
    </SidebarMenu>
  </SidebarContent>
</Sidebar>
```

## 📄 Page Components

### Dashboard Layout (DashboardLayout.tsx)

**Purpose**: Main layout wrapper for all dashboard pages

**Features**:
- Responsive sidebar navigation
- Header with user information
- Breadcrumb navigation
- Notification panel
- Mobile-responsive design

**Usage**:
```typescript
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"

export default function FleetPage() {
  return (
    <DashboardLayout>
      {/* Page content */}
    </DashboardLayout>
  )
}
```

### Dashboard (Index.tsx)

**Purpose**: Main dashboard with overview metrics and quick actions

**Components**:
- Fleet overview statistics
- Recent activity feed
- Quick action buttons
- Department summaries
- Fleet chart visualization

**Key Features**:
- Real-time metrics display
- Interactive charts
- Quick navigation to key functions
- Responsive grid layout

### Fleet Management (Fleet.tsx)

**Purpose**: Complete vehicle fleet management interface

**Components**:
- Vehicle inventory list
- Vehicle status management
- Add/edit vehicle forms
- Vehicle search and filtering
- Department vehicle assignments

**Key Features**:
- Vehicle CRUD operations
- Status change functionality
- QR code generation
- Photo upload support
- Department assignment

### Tracking (Tracking.tsx)

**Purpose**: Vehicle tracking and trip management

**Components**:
- Live map view (placeholder)
- Active vehicles list
- Trip history
- Geofence management
- Tracking reports

**Key Features**:
- Real-time vehicle tracking
- Trip management
- Route visualization
- Geofence monitoring
- Export functionality

### Maintenance (Maintenance.tsx)

**Purpose**: Vehicle maintenance scheduling and management

**Components**:
- Maintenance calendar
- Maintenance records
- Service due alerts
- Maintenance analytics
- Technician assignments

**Key Features**:
- Calendar-based scheduling
- Maintenance type management
- Due date tracking
- Cost analysis
- Service history

### Fuel Management (Fuel.tsx)

**Purpose**: Fuel consumption tracking and analysis

**Components**:
- Fuel consumption records
- Fuel station management
- Fuel analytics
- Consumption reports
- Efficiency metrics

**Key Features**:
- Fuel level tracking
- Consumption calculations
- Station inventory
- Cost analysis
- Efficiency reporting

### Analytics (Analytics.tsx)

**Purpose**: Comprehensive analytics and reporting

**Components**:
- Fleet performance metrics
- Department comparisons
- Maintenance analytics
- Trip analytics
- Cost analysis reports

**Key Features**:
- Interactive charts
- Performance metrics
- Trend analysis
- Export capabilities
- Real-time data

### Departments (Departments.tsx)

**Purpose**: Department management and organization

**Components**:
- Department overview
- Department vehicle assignments
- Department user management
- Department-specific analytics
- Department alerts

**Key Features**:
- Department CRUD operations
- Vehicle assignments
- User management
- Performance metrics
- Alert system

## 🎯 Dashboard Components

### Header Component (Header.tsx)

**Purpose**: Top navigation bar with user information

**Features**:
- User profile dropdown
- Notification bell
- Search functionality
- Breadcrumb navigation
- Mobile menu toggle

### Sidebar Component (Sidebar.tsx)

**Purpose**: Main navigation sidebar

**Features**:
- Navigation menu items
- Collapsible sections
- Active state indicators
- Mobile responsiveness
- User role-based menu items

### MetricCard Component (MetricCard.tsx)

**Purpose**: Reusable metric display card

**Features**:
- Icon support
- Value display
- Trend indicators
- Color coding
- Responsive design

### ActivityFeed Component (ActivityFeed.tsx)

**Purpose**: Recent activity display

**Features**:
- Real-time updates
- Activity categorization
- Time stamps
- User avatars
- Action buttons

### FleetChart Component (FleetChart.tsx)

**Purpose**: Fleet analytics visualization

**Features**:
- Interactive charts
- Multiple chart types
- Real-time data
- Export capabilities
- Responsive design

### VehicleList Component (VehicleList.tsx)

**Purpose**: Vehicle listing with actions

**Features**:
- Vehicle cards
- Status indicators
- Quick actions
- Search and filter
- Pagination

### NotificationPanel Component (NotificationPanel.tsx)

**Purpose**: Notification management

**Features**:
- Notification list
- Mark as read
- Notification types
- Time stamps
- Action buttons

## 🎨 Styling and Theming

### Tailwind CSS Configuration

**Custom Colors**:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}
```

### Custom CSS Classes

**Gradient Classes**:
```css
.bg-gradient-primary {
  background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%);
}

.shadow-glow {
  box-shadow: 0 0 20px hsl(var(--primary) / 0.3);
}

.shadow-elegant {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
- All components are mobile-responsive
- Touch-friendly interactions
- Optimized for small screens
- Collapsible navigation

### Responsive Utilities
```typescript
// Mobile detection hook
import { useMobile } from "@/hooks/use-mobile"

const isMobile = useMobile()

// Conditional rendering
{!isMobile && <DesktopOnlyComponent />}
```

## 🔧 Component Patterns

### Form Pattern
```typescript
const FormComponent = () => {
  const form = useForm({
    defaultValues: {
      // form fields
    },
  })

  const onSubmit = (data) => {
    // handle submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* form fields */}
      </form>
    </Form>
  )
}
```

### Data Fetching Pattern
```typescript
const DataComponent = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <Skeleton />
  if (error) return <Alert>{error}</Alert>

  return (
    <div>
      {/* render data */}
    </div>
  )
}
```

### Modal Pattern
```typescript
const ModalComponent = () => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Open Modal</Button>
      </DialogTrigger>
      <DialogContent>
        {/* modal content */}
      </DialogContent>
    </Dialog>
  )
}
```

## 🎨 Design System

### Typography
- **Headings**: Inter font family
- **Body**: Inter font family
- **Monospace**: JetBrains Mono

### Spacing
- Consistent 4px base unit
- Responsive spacing scale
- Component-specific spacing

### Icons
- **Lucide React** for all icons
- Consistent icon sizing
- Semantic icon usage

### Animations
- Smooth transitions
- Hover effects
- Loading states
- Micro-interactions

This component documentation provides a comprehensive guide to all UI elements and their usage patterns in the FleetTracker-Admin system. 