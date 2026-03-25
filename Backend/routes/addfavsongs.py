from flask import Blueprint, request, jsonify
from db import get_db

addfavsongs_bp = Blueprint('addfavsongs', __name__)

# Route to add a favorite song
@addfavsongs_bp.route('/addfavsongs', methods=['POST'])
def addfavsongs():
    data = request.get_json()

    # Validate input
    if not data or 'user_id' not in data or 'song_id' not in data:
        return jsonify({'message': 'Missing required fields: user_id, song_id'}), 400

    user_id = data['user_id']
    song_id = data['song_id']
    db = get_db()

    try:
        with db.cursor(dictionary=True) as cursor:
            # SQL query to add a favorite song
            query = "INSERT INTO fav_songs (user_id, song_id) VALUES (%s, %s)"
            cursor.execute(query, (user_id, song_id))
            db.commit()  # Commit the transaction

            # Return success message
            return jsonify({'message': 'Favorite song added successfully'}), 201

    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500
