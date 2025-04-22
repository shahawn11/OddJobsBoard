
// Define the API Gateway URL
   // Replace with your actual API URL
   const apiUrl = process.env.JOB_API_URL;

// Function to fetch and display posted jobs
async function displayJobs() {
    try {
    const response = await fetch(apiUrl + '/jobs');
    const data = await response.json();

    // Parse the JSON-encoded string into a JavaScript object
    const jobs = JSON.parse(data.body);

    // Check if jobs is an array
    if (Array.isArray(jobs)) {
        const jobList = document.getElementById('jobList');
        jobList.innerHTML = '';

        const userId = localStorage.getItem('userId');
        
        // Get all chat elements
        const chatElements = document.querySelectorAll('.chat');

        jobs.forEach(job => {
            if (job.posterId === userId) {
                // Skip creating the button if the user posted the job
                const jobElement = document.createElement('div');
                jobElement.classList.add('job');
                jobElement.innerHTML = `
                    <h3>${job.title}</h3>
                    <p>${job.description}</p>
                    <p><strong>Location:</strong> ${job.location}</p>
                    <button disabled class="job-accepted-btn">Job Posted</button>
                    <button onclick="deleteJob('${job.jobId}')" class="delete-job-btn">Remove</button>
                `;
                jobList.appendChild(jobElement);
            } else {
            const jobElement = document.createElement('div');
            jobElement.classList.add('job');
            jobElement.innerHTML = `
                <h3>${job.title}</h3>
                <p>${job.description}</p>
                <p><strong>Location:</strong> ${job.location}</p>
                ${isJobAccepted(job.jobId, chatElements) ? '<button disabled>Job Accepted</button>' : '<button onclick="acceptJob(\'' + job.jobId + '\')">Accept Job</button>'}
            `;
            jobList.appendChild(jobElement);
            }
        });
    } else {
        console.error('Invalid response format: jobs is not an array');
    }
    } catch (error) {
    console.error('Error fetching jobs:', error);
    }
}

// Function to check if a job has been accepted based on chat elements
function isJobAccepted(jobId, chatElements) {
    for (const chatElement of chatElements) {
    if (chatElement.dataset.jobId === jobId) {
        return true;
    }
    }
    return false;
}


// Function to search for jobs
async function searchJobs() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    const response = await fetch(apiUrl + '/jobs');
    const data = await response.json();

    const allJobs = JSON.parse(data.body);

    const searchResults = allJobs.filter(job => {
        return job.title.toLowerCase().includes(searchInput) ||
            job.description.toLowerCase().includes(searchInput) ||
            job.location.toLowerCase().includes(searchInput);
    });

    const jobList = document.getElementById('jobList');
    jobList.innerHTML = '';

    const userId = localStorage.getItem('userId');
    
    // Get all chat elements
    const chatElements = document.querySelectorAll('.chat');

    searchResults.forEach(job => {
        if (job.posterId === userId) {
            // Skip creating the button if the user posted the job
            const jobElement = document.createElement('div');
            jobElement.classList.add('job');
            jobElement.innerHTML = `
                <h3>${job.title}</h3>
                <p>${job.description}</p>
                <p><strong>Location:</strong> ${job.location}</p>
                <button disabled class="job-accepted-btn">Job Posted</button>
                <button onclick="deleteJob('${job.jobId}')" class="delete-job-btn">Remove</button>
            `;
            jobList.appendChild(jobElement);
         } else {
        const jobElement = document.createElement('div');
        jobElement.classList.add('job');
        jobElement.innerHTML = `
            <h3>${job.title}</h3>
            <p>${job.description}</p>
            <p><strong>Location:</strong> ${job.location}</p>
            ${isJobAccepted(job.jobId, chatElements) ? '<button disabled>Job Accepted</button>' : '<button onclick="acceptJob(\'' + job.jobId + '\')">Accept Job</button>'}
        `;
        jobList.appendChild(jobElement);
        }
    });
}

// Function to submit a new job
async function postJob(event) {
    // Fetch the session token from local storage
    const sessionToken = localStorage.getItem('token');

    // Check if session token exists
    if (!sessionToken) {
    console.error('Session token not found');
    window.alert("Please log in");
    window.location.href = 'login.html';
    return; // Exit function if session token is not found
    }

    // Extract userId from session token
    const userId = localStorage.getItem('userId');

    // Check if userId was successfully extracted
    if (!userId) {
    console.error('Unable to extract userId from token');
    window.alert("Please log in");
    window.location.href = 'login.html';
    return; // Exit function if userId extraction fails
    }

    // Get job details from the form or any other source
    const jobTitle = document.getElementById('jobTitle').value;
    const jobDescription = document.getElementById('jobDescription').value;
    const jobLocation = document.getElementById('jobLocation').value;

    // Prepare the request body including userId
    const requestBody = {
    userId: userId,
    title: jobTitle,
    description: jobDescription,
    location: jobLocation
    // Add more fields as needed
};
    const response = await fetch(apiUrl + '/jobs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
        });

    if (response.ok) {
        // Job posted successfully, refresh job list
        document.getElementById('postJobForm').reset();
        await displayJobs();
    } else {
        alert('Failed to post job');
    }
}

// Function to validate job input length
function validateJobInput() {
    const jobTitle = document.getElementById('jobTitle').value;
    const jobDescription = document.getElementById('jobDescription').value;
    const jobLocation = document.getElementById('jobLocation').value;

    if (jobTitle.length > 30) {
    alert('Job title must be 30 characters or less.');
    return false;
    }

    if (jobDescription.length > 100) {
    alert('Job description must be 100 characters or less.');
    return false;
    }

    if (jobLocation.length > 30) {
    alert('Job location must be 30 characters or less.');
    return false;
    }

    return true;
}



// Function to accept a job
async function acceptJob(jobId) {
    const sessionToken = localStorage.getItem('token');

    // Check if session token exists
    if (!sessionToken) {
    console.error('Session token not found');
    window.location.href = 'login.html';
    return; // Exit function if session token is not found
    }

    // Extract userId from session token
    const userId = localStorage.getItem('userId');

    const response = await fetch(apiUrl + `/jobs/${jobId}/accept`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        userId: localStorage.getItem('userId'), // Include the user ID in the request body
        jobId: jobId // Include the job ID in the request body
    })
    });

    if (response.ok) {
    const jobData = await response.json();
    const body = JSON.parse(jobData.body); 
    const chatId = body.chatId;
    const jobTitle = body.title;
    // Create a chat with the job poster
    //createChat(chatId, jobTitle, jobId);
    openChatbox(chatId,jobTitle);
    displayChats(userId);
    displayJobs();
    alert('Job accepted');
    } else {
    alert('Failed to accept job');
    }
}

// Function to delete a job
async function deleteJob(jobId) {
try {
const sessionToken = localStorage.getItem('token');

// Check if session token exists
if (!sessionToken) {
    console.error('Session token not found');
    window.location.href = 'login.html';
    return; // Exit function if session token is not found
}

// Extract userId from session token
const userId = localStorage.getItem('userId');

const response = await fetch(apiUrl + `/jobs/${jobId}`, {
    method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId: userId }) // Include the userId in the request body for validation
});

if (response.ok) {
    // Job deleted successfully, refresh job list
    await displayJobs();
    alert('Job deleted successfully');
} else {
    // Failed to delete job
    console.error('Failed to delete job:', response.status);
    alert('Failed to delete job. Please try again later.');
}
} catch (error) {
console.error('Error deleting job:', error);
alert('An unexpected error occurred while deleting the job.');
}
}



// Function to create a chat with the job poster
function createChat(chatId, jobTitle, jobId) {
    const chatWindow = document.getElementById('chatWindow');
    const chatElement = document.createElement('div');
    chatElement.classList.add('chat');
    chatElement.dataset.chatId = chatId; // Set the data-chatId attribute
    chatElement.dataset.jobTitle = jobTitle;
    chatElement.dataset.jobId = jobId;
    chatElement.innerHTML = `
    <h3>${jobTitle}
    <button onclick="deleteChat('${chatId}')" class="delete-chat-btn">X</button>
    </h3>
    </div>
`;

// Add event listener to open the chatbox when clicked
chatElement.addEventListener('click', () => {
    const chatElement = event.target.closest('.chat')
    const chatId = chatElement.dataset.chatId;
    const jobTitle = chatElement.dataset.jobTitle;

    openChatbox(chatId, jobTitle);
});

chatWindow.appendChild(chatElement);
}


// Function to display a list of chats in the chat window
async function displayChats(userId) {
try {
// Fetch user's chats
const response = await fetch(apiUrl + `/user/${userId}/chats`);
const chats = await response.json();

const chatWindow = document.getElementById('chatWindow');
// Clear previous chats except for the chat window title
const chatMessages = chatWindow.getElementsByClassName('chat');
Array.from(chatMessages).forEach(chatMessage => {
    if (!chatMessage.classList.contains('chat-window__title')) {
        chatMessage.remove();
    }
});
if (chats.length > 0) {
    chatWindow.style.visibility="visible";
}
chats.forEach(chat => {
    createChat(chat.chatId, chat.title, chat.jobId); // Call createChat function for each chat
    });
} catch (error) {
console.error('Error displaying chats:', error);
}
}


// Display the form to add a job when the "Add a Job" button is clicked
document.getElementById('addJobBtn').addEventListener('click', function() {
    document.getElementById('postJobForm').classList.toggle('hidden');
});

// Display posted jobs when the page loads
window.onload = displayJobs;

if (localStorage.getItem('token')) {
    const userId = localStorage.getItem('userId');
    displayChats(userId);
}

// Attach event listener to the form submission for validation and posting job
document.getElementById('postJobForm').addEventListener('submit', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Validate job input
    if (validateJobInput()) {
        // If validation passes, proceed with posting the job
        postJob(event);
        } else {
        // If validation fails, do not post the job
        console.log('Job validation failed. Posting job aborted.');
        }
});


document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.keyCode === 13) { // Check if Enter key was pressed
        searchJobs(); // Call the search function
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Check if the user is logged in
    const token = localStorage.getItem('token');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');

    if (token) {
    // User is logged in
    loginButton.style.display = 'none'; // Hide login button
    logoutButton.style.display = 'block'; // Show logout button
    } else {
    // User is not logged in
    loginButton.style.display = 'block'; // Show login button
    logoutButton.style.display = 'none'; // Hide logout button
    }
});

// Function to delete a job
async function deleteChat(chatId) {
    try {
    const sessionToken = localStorage.getItem('token');

    // Check if session token exists
    if (!sessionToken) {
        console.error('Session token not found');
        window.location.href = 'login.html';
        return; // Exit function if session token is not found
    }

    // Extract userId from session token
    const userId = localStorage.getItem('userId');

    const response = await fetch(apiUrl + `/chat/${chatId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userId }) // Include the userId in the request body for validation
    });

    if (response.ok) {
        // chat deleted successfully, refresh chat window
        alert('chat deleted successfully');
        await location.reload();
    } else {
        // Failed to delete job
        console.error('Failed to delete job:', response.status);
        alert('Failed to delete chat. Please try again later.');
    }
    } catch (error) {
    console.error('Error deleting chat:', error);
    alert('An unexpected error occurred while deleting the chat.');
    }
}

// Function to handle logout
function logout() {
    // Remove token from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('userId')

    // Redirect to login page or perform other actions
    window.location.href = 'login.html';
}

// Function to fetch and display chat messages for a specific chat
async function fetchChatMessages(chatId) {
    try {
    const response = await fetch(apiUrl + `/chat/${chatId}/messages`);
    if (!response.ok) {
        throw new Error('Failed to fetch chat messages');
    }

    const messages = await response.json(); // Response is an array of message objects

    // Get the chatbox messages container
    const chatboxMessages = document.querySelector('.chatbox-messages');

    // Clear any existing messages
    chatboxMessages.innerHTML = '';

    // Render messages in the chatbox
    if (messages.length > 0) {
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.textContent = message.content;

            // Add a CSS class based on whether the message is sent by the current user or another user
            if (message.senderId === localStorage.getItem('userId')) {
                messageElement.classList.add('sent-by-you');
            } else {
                messageElement.classList.add('sent-by-other');
            }

            chatboxMessages.appendChild(messageElement);
        });
    }
    } catch (error) {
    console.error('Error fetching chat messages:', error);
    }
}



// Function to send a message to the chat room
async function sendMessage(chatId, text) {
    try {
    // Retrieve userId from local storage
    const userId = localStorage.getItem('userId');

    // Check if userId exists
    if (!userId) {
        console.error('User ID not found in local storage');
        return;
    }

    const response = await fetch(apiUrl + `/chat/${chatId}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chatId, userId, content: text }) // Include chatId, userId, and content in the request body
    });

    if (response.ok) {
        const { message } = await response.json(); // Destructure the response object to extract the message
        // Display the sent message in the chatbox
        const chatboxMessages = document.querySelector('.chatbox-messages');
        const messageElement = document.createElement('div');
        messageElement.textContent = text;
        await fetchChatMessages(chatId);
        // Scroll to the bottom of the chat messages container
        chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
    } else {
        console.error('Failed to send message:', response.status);
        alert('Failed to send message. Please try again later.');
    }
    } catch (error) {
    console.error('Error sending message:', error);
    alert('An unexpected error occurred while sending the message.');
    }
}


// Function to display the chatbox with messages for a specific chat
async function openChatbox(chatId, jobTitle) {
    const existingChatbox = document.querySelector('.chatbox');
    if (existingChatbox) {
    existingChatbox.remove();
    }

    // Create the chatbox elements
    const chatbox = document.createElement('div');
    chatbox.classList.add('chatbox');
    chatbox.classList.remove('hidden'); // Ensure the chatbox is visible

    const chatboxHeader = document.createElement('div');
    chatboxHeader.classList.add('chatbox-header');
    chatboxHeader.textContent = jobTitle;

    const chatboxMessages = document.createElement('div');
    chatboxMessages.classList.add('chatbox-messages');

    chatbox.dataset.chatId = chatId;

    // Create message input and send button
    const messageInput = document.createElement('input');
    messageInput.setAttribute('type', 'text');
    messageInput.classList.add('message-input');
    messageInput.setAttribute('placeholder', 'Type your message');

    const sendButton = document.createElement('button');
    sendButton.textContent = 'Send';
    sendButton.classList.add('sendButton');

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.classList.add('close-button');

    // Event listener for the close button
    closeButton.addEventListener('click', function() {
    chatbox.remove(); // Remove the chatbox when the close button is clicked
    });

    // Event listener for the send button
    sendButton.addEventListener('click', function() {
    const messageText = messageInput.value.trim();
    if (messageText) {
        sendMessage(chatId, messageText); // Pass the chatId when sending the message
        messageInput.value = ''; // Clear the input field after sending the message
    }
    });

    // Event listener for the Enter key press in the message input field
    messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') { // Check if Enter key was pressed
    const messageText = messageInput.value.trim();
    if (messageText) {
        sendMessage(chatId, messageText); // Pass the chatId when sending the message
        messageInput.value = ''; // Clear the input field after sending the message
    }
    }
});


    // Append chatbox elements to the chat window
    chatbox.appendChild(closeButton);
    chatbox.appendChild(chatboxHeader);
    chatbox.appendChild(chatboxMessages);
    chatbox.appendChild(messageInput);
    chatbox.appendChild(sendButton);

    const chatWindow = document.getElementById('chatWindow');
    chatWindow.appendChild(chatbox);

    // Fetch and display old messages
    await fetchChatMessages(chatId);
        // Scroll to the bottom of the chat messages container
        chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
}


// Function to periodically fetch chat messages if a chatbox is open
function fetchChatMessagesIfOpen() {
    const existingChatbox = document.querySelector('.chatbox');
    const userId = localStorage.getItem('userId');
    if (existingChatbox) {
    const currentChatId = existingChatbox.dataset.chatId;
    displayChats(userId);
    fetchChatMessages(currentChatId);
    }
}

// Function to update chat window periodically if logged in
function updateChatWindow() {
    userId = localStorage.getItem('userId');
    if (userId) {
        displayChats(userId);
    }
}

// Interval in milliseconds to fetch chat messages (e.g., every 5 seconds)
const fetchInterval = 5000;

// Start fetching chat messages at the specified interval
const fetchInterval1 = setInterval(fetchChatMessagesIfOpen, fetchInterval);
const fetchInterval2 = setInterval(updateChatWindow, fetchInterval);

