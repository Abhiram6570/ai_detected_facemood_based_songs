from flask import Blueprint, request, jsonify
from db import get_db

removefavsongs_bp = Blueprint('removefavsongs', __name__)

@removefavsongs_bp.route('/removefavsongs', methods=['POST'])
def removefavsongs():
    data = request.get_json()

    # Validate input
    if not data or 'user_id' not in data:
        return jsonify({'message': 'Missing required field: user_id'}), 400

    user_id = data['user_id']
    song_id = data['song_id']
    db = get_db()

    try:
        with db.cursor(dictionary=True) as cursor:
            # SQL query to delete favorite songs
            query = "DELETE FROM fav_songs WHERE user_id = %s and song_id= %s"
            cursor.execute(query, (user_id, song_id))
            db.commit()  # Commit the transaction

            # Check if any rows were affected
            if cursor.rowcount == 0:
                return jsonify({'message': 'No favorite songs found for the specified user'}), 404

            # Return success message
            return jsonify({'message': f'{cursor.rowcount} favorite song(s) removed successfully'}), 200

    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500
