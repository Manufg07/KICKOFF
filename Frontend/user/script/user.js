// // User data object
// const userData = {
//     username: "{{username}}",
//     email: "{{email}}",
//     phone: "{{phone}}",
//     fav_team1: "{{fav_team1}}",
//     fav_player: "{{fav_player}}"
// };

// // Function to load user data into the form
// function loadUserData() {
//     document.getElementById('username').value = userData.username;
//     document.getElementById('email').value = userData.email;
//     document.getElementById('phone').value = userData.phone;
//     document.getElementById('fav_team1').value = userData.fav_team1;
//     document.getElementById('fav_player').value = userData.fav_player;
// }

// // Toggle update section and fetch user details
// function toggleUpdateSection() {
//     const updateSection = document.getElementById('updateSection');
//     if (updateSection.classList.contains('hidden')) {
//         fetch('/get-user-details')
//             .then(response => response.json())
//             .then(data => {
//                 document.getElementById('username').value = data.username || '';
//                 document.getElementById('email').value = data.email || '';
//                 document.getElementById('phone').value = data.phone || '';
//                 document.getElementById('fav_team1').value = data.fav_team1 || '';
//                 document.getElementById('fav_player').value = data.fav_player || '';
//             })
//             .catch(error => console.error('Error fetching user details:', error));
        
//         updateSection.classList.remove('hidden');
//     } else {
//         updateSection.classList.add('hidden');
//     }
// }

// // Toggle chat modal
// function toggleChat() {
//     const chatModal = document.getElementById('chatModal');
//     chatModal.classList.toggle('hidden');
// }

// // Toggle full screen mode for chat container
// function toggleFullScreen() {
//     const chatContainer = document.getElementById('chatContainer');
//     const fullScreenIcon = document.getElementById('fullScreenIcon');
//     chatContainer.classList.toggle('full-screen');
    
//     if (chatContainer.classList.contains('full-screen')) {
//         fullScreenIcon.classList.remove('fa-expand');
//         fullScreenIcon.classList.add('fa-compress');
//     } else {
//         fullScreenIcon.classList.remove('fa-compress');
//         fullScreenIcon.classList.add('fa-expand');
//     }
// }

// // Select a friend to chat with
// let currentFriend = 'Friend';
// function selectFriend(friend) {
//     currentFriend = friend;
//     document.getElementById('chatWith').textContent = `Chat with ${friend}`;
//     document.getElementById('chatMessages').innerHTML = ''; // Clear previous messages
// }

// // Handle sending a message in the chat
// function handleSendMessage(event) {
//     event.preventDefault();

//     const messageInput = document.getElementById('messageInput');
//     const message = messageInput.value.trim();
//     if (message) {
//         const chatContainer = document.getElementById('chatMessages');
//         const messageElement = document.createElement('div');
//         messageElement.classList.add('flex', 'items-start', 'mt-4');
//         messageElement.innerHTML = `
//             <img src="https://via.placeholder.com/40" alt="Your Avatar" class="w-10 h-10 rounded-full mr-3">
//             <div>
//                 <h4 class="text-md font-semibold">You</h4>
//                 <p class="text-gray-600">${message}</p>
//                 <span class="text-sm text-gray-500">Just now</span>
//             </div>
//         `;
//         chatContainer.appendChild(messageElement);
//         chatContainer.scrollTop = chatContainer.scrollHeight;

//         messageInput.value = '';
//     }
// }

// // Make chat container resizable
// document.addEventListener('DOMContentLoaded', function() {
//     const resizable = document.querySelector('.resizable');
//     const resizeHandle = resizable.querySelector('.resize-handle');
    
//     if (resizeHandle) {
//         resizeHandle.addEventListener('mousedown', function(e) {
//             e.preventDefault();
//             window.addEventListener('mousemove', resize);
//             window.addEventListener('mouseup', stopResize);
//         });

//         function resize(e) {
//             resizable.style.width = (e.clientX - resizable.offsetLeft) + 'px';
//             resizable.style.height = (e.clientY - resizable.offsetTop) + 'px';
//         }

//         function stopResize() {
//             window.removeEventListener('mousemove', resize);
//             window.removeEventListener('mouseup', stopResize);
//         }
//     }
// });

// // Preview selected image or video
// function previewFile(event, previewId) {
//     const file = event.target.files[0];
//     const preview = document.getElementById(previewId);

//     if (file && preview) {
//         const reader = new FileReader();
//         reader.onload = function(e) {
//             preview.src = e.target.result;
//             preview.style.display = 'block';
//         };
//         reader.readAsDataURL(file);
//     }
// }

// document.getElementById('togglePostButton').addEventListener('click', () => {
//     const postSection = document.getElementById('postSection');
//     postSection.classList.toggle('hidden');
// });

// document.getElementById('postForm').addEventListener('submit', async (event) => {
//     event.preventDefault();
    
//     const formData = new FormData();
//     formData.append('text', document.getElementById('postText').value);
//     formData.append('image', document.getElementById('postImage').files[0]);
//     formData.append('video', document.getElementById('postVideo').files[0]);

//     const response = await fetch('/api/post', {
//         method: 'POST',
//         body: formData
//     });

//     if (response.ok) {
//         document.getElementById('postText').value = '';
//         document.getElementById('postImage').value = '';
//         document.getElementById('postVideo').value = '';
//         loadPosts();
//     } else {
//         alert('Failed to post content');
//     }
// });

// function previewFile(event, previewId) {
//     const file = event.target.files[0];
//     const preview = document.getElementById(previewId);
//     const reader = new FileReader();

//     reader.onloadend = () => {
//         if (file.type.startsWith('image/')) {
//             preview.src = reader.result;
//             preview.style.display = 'block';
//         } else if (file.type.startsWith('video/')) {
//             preview.src = reader.result;
//             preview.style.display = 'block';
//         }
//     };

//     if (file) {
//         reader.readAsDataURL(file);
//     }
// }

// async function loadPosts() {
//     const response = await fetch('/api/posts');
//     const posts = await response.json();
//     const postsContainer = document.getElementById('postsContainer');

//     postsContainer.innerHTML = '';
//     posts.forEach(post => {
//         const postElement = document.createElement('div');
//         postElement.classList.add('bg-gray-100', 'p-4', 'rounded-lg', 'shadow-md', 'mb-4');

//         const textElement = document.createElement('p');
//         textElement.textContent = post.text;
//         postElement.appendChild(textElement);

//         if (post.imageUrl) {
//             const imageElement = document.createElement('img');
//             imageElement.src = `/${post.imageUrl}`;
//             imageElement.classList.add('mt-2', 'max-w-xs', 'rounded-lg', 'shadow-md');
//             postElement.appendChild(imageElement);
//         }

//         if (post.videoUrl) {
//             const videoElement = document.createElement('video');
//             videoElement.src = `/${post.videoUrl}`;
//             videoElement.controls = true;
//             videoElement.classList.add('mt-2', 'max-w-xs', 'rounded-lg', 'shadow-md');
//             postElement.appendChild(videoElement);
//         }

//         const userElement = document.createElement('p');
//         userElement.classList.add('text-sm', 'text-gray-600', 'mt-2');
//         userElement.textContent = `Posted by: ${post.userId.username} on ${new Date(post.createdAt).toLocaleString()}`;
//         postElement.appendChild(userElement);

//         postsContainer.appendChild(postElement);
//     });
// }

// // Initial load of posts
// loadPosts();
