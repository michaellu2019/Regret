from datetime import datetime
from app import db

"""
class User(db.Model):
	pk_id = db.Column(db.Integer, primary_key = True)
	username = db.Column(db.String, nullable = False)
	fb_id = db.Column(db.String, unique = True, nullable = False)
	profile_picture = db.Column(db.String, nullable = False)
	num_pieces = db.Column(db.Integer, default = 0)
	max_num_pieces = db.Column(db.Integer, default = 1)

	def __repr__(self):
		return f'User(\'{self.id}\', \'{self.username}\')'

class Piece(db.Model):
	pk_id = db.Column(db.Integer, primary_key = True)
	index = db.Column(db.Integer, nullable = False)
	title = db.Column(db.String(100))
	date_posted = db.Column(db.DateTime, nullable = False, default = datetime.utcnow)
	artist = db.Column(db.String, nullable = False)
	description = db.Column(db.String)
	artist_pk_id = db.Column(db.Integer, db.ForeignKey('user.pk_id'), nullable = False)
	num_likes = db.Column(db.Integer, default = 0)
	likes_user_pk_ids = db.Column(db.String, default = '-69')
	content_src = db.Column(db.String, nullable = False)
	content_pos_x = db.Column(db.Integer, nullable = False, default = 0)
	content_pos_y = db.Column(db.Integer, nullable = False, default = 0)
	content_width = db.Column(db.Integer, nullable = False, default = 0)
	content_height = db.Column(db.Integer, nullable = False, default = 0)
	wall_id = db.Column(db.Integer, nullable = False, default = 0)

	def __repr__(self):
		return f'Piece(\'{self.title}\', \'{self.date_posted}\')'
"""

# """
from datetime import datetime
from app import db
from sqlalchemy.dialects import mysql

class User(db.Model):
	pk_id = db.Column(db.Integer, primary_key = True)
	username = db.Column(mysql.VARCHAR(200), nullable = False)
	fb_id = db.Column(mysql.VARCHAR(200), unique = True, nullable = False)
	profile_picture = db.Column(mysql.VARCHAR(200), nullable = False)
	num_pieces = db.Column(db.Integer, default = 0)
	max_num_pieces = db.Column(db.Integer, default = 1)

	def __repr__(self):
		return f'User(\'{self.id}\', \'{self.username}\')'

class Piece(db.Model):
	pk_id = db.Column(db.Integer, primary_key = True)
	index = db.Column(db.Integer, nullable = False)
	title = db.Column(mysql.VARCHAR(200))
	date_posted = db.Column(db.DateTime, nullable = False, default = datetime.utcnow)
	artist = db.Column(mysql.VARCHAR(200), nullable = False)
	description = db.Column(mysql.VARCHAR(500))
	artist_pk_id = db.Column(db.Integer, nullable = False)
	num_likes = db.Column(db.Integer, default = 0)
	likes_user_pk_ids = db.Column(mysql.VARCHAR(1000), default = '-69')
	content_src = db.Column(mysql.VARCHAR(100000), nullable = False)
	content_pos_x = db.Column(db.Integer, nullable = False, default = 0)
	content_pos_y = db.Column(db.Integer, nullable = False, default = 0)
	content_width = db.Column(db.Integer, nullable = False, default = 0)
	content_height = db.Column(db.Integer, nullable = False, default = 0)
	wall_id = db.Column(db.Integer, nullable = False, default = 0)

	def __repr__(self):
		return f'Piece(\'{self.title}\', \'{self.date_posted}\')'
# """