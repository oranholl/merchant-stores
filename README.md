# Merchant Stores Platform

A full-stack app for managing stores and products, with analytics to find market opportunities.

## Quick Start

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Analytics: http://localhost:5173/analytics  
- API: http://localhost:4000

The database gets seeded automatically with sample stores and products.

---

## API Endpoints

```
# Stores
GET    /api/stores
POST   /api/stores
GET    /api/stores/:id
PUT    /api/stores/:id
DELETE /api/stores/:id

# Products
GET    /api/products/store/:storeId   # supports ?page=1&limit=10&category=X&minPrice=Y
POST   /api/products/store/:storeId
GET    /api/products/store/:storeId/:id
PUT    /api/products/store/:storeId/:id
DELETE /api/products/store/:storeId/:id

# Analytics (the interesting part)
GET    /api/stores/analytics/market-density
```

---

## Design Choices

### Why MongoDB?

I went with MongoDB because it's easier to set up in Docker and the flexible schema made rapid iteration simpler. The trade-off is less strict data integrity compared to SQL with foreign keys, but Mongoose schemas still give us validation.

### Component Structure

I split the UI into small, reusable components (OpportunityCard, MarketTable, GapCard). Even if it's more files, each component does one thing and is way easier to test, i could split into more.

### The Analytics Feature

This is the interesting api - it's not just CRUD. The market density analysis:
- Groups stores by location and type
- Calculates what % of stores sell each category
- Finds gaps (like "no Electronics stores in small towns")
- Suggests business opportunities

The logic:
1. Group stores by cityType
2. Get all categories per cityType
3. Find missing = AllCategories - CityTypeCategories
4. Calculate saturation = (storesWithCategory / totalStores) * 100
5. Sort opportunities by priority

### Data Models

**Store:**
```typescript
{
  name, description, city, 
  cityType: 'big' | 'small',  // needed for analytics
  address?, phone?, email?,
  isActive  // for soft deletes
}
```

**Product:**
```typescript
{
  name, description, price, stock, 
  category,  // critical for analytics
  store: ObjectId,
  imageUrl?, isAvailable
}
```

I kept cityType simple (just big/small) to make the analytics patterns clearer. In a real app, you'd probably want more granularity.

---

## Tests

I focused on testing the important things:

**Backend** (Vitest)
- Analytics logic - the core business value
- Schema validation - prevents bad data
- Error handling - makes sure async errors get caught

**Frontend** (Vitest + React Testing Library)  
- Analytics page - loading, errors, data display
- CRUD operations - create/edit/delete stores
- Components - basic rendering checks

Run tests:
```bash
cd frontend && npm test
cd backend && npm test
npm run test  # from root
```

What I didn't test (but would in production):
- API integration tests with a real test database
- E2E tests
- Performance testing

---

## If I Had More Time

**Better code organization:**
- Backend: Pull business logic into service classes, break analytics into smaller functions
- Frontend: Extract custom hooks (useStores, useProducts), split pages into smaller components
- Result: Everything's easier to test in isolation and easier to read and maintain

**More features:**
- Authentication
- API docs (Swagger)
- Historical trend analysis
- Export analytics to CSV
- Rate limiting
- CI/CD pipeline

---

## Tech Stack

Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, Zod  
Frontend: React 18, TypeScript, Vite, React Router  
Testing: Vitest, React Testing Library  
Deployment: Docker

---

## Sample Data

The seed creates:
- 12 stores (7 in big cities like NY/LA, 5 in small towns)
- 72 products across 4 categories
- Clear patterns: Big cities get Electronics/Fashion, small towns get Tools/Food

This makes the analytics actually interesting to look at.

---

## Running Without Docker

```bash
# You'll need Node 18+ and MongoDB running

npm install

# Backend
cd backend
cp .env.example .env
# Set MONGODB_URI=mongodb://localhost:27017/merchant-stores
npm run seed
npm run dev

# Frontend  
cd frontend
npm run dev
```

---

## Example API Responses

**Products with filters:**
```bash
GET /api/products/store/123?category=Electronics&minPrice=20

{
  "success": true,
  "data": [...],
  "pagination": { "total": 12, "page": 1, "pages": 3 }
}
```

**Market Analytics:**
```bash
GET /api/stores/analytics/market-density

{
  "success": true,
  "data": {
    "byCities": [
      { "city": "New York", "storeCount": 3, ... }
    ],
    "categoryGaps": [
      { 
        "cityType": "small", 
        "missingCategories": ["Electronics", "Fashion"] 
      }
    ],
    "opportunities": [
      {
        "cityType": "small",
        "category": "Electronics",
        "reason": "No stores offering Electronics in small locations",
        "competitionLevel": "NONE"
      }
    ]
  }
}
```

---

## Troubleshooting

- Check health: http://localhost:4000/health
- View logs: `docker-compose logs -f backend`
- Fresh start: `docker-compose down -v && docker-compose up --build`
- Tests failing: Run `npm install` in both frontend and backend folders