'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertCircle, Users, Database } from 'lucide-react';

interface MigrationResult {
  success: boolean;
  message: string;
  missingCount: number;
  created: number;
  remainingMissing: number;
  missingUsers: Array<{ email: string; id: string }>;
  latestProfiles: Array<{ username: string; created: string }>;
}

interface ProfileCheck {
  missingCount: number;
  missingUsers: Array<{ email: string; id: string; created: string }>;
}

export default function MigrationsPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [profileCheck, setProfileCheck] = useState<ProfileCheck | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkProfiles = async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/fix-missing-profiles');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check profiles');
      }
      
      setProfileCheck(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsChecking(false);
    }
  };

  const runMigration = async () => {
    setIsRunning(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/admin/fix-missing-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add admin key if you set one in environment variables
          // 'x-admin-key': 'your-admin-key'
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Migration failed');
      }
      
      setResult(data);
      // Refresh the profile check after successful migration
      await checkProfiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Database Migrations</h1>
        <p className="text-muted-foreground">
          Manage database migrations and fixes for PantryPal AI
        </p>
      </div>

      {/* Profile Check Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Profile Status Check
          </CardTitle>
          <CardDescription>
            Check for users who exist in auth.users but are missing from profiles table
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button 
              onClick={checkProfiles} 
              disabled={isChecking}
              variant="outline"
            >
              {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Check Profiles
            </Button>
          </div>

          {profileCheck && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {profileCheck.missingCount === 0 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                <span className="font-medium">
                  {profileCheck.missingCount === 0 
                    ? 'All users have profiles' 
                    : `${profileCheck.missingCount} users missing profiles`
                  }
                </span>
              </div>

              {profileCheck.missingUsers.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Missing Profiles:</h4>
                  <div className="space-y-2">
                    {profileCheck.missingUsers.map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{user.email}</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">{user.id}</Badge>
                          <Badge variant="secondary">{user.created}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Migration Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Fix Missing Profiles Migration
          </CardTitle>
          <CardDescription>
            Creates profiles for users who exist in auth.users but are missing from profiles table
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={runMigration} 
                disabled={isRunning || profileCheck?.missingCount === 0}
              >
                {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Run Migration
              </Button>
              
              {profileCheck?.missingCount === 0 && (
                <Badge variant="outline" className="self-center">
                  No migration needed
                </Badge>
              )}
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            {result && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Migration Completed</span>
                </div>
                <div className="text-sm space-y-1">
                  <p>• Found {result.missingCount} users without profiles</p>
                  <p>• Created {result.created} new profiles</p>
                  <p>• {result.remainingMissing} profiles still missing</p>
                </div>

                {result.missingUsers.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium text-sm mb-2">Processed Users:</p>
                    <div className="space-y-1">
                      {result.missingUsers.map((user, index) => (
                        <div key={index} className="text-xs bg-white p-2 rounded border">
                          {user.email} ({user.id})
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.latestProfiles.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium text-sm mb-2">Latest Profiles:</p>
                    <div className="space-y-1">
                      {result.latestProfiles.map((profile, index) => (
                        <div key={index} className="text-xs bg-white p-2 rounded border">
                          {profile.username} (created {profile.created})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">About This Migration</h3>
        <p className="text-sm text-muted-foreground">
          This migration fixes the issue where users exist in the auth.users table but don't have 
          corresponding profiles in the public.profiles table. This typically happens when profiles 
          are manually deleted from the database, breaking the signup flow for existing users.
        </p>
      </div>
    </div>
  );
}