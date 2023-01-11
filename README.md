## Invoice Creator

---

This is a nextjs app designed to create simple .pdf invoices.

### Run:

```
docker-compose up --build
```

Go to `localhost:3000`.

### Build:

```
NODE_ENV = production
docker-compose up --build -d -f docker-compose.prod.yml
```

This will run on port 80, open `localhost`.

### Test:

```
docker-compose up -d
npx cypress open
```
