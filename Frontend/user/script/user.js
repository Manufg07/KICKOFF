// document.addEventListener('DOMContentLoaded', () => {
//     fetch('/api/user')
//         .then(response => response.json())
//         .then(user => {
//             if (user.username) {
//                 document.getElementById('username').textContent = user.username;
//             }
//         })
//         .catch(error => console.error('Error fetching user data:', error));
// });


//  JavaScript for handling the form and previewing content 
    //  function toggleUpdateSection() {
    //     const updateSection = document.getElementById('updateSection');
    //     updateSection.classList.toggle('hidden');
    // }
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
    
        // Function to toggle the update section
        function toggleUpdateSection() {
            const updateSection = document.getElementById('updateSection');
            updateSection.classList.toggle('hidden');
        
            if (!updateSection.classList.contains('hidden')) {
                loadUserData();
            }
        }
    
        // Add event listener for form submission
        document.getElementById('updateForm').addEventListener('submit', function(event) {
            event.preventDefault();
            // You can add client-side validation here if needed
            this.submit();
        });

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
    function togglePostSection() {
        const postSection = document.getElementById('postSection');
        if (postSection.classList.contains('hidden')) {
            postSection.classList.remove('hidden');
        } else {
            postSection.classList.add('hidden');
        }
    }

    function handlePost(event) {
        event.preventDefault();

        const postText = document.getElementById('postText').value;
        const postImage = document.getElementById('postImage').files[0];
        const postVideo = document.getElementById('postVideo').files[0];

        const postData = {
            text: postText,
            image: postImage ? URL.createObjectURL(postImage) : null,
            video: postVideo ? URL.createObjectURL(postVideo) : null
        };

        console.log('Posted Data:', postData);

        // Optionally, add code to send postData to the server or display it on the page
    }


