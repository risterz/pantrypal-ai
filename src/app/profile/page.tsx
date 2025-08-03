'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldAlert, UserCircle, Save, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  // Add CSS to fix Select dropdown positioning
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      [data-radix-select-content] {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
      [data-radix-select-content][data-state="open"] {
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const [username, setUsername] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState<string>('none');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }
        
        setUser(user);
        
        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        if (profileData) {
          setProfile(profileData);
          setUsername(profileData.username || '');
          if (profileData.dietary_preferences && profileData.dietary_preferences.length > 0) {
            // Take the first preference as the single selection
            const firstPreference = profileData.dietary_preferences[0];
            // Map database values to display values
            const preferenceMap: { [key: string]: string } = {
              'vegetarian': 'vegetarian',
              'vegan': 'vegan',
              'glutenFree': 'gluten-free',
              'dairyFree': 'dairy-free',
              'keto': 'ketogenic',
              'paleo': 'paleo'
            };
            setDietaryPreference(preferenceMap[firstPreference] || 'none');
          } else {
            setDietaryPreference('none');
          }
        } else {
          // Profile doesn't exist, create one automatically
          console.log('Profile not found, creating new profile...');
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              username: `user_${user.id.substring(0, 8)}`,
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
              avatar_url: user.user_metadata?.avatar_url || null,
              role: 'user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            toast.error('Failed to create profile. Please try refreshing the page.');
          } else {
            console.log('Profile created successfully:', newProfile);
            setProfile(newProfile);
            setUsername(newProfile.username || '');
            setDietaryPreference('none');
            toast.success('Profile created successfully!');
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [router]);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);

      // Convert single dietary preference to array for database storage
      const preferenceMap: { [key: string]: string } = {
        'vegetarian': 'vegetarian',
        'vegan': 'vegan',
        'gluten-free': 'glutenFree',
        'dairy-free': 'dairyFree',
        'ketogenic': 'keto',
        'paleo': 'paleo'
      };

      // Create PostgreSQL array format for dietary preferences
      const preferencesArray = dietaryPreference === 'none' ? null : [preferenceMap[dietaryPreference]];

      const updates = {
        id: user.id,
        username: username.trim() || null,
        dietary_preferences: preferencesArray,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;

      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      // Show detailed error message for debugging
      const errorMessage = error.message || JSON.stringify(error);
      toast.error(`Failed to update profile: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-6">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-60 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please sign in to view your profile.</p>
          <Button onClick={() => router.push('/login')} className="bg-[#FF6B6B] hover:bg-[#ff5252]">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

      <div className="space-y-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-[#FF6B6B]" />
              Account Information
            </CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={user.email} 
                disabled 
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            
            <div>
              <Label htmlFor="username">Username (Optional)</Label>
              <Input 
                id="username" 
                placeholder="Enter a username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dietary Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Dietary Preferences</CardTitle>
            <CardDescription>Select your dietary preference for recipe suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="dietary-preference">Dietary Preference</Label>
              <Select value={dietaryPreference} onValueChange={setDietaryPreference}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a dietary preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Preference</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                  <SelectItem value="dairy-free">Dairy-Free</SelectItem>
                  <SelectItem value="ketogenic">Ketogenic</SelectItem>
                  <SelectItem value="paleo">Paleo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
            <Button 
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="bg-[#FF6B6B] hover:bg-[#ff5252] flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
      </div>
      </div>
    </div>
  );
}