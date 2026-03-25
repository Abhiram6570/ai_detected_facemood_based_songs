from flask import Blueprint, request, jsonify
from db import get_db

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/profile', methods=['POST'])
def profile():
    data = request.get_json()

    # Validate input
    if 'email' not in data:
        return jsonify({'message': 'Missing required fields'}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Fetch user data by email
    cursor.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
    user = cursor.fetchone()

    if not user:
        return jsonify({'message': 'Email not found'}), 404

    # Decode any bytes fields to strings
    user = {
        key: (value.decode('utf-8') if isinstance(value, bytes) else value)
        for key, value in user.items()
    }

    # Return user data with success message
    return jsonify({'message': 'User found', 'user': user}), 200
