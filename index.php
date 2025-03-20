<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instagram Downloader</title>
    <link rel="stylesheet" href="style.css"> <!-- Link to the CSS file -->
</head>
<body>
    <div class="container">
        <h1>Instagram Media Downloader</h1>
        <form id="downloadForm">
            <div class="form-group">
                <input type="text" id="url" name="url" placeholder="Enter Instagram Post URL" required>
            </div>
            <div class="form-group">
                <button type="submit">Download</button>
            </div>
        </form>

        <div id="result">
            <!-- Media and loading text will be displayed here -->
        </div>
    </div>

    <!-- Link to the external JavaScript file -->
    <script src="script.js"></script>
</body>
</html>
