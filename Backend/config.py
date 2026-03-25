class Config:
    DEBUG = True
    CORS_ORIGINS = ['http://localhost:3000']  # Add your frontend origin here
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = ''
    MYSQL_DB = 'mood_music'

    @staticmethod
    def init_app(app):
        app.config.from_object(Config)
