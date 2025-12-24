// News feed functionality
document.addEventListener('DOMContentLoaded', async () => {
  await loadNewsFeed();
});

// Load news feed
async function loadNewsFeed() {
  const container = document.getElementById('feed-container');
  container.innerHTML = '<div class="loading-state">Loading feed...</div>';
  
  try {
    // Get all posts
    const { data: posts, error } = await window.supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (posts.length === 0) {
      container.innerHTML = '<div class="empty-state">No posts yet. Check back soon!</div>';
      return;
    }
    
    // Organize posts by month
    const postsByMonth = organizePostsByMonth(posts);
    
    // Get current month
    const currentDate = new Date();
    const currentMonthKey = getMonthKey(currentDate);
    
    // Render feed
    container.innerHTML = '';
    
    // Render current month first
    if (postsByMonth[currentMonthKey]) {
      renderMonthSection(currentMonthKey, postsByMonth[currentMonthKey], false);
    }
    
    // Render archived months
    Object.keys(postsByMonth)
      .filter(key => key !== currentMonthKey)
      .sort((a, b) => b.localeCompare(a))
      .forEach(monthKey => {
        renderMonthSection(monthKey, postsByMonth[monthKey], true);
      });
    
  } catch (error) {
    console.error('Error loading feed:', error);
    container.innerHTML = '<div class="empty-state">Error loading feed. Please try again later.</div>';
  }
}

// Organize posts by month
function organizePostsByMonth(posts) {
  const organized = {};
  
  posts.forEach(post => {
    const monthKey = post.month_key || getMonthKey(new Date(post.created_at));
    if (!organized[monthKey]) {
      organized[monthKey] = [];
    }
    organized[monthKey].push(post);
  });
  
  return organized;
}

// Render month section
function renderMonthSection(monthKey, posts, isArchived) {
  const container = document.getElementById('feed-container');
  const monthName = formatMonthKey(monthKey);
  
  const section = document.createElement('div');
  section.className = 'month-section';
  section.innerHTML = `
    <h2 class="month-header ${isArchived ? 'archived' : ''}">${monthName}</h2>
    <div class="posts-grid">
      ${posts.map(post => renderPostCard(post)).join('')}
    </div>
  `;
  
  container.appendChild(section);
}

// Render post card
function renderPostCard(post) {
  let content = '';
  
  if (post.type === 'image' && post.image_url) {
    content = `<img src="${escapeHtml(post.image_url)}" alt="${escapeHtml(post.title)}" class="post-card-image show">`;
  }
  
  if (post.content) {
    content += `<div class="post-card-content">${escapeHtml(post.content)}</div>`;
  }
  
  if (post.type === 'link' && post.link_url) {
    content += `<a href="${escapeHtml(post.link_url)}" target="_blank" rel="noopener noreferrer" class="post-card-link">Visit Link →</a>`;
  }
  
  if (post.type === 'playlist' && post.playlist_url) {
    content += `<div class="post-card-playlist">
      <a href="${escapeHtml(post.playlist_url)}" target="_blank" rel="noopener noreferrer" class="post-card-link">Listen to Playlist →</a>
    </div>`;
  }
  
  return `
    <div class="post-card">
      <span class="post-type-badge">${post.type}</span>
      <h3 class="post-card-title">${escapeHtml(post.title)}</h3>
      ${content}
      <div class="post-card-meta">${formatDate(post.created_at)}</div>
    </div>
  `;
}

// Helper functions
function getMonthKey(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}-${String(month).padStart(2, '0')}`;
}

function formatMonthKey(monthKey) {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
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
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

