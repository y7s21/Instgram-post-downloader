document.getElementById('downloadForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const url = document.getElementById('url').value;
    const resultDiv = document.getElementById('result');

    // Show loading text
    let loadingText = "Loading";
    const loadingInterval = setInterval(() => {
        loadingText += ".";
        resultDiv.innerHTML = `<p class="loading">${loadingText}</p>`;
        if (loadingText.length > 10) loadingText = "Loading";
    }, 500);

    // Fetch media from the backend
    fetch('http://127.0.0.1:5000/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
    })
    .then(response => {
        if (response.ok) {
            return response.blob(); // Get the media content as a blob
        } else {
            return response.json().then(data => {
                throw new Error(data.error || "Failed to fetch media");
            });
        }
    })
    .then(blob => {
        clearInterval(loadingInterval); // Stop the loading animation

        // Create a URL for the blob
        const mediaUrl = URL.createObjectURL(blob);

        // Create an anchor element for automatic download
        const a = document.createElement('a');
        a.href = mediaUrl;
        a.download = 'media'; // Default name for the file, you can customize it based on the media type
        a.style.display = 'none'; // Hide the anchor element

        // Trigger the download
        a.click();

        // Display the media
        if (blob.type.startsWith('video')) {
            resultDiv.innerHTML = `
                <div class="media-container">
                    <video controls>
                        <source src="${mediaUrl}" type="${blob.type}">
                        Your browser does not support the video tag.
                    </video>
                </div>
            `;
        } else if (blob.type.startsWith('image')) {
            resultDiv.innerHTML = `
                <div class="media-container">
                    <img src="${mediaUrl}" alt="Downloaded Media">
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<p class="error-message">Unsupported media type</p>`;
        }
    })
    .catch(error => {
        clearInterval(loadingInterval); // Stop the loading animation
        resultDiv.innerHTML = `<p class="error-message">Error: ${error.message}</p>`;
    });
});
