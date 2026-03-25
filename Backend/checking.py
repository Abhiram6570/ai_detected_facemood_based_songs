import os

@app.route('/check_directory', methods=['GET'])
def check_directory():
    return os.getcwd()
