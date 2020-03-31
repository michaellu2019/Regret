from flask import render_template, url_for, jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from app import app, db
from app.models import User, Piece
from flask_cors import cross_origin
import json

@app.route('/')
@app.route('/home')
def home():
	return render_template('index.html');
	# return 'Hello World!'

@app.route('/login', methods = ['GET', 'POST'])
def login():
	user_dict = request.get_json()['user']
	user = User.query.filter_by(fb_id = user_dict['userId']).first()
	if 'unauth_user_' in user_dict['userId']:
		max_num_pieces = 1
		authenticated = False
	else:
		max_num_pieces = 3
		authenticated = True

	if user:
		existing_user = {
			'username': user.username, 
			'fbId': user.fb_id, 
			'pkId': user.pk_id, 
			'profilePicture': user.profile_picture, 
			'numPieces': user.num_pieces,
			'maxNumPieces': max_num_pieces
		}
		return jsonify({'status': 'success', 'msg': 'returning user', 'data': {'user': existing_user}})
	else:
		try:
			user = User(username = user_dict['username'], fb_id = user_dict['userId'], profile_picture = user_dict['picture'], max_num_pieces = max_num_pieces)
			db.session.add(user)
			db.session.commit()
			new_user = {
				'username': user.username, 
				'fbId': user.fb_id, 
				'pkId': user.pk_id, 
				'profilePicture': user.profile_picture, 
				'numPieces': user.num_pieces,
				'maxNumPieces': user.max_num_pieces,
				'authenticated': authenticated
			}
			return jsonify({'status': 'success', 'msg': 'new user', 'data': {'user': new_user}})
		except SQLAlchemyError as ex:
			print('Error: ', ex)
			return jsonify({'status': 'fail', 'msg': 'failed to update databases', 'data': {}})
		
@app.route('/add_piece', methods = ['GET', 'POST'])
def add_piece():
	piece_dict = request.get_json()['piece']
	user = User.query.filter_by(pk_id = piece_dict['artistPkId']).first()
	if user:
		try:
			piece = Piece(index = piece_dict['index'], title = piece_dict['title'], artist = piece_dict['artist'], description = piece_dict['description'], artist_pk_id = piece_dict['artistPkId'], num_likes = piece_dict['numLikes'], content_src = piece_dict['src'], content_pos_x = piece_dict['x'], content_pos_y = piece_dict['y'], content_width = piece_dict['w'], content_height = piece_dict['h'], wall_id = piece_dict['wallId'])
			db.session.add(piece)
			user.num_pieces += 1
			db.session.commit()
			updated_user = {
				'username': user.username, 
				'fbId': user.fb_id, 
				'pkId': user.pk_id, 
				'profilePicture': user.profile_picture, 
				'numPieces': user.num_pieces,
				'maxNumPieces': user.max_num_pieces
			}
			updated_piece = {
				'pkId': piece.pk_id,
				'index': piece.index,
				'title': piece.title,
	        	'artist': piece.artist,
	        	'description': piece.description,
	        	'artistPkId': piece.artist_pk_id,
	        	'likesPkIds': [int(pk_id) for pk_id in piece.likes_user_pk_ids.split(',')],
	        	'numLikes': piece.num_likes,
	        	'src': piece.content_src,
	        	'x': piece.content_pos_x,
	        	'y': piece.content_pos_y,
	        	'w': piece.content_width,
	        	'h': piece.content_height,
	        	'wallId': piece.wall_id
			}
			return jsonify({'status': 'success', 'msg': 'new user', 'data': {'user': updated_user, 'piece': updated_piece}})
		except SQLAlchemyError as ex:
			print('Error: ', ex)
			return jsonify({'status': 'fail', 'msg': 'failed to update databases', 'data': {}})
	return jsonify({'status': 'fail', 'msg': 'unauthenticated user', 'data': {}})

@app.route('/load_wall', methods = ['GET'])
def load_wall():
	pieces = Piece.query.all()
	if pieces:
		pieces_arr = []
		for piece in pieces:
			piece_dict = {
				'pkId': piece.pk_id,
				'index': piece.index,
				'title': piece.title,
	        	'artist': piece.artist,
	        	'description': piece.description,
	        	'artistPkId': piece.artist_pk_id,
	        	'likesPkIds': [int(pk_id) for pk_id in piece.likes_user_pk_ids.split(',')],
	        	'numLikes': piece.num_likes,
	        	'src': piece.content_src,
	        	'x': piece.content_pos_x,
	        	'y': piece.content_pos_y,
	        	'w': piece.content_width,
	        	'h': piece.content_height,
	        	'wallId': piece.wall_id
			}
			pieces_arr.append(piece_dict)

		return jsonify({'status': 'success', 'msg': 'found pieces data', 'data': {'pieces': pieces_arr}})

	return jsonify({'status': 'fail', 'msg': 'no pieces data found', 'data': {}})

@app.route('/like_piece', methods = ['GET', 'POST'])
def like_piece():
	data_dict = request.get_json()['data']
	piece = Piece.query.filter_by(pk_id = data_dict['piecePkId']).first()
	if piece and int(data_dict['userPkId']) not in [int(pk_id) for pk_id in piece.likes_user_pk_ids.split(',')]:
		try:
			piece.num_likes += 1
			piece.likes_user_pk_ids += ',' + str(data_dict['userPkId'])
			db.session.commit()
			updated_piece = {
				'pkId': piece.pk_id,
				'index': piece.index,
				'title': piece.title,
	        	'artist': piece.artist,
	        	'description': piece.description,
	        	'artistPkId': piece.artist_pk_id,
	        	'likesPkIds': [int(pk_id) for pk_id in piece.likes_user_pk_ids.split(',')],
	        	'numLikes': piece.num_likes,
	        	'src': piece.content_src,
	        	'x': piece.content_pos_x,
	        	'y': piece.content_pos_y,
	        	'w': piece.content_width,
	        	'h': piece.content_height,
	        	'wallId': piece.wall_id
			}
			return jsonify({'status': 'success', 'msg': 'new user', 'data': {'piece': updated_piece}})
		except SQLAlchemyError as ex:
			print('Error: ', ex)
			return jsonify({'status': 'fail', 'msg': 'failed to update databases', 'data': {}})
	return jsonify({'status': 'fail', 'msg': 'unidentified piece', 'data': {}})