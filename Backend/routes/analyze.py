from flask import Blueprint, request, jsonify

analyze_bp = Blueprint('analyze', __name__)

# Dummy song storage for demonstration
songs = [
    {'title': 'Happy Song', 'artist': 'Artist A', 'mood': 'happy'},
    {'title': 'Sad Song', 'artist': 'Artist B', 'mood': 'sad'},
    {'title': 'Relaxing Song', 'artist': 'Artist C', 'mood': 'relaxing'},
]


@analyze_bp.route('/mood', methods=['POST'])
def analyze_mood():
    print(f"Received request method: {request.method}")  # Log request method
    print(f"Received request data: {request.json}")  # Log request body

    data = request.get_json()
    mood = data.get('mood')

    if not mood:
        return jsonify({'message': 'Mood is required'}), 400

    # Rest of the logic
    return jsonify({'message': f'Mood analyzed as: {mood}'}), 200


