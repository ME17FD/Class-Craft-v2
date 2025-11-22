# Production Deployment Guide

## Security Configuration

### Swagger/OpenAPI in Production

**Swagger is DISABLED by default in production** for security reasons. This prevents:
- Public exposure of API structure
- Unauthorized testing of endpoints
- Information disclosure about internal endpoints

### How to Deploy

#### Option 1: Use Production Profile (Recommended)
```bash
java -jar your-app.jar --spring.profiles.active=prod
```

This automatically:
- Disables Swagger UI
- Disables API documentation endpoints
- Sets `ddl-auto=validate` (prevents schema changes)
- Disables SQL logging

#### Option 2: Environment Variables
```bash
export SPRINGDOC_API_DOCS_ENABLED=false
export SPRINGDOC_SWAGGER_UI_ENABLED=false
java -jar your-app.jar
```

#### Option 3: Application Properties Override
Create `application-prod.properties` or set in your deployment environment:
```properties
springdoc.api-docs.enabled=false
springdoc.swagger-ui.enabled=false
```

### Development/Testing

For local development, Swagger is enabled by default:
```bash
# Development (Swagger enabled)
java -jar your-app.jar --spring.profiles.active=dev

# Or use default (Swagger enabled)
java -jar your-app.jar
```

### Security Checklist

Before deploying to production, ensure:

- [ ] Swagger is disabled (`springdoc.api-docs.enabled=false`)
- [ ] Production profile is active (`--spring.profiles.active=prod`)
- [ ] Database `ddl-auto` is set to `validate` (not `update` or `create`)
- [ ] SQL logging is disabled (`spring.jpa.show-sql=false`)
- [ ] JWT secret is set via environment variable (not hardcoded)
- [ ] Database credentials are set via environment variables
- [ ] CORS origins are restricted to your production frontend domain
- [ ] All API endpoints require authentication (except `/api/auth/**`)

### Environment Variables for Production

```bash
# Required
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=<strong-random-secret>
SPRING_DATASOURCE_URL=jdbc:mysql://your-db-host:3306/classcraftdb
SPRING_DATASOURCE_USERNAME=<db-username>
SPRING_DATASOURCE_PASSWORD=<db-password>

# Optional (Swagger disabled by default in prod profile)
SPRINGDOC_API_DOCS_ENABLED=false
SPRINGDOC_SWAGGER_UI_ENABLED=false
```

