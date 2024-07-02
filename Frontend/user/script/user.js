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

// Toggle update section and fetch user details
function toggleUpdateSection() {
    const updateSection = document.getElementById('updateSection');
    if (updateSection.classList.contains('hidden')) {
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

// Toggle chat modal
function toggleChat() {
    const chatModal = document.getElementById('chatModal');
    chatModal.classList.toggle('hidden');
}

// Toggle full screen mode for chat container
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

// Select a friend to chat with
let currentFriend = 'Friend';
function selectFriend(friend) {
    currentFriend = friend;
    document.getElementById('chatWith').textContent = `Chat with ${friend}`;
    document.getElementById('chatMessages').innerHTML = ''; // Clear previous messages
}

// Handle sending a message in the chat
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

// Make chat container resizable
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

// Preview selected image or video
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

// Toggle post section and handle post form submission
document.addEventListener('DOMContentLoaded', function() {
    const togglePostButton = document.getElementById('togglePostButton');
    const postSection = document.getElementById('postSection');
    const postForm = document.getElementById('postForm');

    if (togglePostButton && postSection) {
        togglePostButton.addEventListener('click', () => {
            postSection.classList.toggle('hidden');
        });
    }

    if (postForm) {
        postForm.addEventListener('submit', handlePost);
    }

    // Fetch initial posts when the page loads
    fetchPosts();
});

async function handlePost(event) {
    event.preventDefault();

    const postText = document.getElementById('postText').value;
    const postImage = document.getElementById('postImage').files[0];
    const postVideo = document.getElementById('postVideo').files[0];
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No token found in localStorage');
        // Redirect to login page or show an error message
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
            addPostToHomepage(post);
            document.getElementById('postForm').reset();
        } else {
            console.error('Failed to post content', await response.text());
        }
    } catch (error) {
        console.error('Failed to post content', error);
    }
}

// In user.js or your main frontend JavaScript file

async function fetchPosts(page = 1, limit = 10) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No token found, user might not be logged in');
        // Maybe redirect to login page or show a message to the user
        return;
    }

    try {
        const response = await fetch(`/api/posts?page=${page}&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Process the data and update the UI
        const postsContainer = document.getElementById('postsContainer');
        postsContainer.innerHTML = ''; // Clear existing posts
        data.posts.forEach(post => addPostToHomepage(post));

        // Handle pagination if necessary
        // ...
    } catch (error) {
        console.error('Failed to fetch posts', error);
    }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', fetchPosts);
function addPostToHomepage(post) {
    const postsContainer = document.getElementById('postsContainer');
    const postElement = document.createElement('div');
    postElement.className = 'mb-6 p-4 bg-white rounded-lg shadow-md';

    let postContent = `
        <div class="flex items-center mb-4">
            <img src="${post.authorAvatar || 'https://via.placeholder.com/40'}" alt="${post.authorName}" class="w-10 h-10 rounded-full mr-3">
            <div>
                <h4 class="font-semibold">${post.authorName}</h4>
                <span class="text-gray-500 text-sm">${new Date(post.createdAt).toLocaleString()}</span>
            </div>
        </div>
        <p class="mb-4">${post.text}</p>
    `;

    if (post.imageUrl) {
        postContent += `<img src="${post.imageUrl}" alt="Post image" class="mb-4 rounded-lg max-w-full h-auto">`;
    }

    if (post.videoUrl) {
        postContent += `<video src="${post.videoUrl}" controls class="mb-4 rounded-lg max-w-full h-auto"></video>`;
    }

    postContent += `
        <div class="flex justify-between items-center">
            <button class="text-blue-600 hover:text-blue-800">Like</button>
            <button class="text-blue-600 hover:text-blue-800">Comment</button>
            <button class="text-blue-600 hover:text-blue-800">Share</button>
        </div>
    `;

    postElement.innerHTML = postContent;
    postsContainer.insertBefore(postElement, postsContainer.firstChild);
}
