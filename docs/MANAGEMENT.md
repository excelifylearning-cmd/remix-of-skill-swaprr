# SkillSwappr — Management & Operations Guide

## Day-to-Day Management

### Adding a New Feature

1. Create feature folder: `src/features/your-feature/`
2. Add page component with lazy loading
3. Add route in `App.tsx`
4. If backend needed: create migration → add RLS → update types
5. Write tests in `src/test/`
6. Submit PR → CI runs → merge

### Database Changes

```bash
# Create a new migration
supabase migration new your_migration_name

# Edit the generated SQL file in supabase/migrations/
# Then push:
supabase db push
```

**Rules:**
- Never modify `auth.*` or `storage.*` schemas directly
- Always add RLS policies to new tables
- Use validation triggers instead of CHECK constraints for time-based rules
- Add indexes for columns used in WHERE/ORDER BY on high-traffic queries

### Managing Users

Query user data through the `profiles` table:
```sql
-- Find a user
SELECT * FROM profiles WHERE email ILIKE '%search%';

-- Check user roles
SELECT ur.role FROM user_roles ur WHERE ur.user_id = 'uuid';

-- Assign admin role
INSERT INTO user_roles (user_id, role) VALUES ('uuid', 'admin');
```

### Content Management

All content tables (`blog_posts`, `forum_threads`, `events`, `help_articles`) support:
- CRUD via Supabase client
- Status fields (`is_published`, `status`)
- Author tracking via `author_id`
- Timestamps for auditing

### Monitoring Errors

```sql
-- Recent errors
SELECT error_type, message, page_path, created_at
FROM error_log ORDER BY created_at DESC LIMIT 20;

-- Error frequency
SELECT error_type, COUNT(*) as count
FROM error_log
WHERE created_at > now() - interval '24 hours'
GROUP BY error_type ORDER BY count DESC;
```

### Analytics

```sql
-- Page views (last 7 days)
SELECT page_path, COUNT(*) as views
FROM page_sessions
WHERE created_at > now() - interval '7 days'
GROUP BY page_path ORDER BY views DESC;

-- User activity
SELECT action, COUNT(*) FROM activity_log
WHERE created_at > now() - interval '24 hours'
GROUP BY action ORDER BY count DESC;
```

## Environment Configuration

| Variable | Purpose | Where |
|----------|---------|-------|
| `VITE_SUPABASE_URL` | API endpoint | `.env` / CI secrets |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon key | `.env` / CI secrets |
| `AI_CHAT_API_KEY` | AI provider key | Supabase secrets |
| `LOVABLE_API_KEY` | Lovable AI gateway | Supabase secrets |

## Backup Strategy

1. **Database**: Supabase Pro includes daily backups + point-in-time recovery
2. **Code**: GitHub with branch protection on main
3. **Storage**: Supabase storage with bucket versioning
4. **Migrations**: Version controlled in `supabase/migrations/`

## Security Checklist

- [x] RLS enabled on all tables
- [x] `has_role()` security definer function
- [x] Rate limiting on public forms
- [x] No secrets in client code
- [x] Input validation with Zod
- [ ] Enable email confirmations (production)
- [ ] Set up 2FA for admin accounts
- [ ] Configure CORS for production domain only
- [ ] Regular dependency audit (`npm audit`)
