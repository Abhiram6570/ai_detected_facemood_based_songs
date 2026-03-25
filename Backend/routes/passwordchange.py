from flask import Blueprint, request, jsonify
from db import get_db

passwordchange_bp = Blueprint('passwordchange', __name__)

@passwordchange_bp.route('/passwordchange', methods=['POST'])
def passwordchange():
    data = request.get_json()

    # Validate required fields
    if not all(key in data for key in ('email', 'old_password', 'password', 'cpassword')):
        return jsonify({'message': 'Missing required fields'}), 400

    # Validate password match
    if data['password'] != data['cpassword']:
        return jsonify({'message': 'Passwords do not match'}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Check if user exists by email
    cursor.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
    user = cursor.fetchone()

    if not user:
        return jsonify({'message': 'Email not found'}), 404

    # Verify old password
    if user['password'] != data['old_password']:
        return jsonify({'message': 'Old password is incorrect'}), 403

    # Update password in the database
    try:
        cursor.execute(
            "UPDATE users SET password = %s WHERE email = %s",
            (data['password'], data['email'])
        )
        db.commit()
    except Exception as e:
        db.rollback()
        return jsonify({'message': 'Failed to update password', 'error': str(e)}), 500

    return jsonify({'message': 'Password updated successfully'}), 200
