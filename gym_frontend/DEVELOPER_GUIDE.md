# Developer Quick Reference Guide

## Project Structure Overview

```
gym_frontend/
├── src/
│   ├── components/       # Reusable components
│   ├── context/          # React context providers
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── App.js            # Main app routing
│   ├── App.css           # Global styles
│   ├── index.js          # Entry point
│   └── index.css         # Theme variables
├── public/               # Static assets
├── .env                  # Environment variables
├── .env.example          # Environment template
└── package.json          # Dependencies
```

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linter
npm run lint
```

## Adding a New Page

1. **Create page component** in `src/pages/`
```javascript
import React from 'react';
import './Pages.css';

const MyNewPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My New Page</h1>
      </div>
      {/* Page content */}
    </div>
  );
};

export default MyNewPage;
```

2. **Add route** in `src/App.js`
```javascript
import MyNewPage from './pages/MyNewPage';

// Inside Routes component
<Route path="/my-new-page" element={<MyNewPage />} />

// For protected route
<Route
  path="/my-new-page"
  element={
    <ProtectedRoute requiredRole="admin">
      <MyNewPage />
    </ProtectedRoute>
  }
/>
```

3. **Add navigation** in `src/components/Layout.js`
```javascript
{ path: '/my-new-page', label: 'My Page', icon: '📄' }
```

## Making API Calls

### Using the API Service

```javascript
import api from '../services/api';

// GET request
const fetchData = async () => {
  try {
    const response = await api.get('/api/endpoint');
    setData(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// POST request
const createItem = async (data) => {
  try {
    const response = await api.post('/api/endpoint', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Failed');
  }
};

// PUT request
const updateItem = async (id, data) => {
  await api.put(`/api/endpoint/${id}`, data);
};

// DELETE request
const deleteItem = async (id) => {
  await api.delete(`/api/endpoint/${id}`);
};
```

## Using Authentication

### Access Current User

```javascript
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, hasRole } = useAuth();
  
  if (hasRole('admin')) {
    // Admin-specific content
  }
  
  return <div>Welcome {user?.full_name}</div>;
};
```

### Login/Logout

```javascript
const { login, logout } = useAuth();

// Login
try {
  await login(email, password);
  navigate('/dashboard');
} catch (error) {
  setError(error.message);
}

// Logout
logout();
navigate('/login');
```

## Styling Components

### Using Theme Variables

```css
.my-component {
  background-color: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.my-button {
  background-color: var(--primary);
  color: white;
}

.my-button:hover {
  background-color: var(--secondary);
}
```

### Available CSS Variables

```css
--primary: #2563EB      /* Blue */
--secondary: #F59E0B    /* Amber */
--success: #10B981      /* Green */
--error: #EF4444        /* Red */
--background: #f9fafb   /* Light gray */
--surface: #ffffff      /* White */
--text: #111827         /* Dark gray */
--text-secondary: #6B7280
--border: #E5E7EB
--shadow: /* Small shadow */
--shadow-lg: /* Large shadow */
```

### Common CSS Classes

```css
/* Buttons */
.btn
.btn-primary
.btn-secondary
.btn-outline
.btn-block

/* Forms */
.input
.form-group
.form-row
.form-actions

/* Layout */
.page-container
.page-header
.page-loading
.card
.table-card

/* Status */
.badge
.status-badge
.error-banner
.success-banner
.info-banner

/* Lists */
.cards-grid
.classes-list
.empty-state
```

## Common Patterns

### Loading State

```javascript
const [loading, setLoading] = useState(true);

if (loading) {
  return (
    <div className="page-loading">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}
```

### Error Handling

```javascript
const [error, setError] = useState('');

{error && <div className="error-banner">{error}</div>}
```

### Success Message

```javascript
const [success, setSuccess] = useState('');

{success && <div className="success-banner">{success}</div>}
```

### Form Handling

```javascript
const [formData, setFormData] = useState({
  field1: '',
  field2: ''
});

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.post('/api/endpoint', formData);
    // Success handling
  } catch (error) {
    setError(error.message);
  }
};

return (
  <form onSubmit={handleSubmit} className="form">
    <div className="form-group">
      <label>Field 1</label>
      <input
        type="text"
        className="input"
        value={formData.field1}
        onChange={(e) => setFormData({
          ...formData,
          field1: e.target.value
        })}
        required
      />
    </div>
    <button type="submit" className="btn btn-primary">
      Submit
    </button>
  </form>
);
```

### Modal Pattern

```javascript
const [showModal, setShowModal] = useState(false);

{showModal && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2>Modal Title</h2>
        <button className="modal-close" onClick={() => setShowModal(false)}>
          ×
        </button>
      </div>
      <div className="modal-body">
        {/* Modal content */}
      </div>
    </div>
  </div>
)}
```

## Role-Based Access

### Define Required Roles

```javascript
// Admin only
<ProtectedRoute requiredRole="admin">
  <AdminPage />
</ProtectedRoute>

// Trainer only
<ProtectedRoute requiredRole="trainer">
  <TrainerPage />
</ProtectedRoute>

// Member only
<ProtectedRoute requiredRole="member">
  <MemberPage />
</ProtectedRoute>

// Any authenticated user
<ProtectedRoute>
  <AnyUserPage />
</ProtectedRoute>
```

## Testing

### Component Test Example

```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders component', () => {
  render(<MyComponent />);
  const element = screen.getByText(/expected text/i);
  expect(element).toBeInTheDocument();
});
```

## Environment Variables

### Adding New Variable

1. Add to `.env`:
```
REACT_APP_MY_VAR=value
```

2. Add to `.env.example`:
```
REACT_APP_MY_VAR=default_value
```

3. Access in code:
```javascript
const myVar = process.env.REACT_APP_MY_VAR;
```

**Note**: All React env vars must start with `REACT_APP_`

## Debugging Tips

### React DevTools
- Install React DevTools browser extension
- Inspect component hierarchy and props
- Check context values

### Network Debugging
- Open browser DevTools → Network tab
- Filter by XHR to see API calls
- Check request/response headers and body

### Console Logging
```javascript
console.log('Debug:', variable);
console.error('Error:', error);
console.table(arrayData); // For arrays
```

### Check Auth State
```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user') || '{}'));
```

## Code Style Guidelines

### Component Structure
```javascript
// Imports
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './ComponentName.css';

// PUBLIC_INTERFACE comment for public functions
// PUBLIC_INTERFACE
/**
 * Component description
 */
const ComponentName = () => {
  // State declarations
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### Naming Conventions
- Components: PascalCase (`MyComponent`)
- Files: PascalCase for components (`MyComponent.js`)
- Variables/Functions: camelCase (`myVariable`, `handleClick`)
- CSS Classes: kebab-case (`my-class-name`)
- Constants: UPPER_SNAKE_CASE (`API_URL`)

## Performance Tips

### Avoid Unnecessary Re-renders
```javascript
// Use useCallback for event handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

### Optimize Lists
```javascript
// Always use keys in lists
{items.map((item) => (
  <div key={item.id}>
    {item.name}
  </div>
))}
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/my-feature

# Create pull request for review
```

## Deployment Checklist

- [ ] Update `.env` with production values
- [ ] Run `npm run build`
- [ ] Test production build locally
- [ ] Verify API connections work
- [ ] Check all routes are accessible
- [ ] Test on different browsers
- [ ] Verify mobile responsiveness
- [ ] Check console for errors
- [ ] Validate environment variables are set

## Need Help?

- Check the main README.md for detailed documentation
- Review existing components for patterns
- Check the backend API documentation (openapi.json)
- Use React DevTools for debugging
- Check browser console for errors
