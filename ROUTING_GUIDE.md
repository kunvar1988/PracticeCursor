# Next.js App Router - Routing Guide

This guide explains the file-based routing structure in this Next.js application.

## How Next.js Routing Works

In Next.js 13+ (App Router), the folder structure in the `app/` directory automatically creates routes:

```
app/
  page.tsx                    → URL: / (Home page)
  dashboards/
    page.tsx                  → URL: /dashboards
  playground/
    page.tsx                  → URL: /playground
  protected/
    page.tsx                  → URL: /protected
  auth/
    auth-code-error/
      page.tsx                → URL: /auth/auth-code-error
```

## Page Files Explained

### 1. `app/page.tsx` - Home Page (`/`)
- **Purpose**: Landing page with hero section, features, pricing
- **When to use**: First page users see
- **Components**: Navbar, HeroSection, FeaturesSection, PricingSection, CTASection, Footer

### 2. `app/dashboards/page.tsx` - Dashboard (`/dashboards`)
- **Purpose**: Main dashboard for managing API keys
- **When to use**: After user logs in, to manage their API keys
- **Components**: Dashboard component (which includes Sidebar, Header, PlanCard, ApiKeysTable)

### 3. `app/playground/page.tsx` - API Playground (`/playground`)
- **Purpose**: Test and validate API keys
- **When to use**: To test API keys before using them
- **Components**: Sidebar, form for entering API key

### 4. `app/protected/page.tsx` - Protected Page (`/protected`)
- **Purpose**: Validates API key and shows access status
- **When to use**: After entering API key in playground
- **Components**: Sidebar, validation UI, Toast notifications

### 5. `app/auth/auth-code-error/page.tsx` - Auth Error (`/auth/auth-code-error`)
- **Purpose**: Shows authentication errors
- **When to use**: When OAuth/login fails
- **Components**: Error message display

## Quick Reference

| File Path | URL Route | Main Purpose |
|-----------|-----------|--------------|
| `app/page.tsx` | `/` | Landing page |
| `app/dashboards/page.tsx` | `/dashboards` | API key management |
| `app/playground/page.tsx` | `/playground` | Test API keys |
| `app/protected/page.tsx` | `/protected` | Validate API keys |
| `app/auth/auth-code-error/page.tsx` | `/auth/auth-code-error` | Show auth errors |

## Tips

- Each `page.tsx` file is independent - you can edit them separately
- The folder name determines the URL route
- `page.tsx` is a special filename that Next.js recognizes as a route
- You can have multiple `page.tsx` files in different folders - they don't conflict

