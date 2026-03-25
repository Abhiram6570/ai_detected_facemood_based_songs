from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename
from db import get_db  # Ensure get_db function is defined to establish a database connection

addsongs = Blueprint('addsongs', __name__)

@addsongs.route('/add_song', methods=['POST'])
def add_song():
    try:
        # Parse form data
        data = request.form
        title = data.get('title')
        artist = data.get('artist')
        genre = data.get('genre')
        mood = data.get('mood')

        # Validate required fields
        if not all([title, artist, genre, mood]):
            return jsonify({'message': 'All fields (title, artist, genre, mood) are required'}), 400

        UPLOAD_BASE_FOLDER = 'uploads/songs'
        ALLOWED_EXTENSIONS = {'mp3', 'wav', 'flac', 'm4a'}

        # Create mood-specific upload folder
        upload_folder = os.path.join(UPLOAD_BASE_FOLDER, mood)
        os.makedirs(upload_folder, exist_ok=True)

        def allowed_file(filename):
            return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

        # Check if a file is uploaded
        if 'file' not in request.files:
            return jsonify({'message': 'No file uploaded'}), 400

        file = request.files['file']
        if not allowed_file(file.filename):
            return jsonify({'message': 'Invalid file type'}), 400

        # Save the file
        filename = secure_filename(file.filename)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)

        # Insert song details into the database
        db = get_db()
        cursor = db.cursor()

        try:
            cursor.execute("""
                INSERT INTO songs (title, artist, genre, mood, file_path)
                VALUES (%s, %s, %s, %s, %s)
            """, (title, artist, genre, mood, file_path))
            db.commit()
        except Exception as db_error:
            db.rollback()
            return jsonify({'message': 'Failed to save song in the database', 'error': str(db_error)}), 500

        return jsonify({
            'message': 'Song uploaded and saved successfully',
            'file_path': file_path,
            'title': title,
            'artist': artist,
            'genre': genre,
            'mood': mood
        }), 200

    except Exception as e:
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500
