function openUserProfileTab(username) {
    // Fetch user profile using GitHub API
    const userPromise = fetch(`https://api.github.com/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        });

    // Fetch user repositories using GitHub API
    const repositoriesPromise = fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        });

    // Handle both promises concurrently
    Promise.all([userPromise, repositoriesPromise])
        .then(([user, repositories]) => {
            // Create a new tab
            const userProfileTab = window.open('', '_blank');

            // Construct the HTML content
            const htmlContent = `
                <html>
                <head>
                    <title>${user.login}'s GitHub Profile</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                        }
                        img {
                            max-width: 20%;
                            border-radius: 50%;
                            margin-bottom: 10px;
                        }
                        p {
                            padding-left: 26%;
                        }
                        h2 {
                            padding-left: 26%;
                            margin-top: -144px;
                        }
                        .repository {
                            margin-top: 20px;
                            border: 1px solid #ccc;
                            padding: 10px;
                        }
                    </style>
                </head>
                <body>
                    <img src="${user.avatar_url}" alt="User Avatar">
                    <h2>${user.login}</h2>
                    <p>${user.bio || ''}</p>
                    <p>Location: ${user.location || 'Not available'}</p>
                    <p>Followers: ${user.followers}</p>
                    
                    <h3>Repositories:</h3>
                    ${repositories.map(repo => `
                        <div class="repository">
                            <h4>${repo.name}</h4>
                            <p>${repo.description || 'No description available'}</p>
                            <p>Topics: ${repo.topics ? repo.topics.join(', ') : 'Not available'}</p>
                            <a href="${repo.html_url}" target="_blank">View Repository</a>
                        </div>
                    `).join('')}
                </body>
                </html>
            `;

            // Set the HTML content of the new tab
            userProfileTab.document.documentElement.innerHTML = htmlContent;
        })
        .catch(error => {
            // Handle error
            console.error('Error fetching user profile or repositories:', error);
            // Display error message in the current tab
            alert(`Error fetching user profile or repositories`);
        });
}

// Function to handle the "Get User Profile" button click
function fetchUserProfile() {
    const username = document.getElementById('username').value;

    // Validate username
    if (!username) {
        alert('Please enter a GitHub username.');
        return;
    }

    // Open the user profile tab
    openUserProfileTab(username);
}