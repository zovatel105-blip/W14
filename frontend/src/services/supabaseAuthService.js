import { supabase } from '../lib/supabase';

class SupabaseAuthService {
  
  // Sign up new user
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            display_name: userData.display_name || userData.username,
            avatar_url: userData.avatar_url || null
          }
        }
      });

      if (error) throw error;

      // If user is created successfully, also create profile
      if (data.user) {
        await this.createUserProfile(data.user, userData);
      }

      return { user: data.user, session: data.session };
    } catch (error) {
      console.error('❌ Supabase SignUp Error:', error);
      throw error;
    }
  }

  // Sign in user
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { user: data.user, session: data.session };
    } catch (error) {
      console.error('❌ Supabase SignIn Error:', error);
      throw error;
    }
  }

  // Sign out user
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('❌ Supabase SignOut Error:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('❌ Get Current User Error:', error);
      throw error;
    }
  }

  // Get current session
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('❌ Get Current Session Error:', error);
      throw error;
    }
  }

  // Create user profile in profiles table
  async createUserProfile(user, userData = {}) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: userData.username || `user_${user.id.substring(0, 8)}`,
          display_name: userData.display_name || userData.username || 'New User',
          bio: userData.bio || '',
          avatar_url: userData.avatar_url || null,
          is_verified: false,
          followers_count: 0,
          following_count: 0,
          polls_count: 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Create User Profile Error:', error);
      throw error;
    }
  }

  // Get user profile by ID
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Get User Profile Error:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Update User Profile Error:', error);
      throw error;
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Reset password
  async resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Reset Password Error:', error);
      throw error;
    }
  }

  // Update password
  async updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Update Password Error:', error);
      throw error;
    }
  }
}

export default new SupabaseAuthService();