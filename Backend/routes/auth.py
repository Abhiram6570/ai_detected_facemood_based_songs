import jwt
import datetime
import pytz
from flask import Blueprint, request, jsonify, make_response
from flask_cors import CORS
from db import get_db  # Assume you have a database connection module

# Initialize Blueprint
auth_bp = Blueprint('auth', __name__)

# Secret key for JWT encoding/decoding
SECRET_KEY = 'your-secret-key'

# Add CORS for handling cross-origin requests
CORS(auth_bp, supports_credentials=True)

@auth_bp.route('/register', methods=['POST'])
def register():
    print("[INFO] Register endpoint hit")
    data = request.get_json()

    # Validate fields
    if not all(k in data for k in ('fullname', 'email', 'password')):
        print("[ERROR] Missing required fields")
        return jsonify({'message': 'Missing required fields'}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Check for duplicate email
    cursor.execute("SELECT * FROM users WHERE email = %s", (data['email'],))
    if cursor.fetchone():
        print("[ERROR] Email already exists")
        return jsonify({'message': 'Email already exists'}), 400

    # Register user with plaintext password (no hashing for simplicity, consider hashing in production)
    cursor.execute(
        "INSERT INTO users (fullname, email, password, type) VALUES (%s, %s, %s,1)",
        (data['fullname'], data['email'], data['password'])
    )
    db.commit()
    print("[INFO] Registration successful for", data['email'])
    return jsonify({'message': 'Registration successful'}), 200


@auth_bp.route('/login', methods=['POST'])
def login():
    print("[INFO] Login endpoint hit")
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        print("[ERROR] Email or password missing")
        return jsonify({'message': 'Email and password are required'}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # Authenticate user
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user and user['password'] == password:
        print("[INFO] Authentication successful for", email)

        # Generate JWT token with IST timezone expiration
        ist_timezone = pytz.timezone('Asia/Kolkata')
        exp_time = (datetime.datetime.now(ist_timezone) + datetime.timedelta(hours=1)).timestamp()

        token_data = {
            'email': user['email'],
            'fullname': user['fullname'],
            'type': user.get('type', 'user'),
            'exp': exp_time
        }
        token = jwt.encode(token_data, SECRET_KEY, algorithm='HS256')

        response = make_response(jsonify({'message': 'Login successful', 'user': token_data}))
        # response.set_cookie('auth_token', token, httponly=True, secure=False, samesite='Strict')
        # In the login route, when setting the cookie
        response.set_cookie('auth_token', token, secure=False, samesite='Strict')  # Remove httponly=True for debugging

        print("[INFO] Token generated and cookie set for", email)
        return response

    print("[ERROR] Invalid credentials for", email)
    return jsonify({'message': 'Invalid credentials'}), 401


@auth_bp.route('/validateToken', methods=['POST'])
def validate_token():
    print("[INFO] Validate-token endpoint hit")
    token = request.cookies.get('auth_token')  # Get token from cookies

    if not token:
        print("[ERROR] Token not found in cookies")
        return jsonify({'message': 'Token not found'}), 401

    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        print("[INFO] Token valid for", decoded_token['email'])
        return jsonify({'message': 'Token valid', 'user': decoded_token}), 200
    except jwt.ExpiredSignatureError:
        print("[ERROR] Token expired")
        return jsonify({'message': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        print("[ERROR] Invalid token")
        return jsonify({'message': 'Invalid token'}), 401




@auth_bp.route('/logout', methods=['POST'])
def logout():
    print("[INFO] Logout endpoint hit")
    
    # Clear the auth_token cookie
    response = make_response(jsonify({'message': 'Logged out successfully'}))
    response.delete_cookie('auth_token', path='/')  # Specify path if needed, defaults to root '/'
    
    print("[INFO] Token cleared and user logged out")
    
    return response

