from flask import Blueprint, jsonify, request
from db import get_db

songstats_bp = Blueprint('songstats', __name__)

@songstats_bp.route('/songstats', methods=['GET'])
def song_stats():
    # Get admin email from request headers
    admin_email = request.headers.get('Admin-Email')

    # Validate admin email
    if not admin_email or not is_valid_admin(admin_email):
        return jsonify({'message': 'Unauthorized: Invalid admin email'}), 403

    db = get_db()

    try:
        with db.cursor(dictionary=True) as cursor:
            query = """
            SELECT 
                mood,
                COUNT(*) AS mood_song_count
            FROM 
                songs
            GROUP BY 
                mood;
            """
            cursor.execute(query)
            results = cursor.fetchall()

            if not results:
                return jsonify({'message': 'No songs found'}), 404

            # Calculate total songs and total moods
            total_songs = sum(result['mood_song_count'] for result in results)
            total_moods = len(results)

            # Preparing the response
            response = {
                'total_songs': total_songs,
                'total_moods': total_moods,
                'moods': [
                    {
                        'mood': result['mood'],
                        'mood_song_count': result['mood_song_count']
                    } for result in results
                ]
            }

            return jsonify(response), 200

    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500

def is_valid_admin(email):
    db = get_db()

    try:
        with db.cursor(dictionary=True) as cursor:
            # Query to check if the user exists and has admin type
            query = "SELECT COUNT(*) AS count FROM users WHERE email = %s AND type = 1"
            cursor.execute(query, (email,))
            result = cursor.fetchone()

            # If count is greater than 0, the email belongs to an admin
            return result['count'] > 0

    except Exception as e:
        print(f"Error during admin validation: {str(e)}")
        return False  # If there's an error, assume the admin email is invalid
