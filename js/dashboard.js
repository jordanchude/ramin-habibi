// Dashboard functionality
let currentPostType = 'text';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
  // Check authentication
  const session = await window.checkAuth();
  if (!session) {
    window.location.href = 'admin/login.html';
    return;
  }

  // Setup post type selector
  setupPostTypeSelector();
  
  // Setup form submission
  setupFormSubmission();
  
  // Load existing posts
  loadPosts();
});

// Setup post type selector
function setupPostTypeSelector() {
  const buttons = document.querySelectorAll('.post-type-button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      currentPostType = button.dataset.type;
      updateFormFields();
    });
  });
}

// Update form fields based on post type
function updateFormFields() {
  const contentWrapper = document.getElementById('content-wrapper');
  const imageWrapper = document.getElementById('image-wrapper');
  const linkWrapper = document.getElementById('link-wrapper');
  const playlistWrapper = document.getElementById('playlist-wrapper');
  
  // Hide all wrappers
  contentWrapper.style.display = 'none';
  imageWrapper.style.display = 'none';
  linkWrapper.style.display = 'none';
  playlistWrapper.style.display = 'none';
  
  // Show relevant wrapper
  switch(currentPostType) {
    case 'text':
      contentWrapper.style.display = 'block';
      break;
    case 'image':
      contentWrapper.style.display = 'block';
      imageWrapper.style.display = 'block';
      break;
    case 'link':
      contentWrapper.style.display = 'block';
      linkWrapper.style.display = 'block';
      break;
    case 'playlist':
      contentWrapper.style.display = 'block';
      playlistWrapper.style.display = 'block';
      break;
  }
}

// Setup image preview
document.getElementById('post-image')?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById('image-preview');
      preview.src = e.target.result;
      preview.classList.add('show');
    };
    reader.readAsDataURL(file);
  }
});

// Setup form submission
function setupFormSubmission() {
  const form = document.getElementById('post-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const imageFile = document.getElementById('post-image')?.files[0];
    const link = document.getElementById('post-link')?.value;
    const playlist = document.getElementById('post-playlist')?.value;
    
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    // Hide messages
    successMessage.classList.remove('show');
    errorMessage.classList.remove('show');
    
    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `posts/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await window.supabase.storage
          .from('post-images')
          .upload(filePath, imageFile);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = window.supabase.storage
          .from('post-images')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }
      
      // Create post data
      const postData = {
        title,
        content,
        type: currentPostType,
        image_url: imageUrl,
        link_url: link || null,
        playlist_url: playlist || null,
        created_at: new Date().toISOString(),
        month_key: getMonthKey(new Date())
      };
      
      // Insert post
      const { data, error } = await window.supabase
        .from('posts')
        .insert([postData])
        .select();
      
      if (error) throw error;
      
      // Show success message
      successMessage.textContent = 'Post published successfully!';
      successMessage.classList.add('show');
      
      // Reset form
      form.reset();
      document.getElementById('image-preview')?.classList.remove('show');
      
      // Reload posts
      loadPosts();
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error creating post:', error);
      errorMessage.textContent = error.message || 'Failed to create post. Please try again.';
      errorMessage.classList.add('show');
    }
  });
}

// Load posts
async function loadPosts() {
  const container = document.getElementById('posts-container');
  container.innerHTML = '<p style="text-align: center; font-style: italic; color: var(--dark); opacity: 0.6;">Loading posts...</p>';
  
  try {
    const { data: posts, error } = await window.supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    
    if (posts.length === 0) {
      container.innerHTML = '<p style="text-align: center; font-style: italic; color: var(--dark); opacity: 0.6;">No posts yet. Create your first post above!</p>';
      return;
    }
    
    container.innerHTML = posts.map(post => `
      <div class="post-item">
        <div class="post-info">
          <div class="post-title">${escapeHtml(post.title)}</div>
          <div class="post-meta">${formatDate(post.created_at)} • ${post.type}</div>
        </div>
        <div class="post-actions">
          <button class="button button-small button-danger" onclick="deletePost('${post.id}')">Delete</button>
        </div>
      </div>
    `).join('');
    
  } catch (error) {
    console.error('Error loading posts:', error);
    container.innerHTML = '<p style="text-align: center; font-style: italic; color: var(--dark); opacity: 0.6;">Error loading posts. Please refresh the page.</p>';
  }
}

// Delete post
async function deletePost(postId) {
  if (!confirm('Are you sure you want to delete this post?')) {
    return;
  }
  
  try {
    const { error } = await window.supabase
      .from('posts')
      .delete()
      .eq('id', postId);
    
    if (error) throw error;
    
    loadPosts();
  } catch (error) {
    console.error('Error deleting post:', error);
    alert('Failed to delete post. Please try again.');
  }
}

// Make deletePost available globally
window.deletePost = deletePost;

// Helper functions
function getMonthKey(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}-${String(month).padStart(2, '0')}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

