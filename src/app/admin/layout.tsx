import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/auth/signin?message=Please sign in to access admin features');
  }

  // Check if user has admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // Only allow users with 'admin' role or specific admin emails
  const adminEmails = [
    'harishariza02@gmail.com', // Your email
    'firstpantrypal@gmail.com', // Add other admin emails here
  ];

  const isAdmin = profile?.role === 'admin' || adminEmails.includes(user.email || '');

  if (!isAdmin) {
    redirect('/?message=Access denied - Admin privileges required');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 mb-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600">Logged in as: {user.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                Admin Access
              </span>
              <a 
                href="/" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to App
              </a>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}