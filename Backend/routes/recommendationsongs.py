from flask import Flask, Blueprint, request, jsonify, send_from_directory
from flask_cors import CORS
import base64
import os
from db import get_db

app = Flask(__name__)
CORS(app)
recommendationsongs_bp = Blueprint('recommendationsongs', __name__)



@recommendationsongs_bp.route('/recommendationsongs', methods=['POST'])
def recommendationsongs():
    try:
        data = request.get_json()
        mood = data.get('mood')
        user_id = data.get('user_id')  # Assuming the user_id is provided in the request

        if not mood:
            return jsonify({'message': 'Mood is required'}), 400

        if not user_id:
            return jsonify({'message': 'User ID is required'}), 400

        db = get_db()
        cursor = db.cursor(dictionary=True)

        # Fetch songs based on mood
        cursor.execute("""
            SELECT `id`, `title`, `artist`, `genre`, `mood`, `file_path`, `image_data`
            FROM songs
            WHERE mood = %s
        """, (mood,))
        songs = cursor.fetchall()

        if not songs:
            return jsonify({'message': 'No songs found for the given mood'}), 404

        # Fetch the user's favorite songs
        cursor.execute("""
            SELECT song_id FROM fav_songs WHERE user_id = %s
        """, (user_id,))
        fav_songs = cursor.fetchall()
        fav_song_ids = [fav['song_id'] for fav in fav_songs]

        song_list = []
        for song in songs:
            encoded_image = base64.b64encode(song['image_data']).decode('utf-8') if song['image_data'] else None
            song['file_path'] = f"http://localhost:5000/{song['file_path']}"  # Correctly format the file path
            is_fav = song['id'] in fav_song_ids  # Check if the song is a favorite

            song_list.append({
                'id': song['id'],
                'title': song['title'],
                'artist': song['artist'],
                'genre': song['genre'],
                'mood': song['mood'],
                'file_path': song['file_path'],
                'image_data': encoded_image,
                'is_favorite': is_fav  # Add the favorite flag
            })

        return jsonify({'message': 'Songs retrieved successfully', 'songs': song_list}), 200

    except Exception as e:
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500
