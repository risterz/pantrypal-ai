# Admin Security Documentation

## 🔒 Admin Access Control

The admin panel and migration tools are protected with multiple layers of security.

## Who Can Access Admin Features

### Current Admin Users
- **harishariza02@gmail.com** (Primary Admin)
- **firstpantrypal@gmail.com** (Secondary Admin)

### Access Requirements
Users must meet **BOTH** of these criteria:
1. **Authentication**: Must be signed in to the application
2. **Authorization**: Must be either:
   - Have `role = 'admin'` in the profiles table, OR
   - Email address listed in the admin emails list

## Protected Resources

### Admin Pages
- `/admin/migrations` - Database migration interface
- `/admin/*` - All admin routes (protected by layout)

### API Endpoints
- `GET /api/admin/fix-missing-profiles` - Check for missing profiles
- `POST /api/admin/fix-missing-profiles` - Run migration to fix profiles

## Security Features

### 1. Authentication Layer
- Users must be signed in via Supabase Auth
- Session validation on every request
- Automatic redirect to signin if not authenticated

### 2. Authorization Layer
- Role-based access control (RBAC)
- Email whitelist for admin access
- Database role verification

### 3. Audit Trail
- All admin actions are logged with user email
- Migration execution tracking
- API access logging

## Adding New Admin Users

### Method 1: Database Role (Recommended)
```sql
-- Update user's role in profiles table
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'new-admin@example.com'
);
```

### Method 2: Email Whitelist
Add the email to the `ADMIN_EMAILS` array in:
- `src/app/admin/layout.tsx` (line 15)
- `src/app/api/admin/fix-missing-profiles/route.ts` (line 7)

## Security Best Practices

### For Admins
1. **Use strong passwords** for your account
2. **Enable 2FA** if available in your auth provider
3. **Log out** when finished with admin tasks
4. **Don't share** admin credentials

### For Developers
1. **Never hardcode** admin credentials
2. **Always validate** both authentication and authorization
3. **Log admin actions** for audit purposes
4. **Use environment variables** for sensitive configuration
5. **Regularly review** admin access lists

## Emergency Access

If you're locked out of admin access:

1. **Database Access**: Use Supabase dashboard to update roles
2. **Code Changes**: Update the `ADMIN_EMAILS` array and redeploy
3. **Environment Variables**: Add `ADMIN_API_KEY` for emergency API access

## Monitoring

### What to Monitor
- Failed admin login attempts
- Unauthorized access attempts to admin routes
- Migration execution frequency
- Database changes via admin tools

### Logs Location
- Vercel Function Logs for API endpoints
- Browser Console for client-side admin pages
- Supabase Auth logs for authentication events

## Incident Response

If unauthorized access is suspected:

1. **Immediate**: Remove suspicious emails from admin lists
2. **Investigate**: Check Vercel and Supabase logs
3. **Secure**: Change service role keys if compromised
4. **Document**: Record incident details and response actions

## Configuration

### Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_API_KEY=optional_emergency_key
```

### Database Requirements
- `profiles` table with `role` column
- Proper RLS policies for profile access
- Service role permissions for migration functions

## Testing Admin Security

### Manual Tests
1. Try accessing `/admin/migrations` without signing in
2. Sign in as non-admin user and try admin routes
3. Test API endpoints with different user types
4. Verify proper error messages and redirects

### Automated Tests
Consider adding tests for:
- Authentication middleware
- Authorization checks
- Admin role validation
- API security headers

---

**Last Updated**: 2025-08-03  
**Next Review**: 2025-09-03