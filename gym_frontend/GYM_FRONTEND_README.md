# Gym Manager Frontend

A complete React frontend application for gym management with role-based access control, built with the Ocean Professional theme.

## Features

### Authentication System
- **JWT-based authentication** with token storage in localStorage
- **Role-based access control** (Admin, Member, Trainer)
- **Protected routes** with automatic redirection
- **Registration and Login** pages with validation
- **Auth context** for global authentication state management

### Role-Specific Dashboards

#### Admin Dashboard
- View gym metrics (members, memberships, classes, trainers, bookings, revenue)
- Quick actions to manage all aspects of the gym
- Access to all management pages

#### Member Dashboard
- View membership status and upcoming bookings
- Quick access to browse classes and manage bookings
- View classes attended statistics

#### Trainer Dashboard
- View assigned classes and schedule
- Track total students
- Manage trainer profile

### Management Pages

#### Classes Management (Admin)
- Create, edit, and delete classes
- Assign trainers to classes
- Set capacity, room, time, and description
- View booking count for each class

#### Memberships Management (Admin)
- Create and manage membership plans
- View all active memberships
- Set pricing, duration, and features for plans

#### Trainers Management (Admin)
- View all trainer profiles
- See trainer specialties and certifications
- View classes assigned to each trainer
- Delete trainer profiles

#### Bookings Management (Admin)
- View all bookings across the gym
- Cancel bookings
- See booking status (confirmed, cancelled, waitlisted)

### Member Portal

#### Browse Classes
- View all upcoming classes
- See class details (time, room, trainer, capacity)
- Book classes with one click
- Real-time capacity display

#### My Bookings
- View personal booking history
- Cancel upcoming bookings
- Track booking status

#### My Membership
- View active membership details
- See membership expiration date
- Browse available membership plans

### Trainer Portal

#### My Classes
- View all assigned classes
- See class details and booking counts
- Track upcoming schedule

#### My Profile
- Edit trainer biography
- Update specialties and certifications
- Professional profile management

## Technical Stack

### Core Technologies
- **React 18.2** - UI library
- **React Router DOM 6.20** - Client-side routing
- **Axios 1.6** - HTTP client for API calls
- **React Scripts 5.0** - Build tooling

### Architecture

#### Context API
- **AuthContext** - Global authentication state management
  - User login/logout
  - Role checking
  - Token management
  - Auto-logout on 401 responses

#### API Service Layer
- Centralized axios instance with base URL configuration
- Request interceptor for automatic JWT token injection
- Response interceptor for authentication error handling
- Automatic redirect to login on token expiration

#### Protected Routes
- Route-level authentication checks
- Role-based route authorization
- Loading states during auth verification
- Automatic redirection for unauthorized access

#### Component Structure
```
src/
├── components/
│   ├── Layout.js           # Main layout with sidebar navigation
│   ├── Layout.css          # Layout styles
│   └── ProtectedRoute.js   # Route protection wrapper
├── context/
│   └── AuthContext.js      # Authentication context provider
├── pages/
│   ├── Login.js            # Login page
│   ├── Register.js         # Registration page
│   ├── Unauthorized.js     # 403 page
│   ├── AdminDashboard.js   # Admin dashboard
│   ├── MemberDashboard.js  # Member dashboard
│   ├── TrainerDashboard.js # Trainer dashboard
│   ├── Classes.js          # Classes management
│   ├── Memberships.js      # Memberships management
│   ├── Trainers.js         # Trainers management
│   ├── Bookings.js         # Bookings management
│   ├── MemberClasses.js    # Browse classes (member)
│   ├── MemberBookings.js   # My bookings (member)
│   ├── MemberMembership.js # My membership (member)
│   ├── TrainerClasses.js   # My classes (trainer)
│   ├── TrainerProfile.js   # My profile (trainer)
│   ├── Auth.css            # Auth pages styles
│   ├── Dashboard.css       # Dashboard styles
│   └── Pages.css           # Shared page styles
├── services/
│   └── api.js              # API service configuration
├── App.js                  # Main app with routing
├── App.css                 # Global app styles
├── index.js                # Entry point
└── index.css               # Global CSS with theme variables
```

## Design System - Ocean Professional Theme

### Color Palette
- **Primary**: #2563EB (Blue) - Main actions, links, primary buttons
- **Secondary**: #F59E0B (Amber) - Accents, highlights, badges
- **Success**: #10B981 (Green) - Success messages, active states
- **Error**: #EF4444 (Red) - Error messages, delete actions
- **Background**: #f9fafb (Light Gray) - Page background
- **Surface**: #ffffff (White) - Card backgrounds
- **Text**: #111827 (Dark Gray) - Primary text
- **Text Secondary**: #6B7280 (Medium Gray) - Secondary text

### Design Principles
- **Modern aesthetic** with clean lines and subtle shadows
- **Rounded corners** (0.375rem - 0.75rem) for friendly appearance
- **Smooth transitions** (0.2s) for all interactive elements
- **Responsive design** with mobile-first approach
- **Consistent spacing** using a systematic scale
- **Accessible focus states** with visible outlines

### Component Patterns
- **Cards**: Elevated surfaces with shadow and hover effects
- **Buttons**: Primary, secondary, and outline variants
- **Forms**: Consistent input styling with focus states
- **Tables**: Responsive with hover highlighting
- **Badges**: Rounded pills for status indicators
- **Navigation**: Sidebar with active state indicators

## API Integration

### Backend Connection
The frontend connects to the FastAPI backend via environment variables:
- `REACT_APP_API_URL` - Backend API base URL (default: http://localhost:3001)
- `REACT_APP_SITE_URL` - Frontend site URL for redirects

### API Endpoints Used

#### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration
- GET `/api/auth/me` - Get current user

#### Dashboards
- GET `/api/dashboard/admin` - Admin metrics
- GET `/api/dashboard/member` - Member data
- GET `/api/dashboard/trainer` - Trainer data

#### Classes
- GET `/api/classes/` - List all classes
- POST `/api/classes/` - Create class (admin)
- GET `/api/classes/{id}` - Get class details
- PUT `/api/classes/{id}` - Update class (admin)
- DELETE `/api/classes/{id}` - Delete class (admin)

#### Memberships
- GET `/api/memberships/plans` - List membership plans
- POST `/api/memberships/plans` - Create plan (admin)
- PUT `/api/memberships/plans/{id}` - Update plan (admin)
- DELETE `/api/memberships/plans/{id}` - Delete plan (admin)
- GET `/api/memberships/` - List memberships
- POST `/api/memberships/` - Create membership (admin)

#### Trainers
- GET `/api/trainers/` - List all trainers
- POST `/api/trainers/` - Create trainer (admin)
- GET `/api/trainers/{id}` - Get trainer details
- PUT `/api/trainers/{id}` - Update trainer
- DELETE `/api/trainers/{id}` - Delete trainer (admin)
- GET `/api/trainers/{id}/classes` - Get trainer's classes

#### Bookings
- GET `/api/bookings/` - List bookings
- POST `/api/bookings/` - Create booking
- GET `/api/bookings/{id}` - Get booking details
- PATCH `/api/bookings/{id}/cancel` - Cancel booking

## Running the Application

### Development Mode
```bash
npm start
```
Runs the app at http://localhost:3000 (or next available port)

### Production Build
```bash
npm run build
```
Creates optimized production build in `build/` folder

### Testing
```bash
npm test
```
Runs the test suite in interactive watch mode

## Environment Setup

Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_SITE_URL=http://localhost:3000
```

For production, update these values to your deployed URLs.

## User Flows

### Member Flow
1. Register/Login as member
2. View member dashboard with membership status
3. Browse available classes
4. Book classes
5. View and manage bookings
6. Check membership details

### Trainer Flow
1. Register/Login as trainer
2. View trainer dashboard with class statistics
3. See assigned classes and schedule
4. Edit profile with bio, specialties, certifications

### Admin Flow
1. Login as admin
2. View comprehensive dashboard with gym metrics
3. Manage membership plans
4. Create and schedule classes
5. Assign trainers to classes
6. Monitor all bookings
7. Manage trainer profiles

## Security Features

### Authentication
- JWT tokens stored in localStorage
- Automatic token injection in all API requests
- Token expiration handling with auto-logout
- Secure password validation (minimum 6 characters)

### Authorization
- Role-based route protection
- Server-side permission verification
- Graceful handling of unauthorized access
- Redirect to appropriate pages based on role

### Best Practices
- No sensitive data in client-side code
- Environment variables for configuration
- HTTPS ready (works with SSL/TLS)
- XSS protection through React's built-in escaping

## Responsive Design

### Mobile (< 768px)
- Collapsible sidebar navigation
- Single column layouts
- Touch-friendly button sizes
- Optimized forms and tables

### Tablet (768px - 1024px)
- Adaptive grid layouts
- Balanced spacing
- Readable typography

### Desktop (> 1024px)
- Full sidebar always visible
- Multi-column grids
- Optimal information density

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus visible styles
- Screen reader friendly
- Color contrast compliance

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of route components (ready for implementation)
- Optimized bundle size
- Efficient re-renders with proper React patterns
- CSS bundling and minification
- Production build optimizations

## Browser Support

- Chrome (last 1 version)
- Firefox (last 1 version)
- Safari (last 1 version)
- Edge (last 1 version)
- Modern mobile browsers

## Future Enhancements

### Potential Additions
- [ ] Real-time notifications with WebSockets
- [ ] Advanced filtering and search
- [ ] Calendar view for classes
- [ ] Payment integration for memberships
- [ ] Member progress tracking
- [ ] Attendance marking interface
- [ ] Reporting and analytics dashboards
- [ ] Email notifications
- [ ] Export data functionality
- [ ] Dark mode support
- [ ] Multi-language support

## Troubleshooting

### Common Issues

**Port Already in Use**
- The app will automatically offer to run on another port
- Or manually kill the process: `kill -9 $(lsof -ti:3000)`

**API Connection Failed**
- Verify backend is running on the correct port
- Check `.env` file has correct `REACT_APP_API_URL`
- Ensure CORS is properly configured on backend

**Login Issues**
- Clear localStorage: `localStorage.clear()`
- Check network tab for API response
- Verify backend authentication is working

**Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`
- Update packages: `npm update`

## Contributing

When adding new features:
1. Follow the established component structure
2. Use the Ocean Professional theme variables
3. Implement proper error handling
4. Add loading states for async operations
5. Ensure mobile responsiveness
6. Document any new environment variables
7. Update this README with new features

## License

This project is part of the Gym Management System.
