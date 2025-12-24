// Supabase configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
// Wait for Supabase library to load, then initialize
(function() {
  function initSupabase() {
    // Check if Supabase library is available
    if (typeof window.supabaseLib !== 'undefined' && window.supabaseLib.createClient) {
      const supabase = window.supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      window.supabase = supabase;
      return supabase;
    } else {
      // Retry after a short delay if not loaded yet
      setTimeout(initSupabase, 100);
      return null;
    }
  }
  
  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
  } else {
    initSupabase();
  }
})();

// Check authentication status
async function checkAuth() {
  if (!window.supabase) {
    console.error('Supabase not initialized');
    return null;
  }
  const { data: { session } } = await window.supabase.auth.getSession();
  return session;
}

// Get current user
async function getCurrentUser() {
  if (!window.supabase) {
    console.error('Supabase not initialized');
    return null;
  }
  const { data: { user } } = await window.supabase.auth.getUser();
  return user;
}

// Logout function
async function handleLogout() {
  if (!window.supabase) {
    console.error('Supabase not initialized');
    return;
  }
  const { error } = await window.supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error);
    alert('Error logging out. Please try again.');
  } else {
    window.location.href = 'admin/login.html';
  }
}

// Make functions available globally
window.checkAuth = checkAuth;
window.getCurrentUser = getCurrentUser;
window.handleLogout = handleLogout;

