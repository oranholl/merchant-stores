# Tiny Inventory - Merchant Stores Platform

A full-stack inventory management system for tracking stores and their products, with market density analytics.

## 🚀 Quick Start

**Run everything with one command:**

```bash
docker-compose up --build
```

Then access:
- **Frontend**: http://localhost:5173
- **Analytics Dashboard**: http://localhost:5173/analytics  
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

The database is automatically seeded with sample data on startup.

---

## 📡 API Overview

```
# Stores
GET    /api/stores                    - List all stores
POST   /api/stores                    - Create store
GET    /api/stores/:id                - Get single store
PUT    /api/stores/:id                - Update store
DELETE /api/stores/:id                - Delete store

# Products (with pagination & filtering)
GET    /api/products/store/:storeId   - List products (?page=1&limit=10&category=X&minPrice=Y)
POST   /api/products/store/:storeId   - Create product
GET    /api/products/store/:storeId/:id - Get single product
PUT    /api/products/store/:storeId/:id - Update product
DELETE /api/products/store/:storeId/:id - Delete product

# Non-Trivial Operation: Market Density Analytics
GET    /api/stores/analytics/market-density - Aggregated market analysis with opportunities
```

---

## 🎯 Key Decisions & Trade-offs

### Architecture Decisions

**1. MongoDB over SQL**
- **Why**: Flexible schema for rapid prototyping, simpler Docker setup
- **Trade-off**: Less rigid data integrity vs SQL foreign keys
- **Mitigation**: Mongoose schemas provide structure and validation

**2. Component-Based UI**
- **Why**: Split UI into reusable components (OpportunityCard, MarketTable, GapCard)
- **Trade-off**: 3 extra files vs one monolithic component
- **Win**: Each component has single responsibility, easier to test

### Data Model Decisions

**Store Model**
```typescript
{
  name, description, city, cityType: 'big' | 'small',
  address?, phone?, email?, isActive
}
```
- `cityType`: Enables market density analytics
- `isActive`: Soft delete for data retention

**Product Model**
```typescript
{
  name, description, price, stock, category,
  store: ObjectId, imageUrl?, isAvailable
}
```
- `category`: Critical for analytics
- `store` reference: Enables efficient queries

### Non-Trivial Operation: Market Density Analysis

**What it does:**
- Aggregates stores by city and city type
- Calculates category saturation (% of stores offering each category)
- Detects gaps (categories missing in locations)
- Identifies business opportunities (untapped markets)

**Why this approach:**
- Real aggregation logic (not just CRUD)
- Provides actionable business insights
- Demonstrates data analysis capabilities
- All computed from live data

**Implementation:**
```typescript
1. Group stores by cityType
2. Collect all categories per cityType
3. Find missing = AllCategories - CityTypeCategories
4. Calculate saturation = (storesWithCategory / totalStores) * 100
5. Return opportunities sorted by priority
```

### UI/UX Decisions

**1. Simplified to Big/Small Cities**
- **Why**: Focus on backend, 2 types sufficient for demo
- **Trade-off**: Less realistic than 5-6 types
- **Win**: Clearer analytics, easier patterns

**2. Analytics Dashboard**
- **Why**: Showcase non-trivial operation visually
- **Layout**: Opportunities → Markets → Gaps
- **Trade-off**: Extra page complexity
- **Win**: Clear value demonstration

**3. Loading/Error States**
- **Implemented**: All async operations show loading
- **Errors**: User-friendly messages
- **Empty states**: Not needed (always have seed data)

## 🧪 Testing Approach

### Testing Strategy

**Backend Unit Tests** (Vitest)
```
analytics.test.ts (Most Critical - Core Business Logic)
store.schemas.test.ts
product.schemas.test.ts
errorHandler.test.ts
```

**Frontend Tests** (Vitest + React Testing Library)
```
Analytics.test.tsx (Integration)
Stores.test.tsx (CRUD Operations)
Component Tests
- OpportunityCard.test.tsx
- MarketTable.test.tsx
```

**Test Commands**
```bash
# Frontend tests
cd frontend
npm test              # Run all tests
npm run test:ui       # Visual test UI
npm run coverage      # Coverage report

# Backend tests  
cd backend
npm test              # Run all tests
npm run test:ui       # Visual test UI
npm run coverage      # Coverage report

# Run all tests (from root)
npm run test:all      # Both frontend and backend
```

**Why This Approach:**
1. **Analytics tests are priority** - Core business logic tested thoroughly
2. **Schema validation tests** - Prevent bad data at entry point
3. **Component tests** - Ensure UI renders correctly
4. **Integration tests** - Verify full user workflows (CRUD)
5. **Error handling tests** - Ensure robust error management

**What's Tested:**
- ✅ Business logic (analytics calculations)
- ✅ Data validation (Zod schemas)
- ✅ Error handling (async errors, AppError)
- ✅ UI rendering (components, pages)
- ✅ CRUD operations (create, read, update, delete)
- ✅ Loading and error states
- ✅ Form interactions and validation

**What's NOT Tested** (Would add with more time):
- ❌ API integration tests (supertest with real DB)
- ❌ E2E tests (Playwright/Cypress)
- ❌ Database operations (MongoDB mocking)
- ❌ Authentication middleware (when added)
- ❌ Performance tests

---

## ⏱️ If I Had More Time

1. **Code refactoring for better testability reusability**
   - **Backend**: Extract business logic into service layer (`StoreService`, `AnalyticsService`), split analytics into smaller pure functions, create utility modules for common operations
   - **Frontend**: Break pages into smaller components, extract custom hooks (`useStores`, `useProducts`, `useForm`), create shared formatters and validators
   - **Benefits:**
   - Each function testable in isolation
   - Easier to mock dependencies
   - Reduced code duplication
   - Better separation of concerns
   - Simpler unit tests (no need to mock entire controllers/pages)


2. **Enhanced test coverage**
   - API integration tests with test database
   - E2E tests for critical user flows
   - Performance/load testing
   - Visual regression tests

3. **Enhanced analytics features**
   - Historical trends over time
   - Price analysis by category/location
   - Inventory value calculations
   - Export to CSV/PDF

4. **Production hardening**
   - Add authentication (JWT)
   - Implement rate limiting
   - Add API documentation (Swagger)
   - Set up CI/CD
   - Database migrations
   - Caching layer (Redis)

---

## 🛠️ Tech Stack

**Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, Zod  
**Frontend**: React 18, TypeScript, React Router, Vite, Axios  
**Infrastructure**: Docker, Docker Compose
**Testing**: Vitest, React Testing Library, Supertest  

---

## 💾 Seed Data

Auto-populated on startup:
- **12 stores**: 7 big cities (NY, LA, Chicago), 5 small towns
- **72 products**: Electronics, Fashion, Food, Tools
- **Realistic data**: Names, prices, stock levels
- **Clear patterns**: Big cities have Electronics/Fashion, small towns have Tools/Food

---

## 🔧 Manual Setup (Without Docker)

```bash
# Prerequisites: Node.js 18+, MongoDB

npm install

# Backend
cd backend
cp .env.example .env
# Edit MONGODB_URI=mongodb://localhost:27017/merchant-stores
npm run seed
npm run dev

# Frontend
cd frontend
npm run dev
```

---

## 📊 API Examples

**List Products (filtered & paginated)**
```bash
GET /api/products/store/123?page=1&limit=5&category=Electronics&minPrice=20

Response:
{
  "success": true,
  "data": [...],
  "pagination": { "total": 12, "page": 1, "pages": 3, "limit": 5 }
}
```

**Market Density Analytics**
```bash
GET /api/stores/analytics/market-density

Response:
{
  "success": true,
  "data": {
    "byCities": [{ "city": "New York", "storeCount": 3, ... }],
    "categoryGaps": [{ 
      "cityType": "small", 
      "missingCategories": ["Electronics", "Fashion"] 
    }],
    "opportunities": [{
      "cityType": "small",
      "category": "Electronics",
      "reason": "No stores offering Electronics in small locations",
      "competitionLevel": "NONE"
    }]
  }
}
```

---

## ❓ Troubleshooting

- **Health check**: http://localhost:4000/health
- **View logs**: `docker-compose logs -f backend`
- **Clean restart**: `docker-compose down -v && docker-compose up --build`
- **Tests failing**: Make sure to `npm install` in both frontend and backend
