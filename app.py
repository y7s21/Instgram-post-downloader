from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from instaloader import Instaloader, Post
import requests
import re
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def extract_shortcode(url):
    # Regex to match Instagram URLs and extract the shortcode
    patterns = [
        r"instagram\.com/p/([^/]+)",  # Posts
        r"instagram\.com/reel/([^/]+)",  # Reels
        r"instagram\.com/stories/([^/]+)/(\d+)",  # Stories
        r"instagram\.com/tv/([^/]+)",  # IGTV
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)  # Return the shortcode

    return None  # No valid shortcode found

@app.route('/download', methods=['POST'])
def download_post():
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({"error": "URL is required"}), 400

    try:
        # Extract shortcode from URL
        shortcode = extract_shortcode(url)
        if not shortcode:
            return jsonify({"error": "Invalid Instagram URL"}), 400

        # Initialize Instaloader
        L = Instaloader()

        # Fetch the post
        post = Post.from_shortcode(L.context, shortcode)

        # Get the media URL
        if post.is_video:
            media_url = post.video_url  # Video URL
        else:
            media_url = post.url  # Image URL

        print("Media URL:", media_url)

        # Verify the media URL
        if not media_url:
            return jsonify({"error": "Could not fetch media URL"}), 400

        # Fetch the media content
        response = requests.get(media_url)
        if response.status_code != 200:
            return jsonify({"error": "Could not fetch media content"}), 400

        # Serve the media content through the backend
        return send_file(
            io.BytesIO(response.content),
            mimetype=response.headers['Content-Type']
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)