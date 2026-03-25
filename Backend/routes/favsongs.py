from flask import Blueprint, request, jsonify
from db import get_db

favsongs_bp = Blueprint('favsongs', __name__)

@favsongs_bp.route('/favsongs', methods=['POST'])
def favsongs():
    data = request.get_json()

    print("data",data)

    # Validate input
    if not data or 'user_id' not in data:
        return jsonify({'message': 'Missing required field: user_id'}), 400

    user_id = data['user_id']
    db = get_db()

    try:
        with db.cursor(dictionary=True) as cursor:
            # SQL query to fetch favorite songs
            query = """
            SELECT 
                fs.id AS fav_id,
                fs.user_id,
                s.id AS song_id,
                s.title AS song_title,
                s.artist AS song_artist,
                s.genre AS song_genre,
                s.mood AS song_mood,
                s.file_path AS song_file_path,
                s.image_data AS song_image,
                fs.created_at AS favorited_at
            FROM 
                fav_songs fs
            JOIN 
                users u ON fs.user_id = u.id
            JOIN 
                songs s ON fs.song_id = s.id
            WHERE 
                fs.user_id = %s
            ORDER BY 
                fs.created_at DESC;
            """
            cursor.execute(query, (user_id,))
            fav_songs = cursor.fetchall()

            if not fav_songs:
                return jsonify({'message': 'No favorite songs found'}), 404

            # Decode bytes for all records
            decoded_songs = [
                {
                    key: (value.decode('utf-8') if isinstance(value, bytes) else value)
                    for key, value in song.items()
                }
                for song in fav_songs
            ]

            # Return the favorite songs
            return jsonify({'message': 'Favorite songs found', 'songs': decoded_songs}), 200

    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500
