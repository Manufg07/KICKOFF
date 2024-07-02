
        // User data object
        const userData = {
            username: "{{username}}",
            email: "{{email}}",
            phone: "{{phone}}",
            fav_team1: "{{fav_team1}}",
            fav_player: "{{fav_player}}"
        };
    
        // Function to load user data into the form
        function loadUserData() {
            document.getElementById('username').value = userData.username;
            document.getElementById('email').value = userData.email;
            document.getElementById('phone').value = userData.phone;
            document.getElementById('fav_team1').value = userData.fav_team1;
            document.getElementById('fav_player').value = userData.fav_player;
        }
    
        function toggleUpdateSection() {
            const updateSection = document.getElementById('updateSection');
            if (updateSection.classList.contains('hidden')) {
                // Fetch user details and pre-fill the form
                fetch('/get-user-details')
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById('username').value = data.username || '';
                        document.getElementById('email').value = data.email || '';
                        document.getElementById('phone').value = data.phone || '';
                        document.getElementById('fav_team1').value = data.fav_team1 || '';
                        document.getElementById('fav_player').value = data.fav_player || '';
                    })
                    .catch(error => console.error('Error fetching user details:', error));
        
                updateSection.classList.remove('hidden');
            } else {
                updateSection.classList.add('hidden');
            }
        }

    function toggleChat() {
        const chatModal = document.getElementById('chatModal');
        chatModal.classList.toggle('hidden');
    }

    function toggleFullScreen() {
        const chatContainer = document.getElementById('chatContainer');
        const fullScreenIcon = document.getElementById('fullScreenIcon');
        chatContainer.classList.toggle('full-screen');
        
        if (chatContainer.classList.contains('full-screen')) {
            fullScreenIcon.classList.remove('fa-expand');
            fullScreenIcon.classList.add('fa-compress');
        } else {
            fullScreenIcon.classList.remove('fa-compress');
            fullScreenIcon.classList.add('fa-expand');
        }
    }

    let currentFriend = 'Friend';

    function selectFriend(friend) {
        currentFriend = friend;
        document.getElementById('chatWith').textContent = `Chat with ${friend}`;
        document.getElementById('chatMessages').innerHTML = ''; // Clear previous messages
    }

    function handleSendMessage(event) {
        event.preventDefault();

        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        if (message) {
            const chatContainer = document.getElementById('chatMessages');
            const messageElement = document.createElement('div');
            messageElement.classList.add('flex', 'items-start', 'mt-4');
            messageElement.innerHTML = `
                <img src="https://via.placeholder.com/40" alt="Your Avatar" class="w-10 h-10 rounded-full mr-3">
                <div>
                    <h4 class="text-md font-semibold">You</h4>
                    <p class="text-gray-600">${message}</p>
                    <span class="text-sm text-gray-500">Just now</span>
                </div>
            `;
            chatContainer.appendChild(messageElement);
            chatContainer.scrollTop = chatContainer.scrollHeight;

            messageInput.value = '';
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        const resizable = document.querySelector('.resizable');
        const resizeHandle = resizable.querySelector('.resize-handle');
        
        resizeHandle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);
        });
        
        function resize(e) {
            resizable.style.width = (e.clientX - resizable.offsetLeft) + 'px';
            resizable.style.height = (e.clientY - resizable.offsetTop) + 'px';
        }
        
        function stopResize() {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResize);
        }
    });

    function previewFile(event, previewId) {
        const file = event.target.files[0];
        const preview = document.getElementById(previewId);

        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                if (previewId === 'imagePreview') {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                } else if (previewId === 'videoPreview') {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
        }
    }

    function handleSendMessage(event) {
        event.preventDefault();

        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        if (message) {
            const chatContainer = document.getElementById('chatMessages');
            const messageElement = document.createElement('div');
            messageElement.classList.add('flex', 'items-start', 'mt-4');
            messageElement.innerHTML = `
                <img src="https://via.placeholder.com/40" alt="Your Avatar" class="w-10 h-10 rounded-full mr-3">
                <div>
                    <h4 class="text-md font-semibold">You</h4>
                    <p class="text-gray-600">${message}</p>
                    <span class="text-sm text-gray-500">Just now</span>
                </div>
            `;
            chatContainer.appendChild(messageElement);
            chatContainer.scrollTop = chatContainer.scrollHeight;

            messageInput.value = '';
        }
    }
  

document.addEventListener('DOMContentLoaded', () => {
    const togglePostButton = document.getElementById('togglePostButton');
    const postSection = document.getElementById('postSection');

    if (togglePostButton) {
        togglePostButton.addEventListener('click', () => {
            postSection.classList.toggle('hidden');
        });
    } else {
        console.error('togglePostButton element not found');
    }

    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', handlePost);
    } else {
        console.error('postForm element not found');
    }

    // Fetch initial posts when the page loads
    fetchPosts();
});

// Preview selected image or video
function previewFile(event, previewId) {
    const preview = document.getElementById(previewId);
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = function() {
        if (file.type.startsWith('image/')) {
            preview.src = reader.result;
            preview.style.display = 'block';
        } else if (file.type.startsWith('video/')) {
            preview.src = reader.result;
            preview.style.display = 'block';
        }
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = '';
        preview.style.display = 'none';
    }
}

// Handle post submission
async function handlePost(event) {
    event.preventDefault();

    const postText = document.getElementById('postText').value;
    const postImage = document.getElementById('postImage').files[0];
    const postVideo = document.getElementById('postVideo').files[0];
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No token found in localStorage');
        return;
    }

    const formData = new FormData();
    formData.append('text', postText);
    if (postImage) formData.append('image', postImage);
    if (postVideo) formData.append('video', postVideo);

    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            const post = await response.json();
            // Function to add the post to the homepage
            addPostToHomepage(post);
        } else {
            console.error('Failed to post content', await response.text());
        }
    } catch (error) {
        console.error('Failed to post content', error);
    }
}

// Add a new post to the homepage
function addPostToHomepage(post) {
    const postContainer = document.createElement('div');
    postContainer.className = 'post mb-6 p-4 border rounded-lg shadow-lg';

    if (post.imageUrl) {
        const postImage = document.createElement('img');
        postImage.src = post.imageUrl;
        postImage.alt = 'Post Image';
        postImage.className = 'mb-4 rounded-lg shadow-md hover:shadow-xl transition duration-300';
        postContainer.appendChild(postImage);
    }

    if (post.videoUrl) {
        const postVideo = document.createElement('video');
        postVideo.src = post.videoUrl;
        postVideo.controls = true;
        postVideo.className = 'mt-2 max-w-xs rounded-lg shadow-md';
        postContainer.appendChild(postVideo);
    }

    if (post.text) {
        const postText = document.createElement('p');
        postText.textContent = post.text;
        postText.className = 'text-gray-600';
        postContainer.appendChild(postText);
    }

    const postDetails = document.createElement('div');
    postDetails.className = 'flex justify-between items-center mt-4 border-t pt-4';

    const likeButton = document.createElement('button');
    likeButton.className = 'flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition duration-300';
    likeButton.innerHTML = '<i class="fas fa-thumbs-up"></i><span>Like</span>';
    postDetails.appendChild(likeButton);

    const commentButton = document.createElement('button');
    commentButton.className = 'flex items-center space-x-2 text-gray-600 hover:text-green-600 transition duration-300';
    commentButton.innerHTML = '<i class="fas fa-comment"></i><span>Comment</span>';
    postDetails.appendChild(commentButton);

    const shareButton = document.createElement('button');
    shareButton.className = 'flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition duration-300';
    shareButton.innerHTML = '<i class="fas fa-share"></i><span>Share</span>';
    postDetails.appendChild(shareButton);

    postContainer.appendChild(postDetails);

    const postsContainer = document.getElementById('postsContainer');
    if (postsContainer) {
        postsContainer.insertBefore(postContainer, postsContainer.firstChild);
    } else {
        console.error('No posts container found');
    }
}

// Fetch and display posts
async function fetchPosts(page = 1, limit = 10) {
    try {
        const response = await fetch(`/api/posts?page=${page}&limit=${limit}`);
        const data = await response.json();

        data.posts.forEach(post => addPostToHomepage(post));

        // Handle pagination if necessary
        if (page < data.totalPages) {
            const loadMoreButton = document.createElement('button');
            loadMoreButton.textContent = 'Load More';
            loadMoreButton.className = 'w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg transition duration-300';
            loadMoreButton.onclick = () => {
                loadMoreButton.remove();
                fetchPosts(page + 1, limit);
            };
            document.body.appendChild(loadMoreButton);
        }
    } catch (error) {
        console.error('Failed to fetch posts', error);
    }
}
