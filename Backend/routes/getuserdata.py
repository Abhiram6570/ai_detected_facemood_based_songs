from flask import Blueprint, request, jsonify
from db import get_db

getuserdata_bp = Blueprint('getuserdata', __name__)

@getuserdata_bp.route('/getuserdata', methods=['POST'])
def get_userdata():
    # Get email from request JSON
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'message': 'Email is required'}), 400

    # Database connection and query
    db = get_db()
    try:
        with db.cursor(dictionary=True) as cursor:
            # Verify if the email belongs to an admin (type = 1)
            admin_query = "SELECT * FROM users WHERE email = %s AND type = %s"
            cursor.execute(admin_query, (email, 1))
            admin_user = cursor.fetchone()

            if not admin_user:
                return jsonify({'message': 'Admin not found or invalid email'}), 404

            # Fetch all user data for type = 0
            user_query = "SELECT * FROM users WHERE type = %s"
            cursor.execute(user_query, (0,))
            users = cursor.fetchall()

            if not users:
                return jsonify({'message': 'No users found'}), 404

            # Decode bytes fields to strings
            decoded_users = []
            for user in users:
                decoded_users.append({
                    key: (value.decode('utf-8') if isinstance(value, bytes) else value)
                    for key, value in user.items()
                })

            # Return only user data
            return jsonify({
                'message': 'User data retrieved successfully.',
                'users': decoded_users
            }), 200

    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500
