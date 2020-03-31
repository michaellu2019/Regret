from app import db
from app.models import User, Piece
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError

# db.session.commit()
db.drop_all()
db.create_all()

def createClearZones():
		try: 
			user = User(username = 'God', fb_id = 'god', profile_picture = '', max_num_pieces = '100')
			db.session.add(user)
			db.session.commit()
		except Exception:
			print('Error creating dummy user...')

		try:
			transparent_img_b64_uri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAIAAABEtEjdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3ggRDQAm5uC6agAABopJREFUeNrt1tGJYEEIRcHp5SUk5p/AsGJEwuaw+CVVAcilPw79fn///izJjK1TVW2VVVZZZdV/+/MDwDniDiDuAIg7AOIOgLgDIO4A4g6AuAMg7gCIOwDiDiDungBA3AEQdwDEHQBxB0DcAcQdAHEHQNwBEHcAxB1A3AE4583M1q2q3jqVGVZZZZVVVvm5AyDuAOIOgLgDIO4AiDsA4g4g7gCIOwDiDoC4AyDuAIg7gLgDIO4AiDsA4g6AuAOIOwDiDoC4AyDuAIg7AOIOcNhX1Vu3MmPrlFVWWWWVVX7uAIg7gLgDIO4AiDsA4g6AuAOIOwDiDoC4AyDuAIg7AOIOIO4AiDsA4g6AuAMg7gDiDoC4AyDuAIg7AOIOgLgD3PZmZutWVW+dygyrrLLKKqv83AEQdwBxB0DcARB3AMQdAHEHEHcAxB0AcQdA3AEQdwDEHUDcARB3AMQdAHEHQNwBxB0AcQdA3AEQdwDEHQBxBzjsq+qtW5mxdcoqq6yyyio/dwDEHUDcARB3AMQdAHEHQNwBxB0AcQdA3AEQdwDEHQBxBxB3AMQdAHEHQNwBEHcAcQdA3AEQdwDEHQBxB0DcAW57M7N1q6q3TmWGVVZZZZVVfu4AiDuAuAMg7gCIOwDiDoC4A4g7AOIOgLgDIO4AiDsA4g4g7gCIOwDiDoC4AyDuAOIOgLgDIO4AiDsA4g6AuAMc9lX11q3M2DpllVVWWWWVnzsA4g4g7gCIOwDiDoC4AyDuAOIOgLgDIO4AiDsA4g6AuAOIOwDiDoC4AyDuAIg7gLgDIO4AiDsA4g6AuAMg7gC3vZnZulXVW6cywyqrrLLKKj93AMQdQNwBEHcAxB0AcQdA3AHEHQBxB0DcARB3AMQdAHEHEHcAxB0AcQdA3AEQdwBxB0DcARB3AMQdAHEHQNwBDvuqeutWZmydssoqq6yyys8dAHEHEHcAxB0AcQdA3AEQdwBxB0DcARB3AMQdAHEHQNwBxB0AcQdA3AEQdwDEHUDcARB3AMQdAHEHQNwBEHeA297MbN2q6q1TmWGVVVZZZZWfOwDiDiDuAIg7AOIOgLgDIO4A4g6AuAMg7gCIOwDiDoC4A4g7AOIOgLgDIO4AiDuAuAMg7gCIOwDiDoC4AyDuAId9Vb11KzO2TllllVVWWeXnDoC4A4g7AOIOgLgDIO4AiDuAuAMg7gCIOwDiDoC4AyDuAOIOgLgDIO4AiDsA4g4g7gCIOwDiDoC4AyDuAIg7wG1vZrZuVfXWqcywyiqrrLLKzx0AcQcQdwDEHQBxB0DcARB3AHEHQNwBEHcAxB0AcQdA3AHEHQBxB0DcARB3AMQdQNwBEHcAxB0AcQdA3AEQd4DDvqreupUZW6esssoqq6zycwdA3AHEHQBxB0DcARB3AMQdQNwBEHcAxB0AcQdA3AEQdwBxB0DcARB3AMQdAHEHEHcAxB0AcQdA3AEQdwDEHeC2NzNbt6p661RmWGWVVVZZ5ecOgLgDiDsA4g6AuAMg7gCIO4C4AyDuAIg7AOIOgLgDIO4A4g6AuAMg7gCIOwDiDiDuAIg7AOIOgLgDIO4AiDvAYV9Vb93KjK1TVllllVVW+bkDIO4A4g6AuAMg7gCIOwDiDiDuAIg7AOIOgLgDIO4AiDuAuAMg7gCIOwDiDoC4A4g7AOIOgLgDIO4AiDsA4g5w25uZrVtVvXUqM6yyyiqrrPJzB0DcAcQdAHEHQNwBEHcAxB1A3AEQdwDEHQBxB0DcARB3AHEHQNwBEHcAxB0AcQcQdwDEHQBxB0DcARB3AMQd4LCvqrduZcbWKausssoqq/zcARB3AHEHQNwBEHcAxB0AcQcQdwDEHQBxB0DcARB3AMQdQNwBEHcAxB0AcQdA3AHEHQBxB0DcARB3AMQdAHEHuO3NzNatqt46lRlWWWWVVVb5uQMg7gDiDoC4AyDuAIg7AOIOIO4AiDsA4g6AuAMg7gCIO4C4AyDuAIg7AOIOgLgDiDsA4g6AuAMg7gCIOwDiDnDYV9VbtzJj65RVVllllVV+7gCIO4C4AyDuAIg7AOIOgLgDiDsA4g6AuAMg7gCIOwDiDiDuAIg7AOIOgLgDIO4A4g6AuAMg7gCIOwDiDoC4A9z2ZmbrVlVvncoMq6yyyiqr/NwBEHcAcQdA3AEQdwDEHQBxBxB3AMQdAHEHQNwBEHcAxB1A3AEQdwDEHQBxB0DcAcQdAHEHQNwBEHcAxB0AcQc47B+WhXPFJ6AryQAAAABJRU5ErkJggg=='

			window = Piece(index = 0, title = 'A Window', artist = 'An Architect', description = 'A window...', artist_pk_id = 0, num_likes = 0, content_src = 'clear', content_pos_x = 0, content_pos_y = 0, content_width = 630, content_height = 700, wall_id = 0)
			db.session.add(window)
			desk = Piece(index = 1, title = 'A Desk', artist = 'An Idiot', description = 'A desk...', artist_pk_id = 0, num_likes = 0, content_src = 'clear', content_pos_x = 0, content_pos_y = 700, content_width = 510, content_height = 380, wall_id = 0)
			db.session.add(desk)
			curtain = Piece(index = 2, title = 'A Curtain', artist = 'Mum', description = 'This is a curtain... What else do you expect?', artist_pk_id = 0, num_likes = 0, content_src = 'clear', content_pos_x = 600, content_pos_y = 0, content_width = 220, content_height = 820, wall_id = 0)
			db.session.add(curtain)
			closet_door = Piece(index = 3, title = 'A Closet Door', artist = 'Closet Artist', description = 'A closet door for a closet...', artist_pk_id = 0, num_likes = -100, content_src = 'clear', content_pos_x = 0, content_pos_y = 0, content_width = 800, content_height = 1080, wall_id = 1)
			db.session.add(closet_door)
			room_door = Piece(index = 4, title = 'A Room Door', artist = '._.', description = 'A Dur', artist_pk_id = 0, num_likes = 0, content_src = 'clear', content_pos_x = 0, content_pos_y = 170, content_width = 440, content_height = 910, wall_id = 2)
			db.session.add(room_door)
			bed = Piece(index = 5, title = 'A Bed', artist = 'Me', description = 'Where the magic (or lackthereof more likely) happens...', artist_pk_id = 0, num_likes = 999999, content_src = 'clear', content_pos_x = 750, content_pos_y = 650, content_width = 900, content_height = 430, wall_id = 2)
			db.session.add(bed)
			light = Piece(index = 6, title = 'Lit', artist = 'Litty Ling', description = 'Had me out like a light, like a light, like a light, like a light, like a light (yeah), like a light, like a light...', artist_pk_id = 0, num_likes = 420, content_src = 'clear', content_pos_x = 1590, content_pos_y = 260, content_width = 170, content_height = 820, wall_id = 2)
			db.session.add(light)
			window_and_desk = Piece(index = 7, title = 'A Window and a Desk (Again)', artist = 'An Architect and an Idiot', description = 'Different window... Same desk...', artist_pk_id = 0, num_likes = 0, content_src = 'clear', content_pos_x = 1700, content_pos_y = 0, content_width = 220, content_height = 1080, wall_id = 3)
			db.session.add(window_and_desk)
			curtain_side = Piece(index = 8, title = 'A Curtain (Again)', artist = 'Mum', description = 'Different curtain...', artist_pk_id = 0, num_likes = 0, content_src = 'clear', content_pos_x = 1350, content_pos_y = 0, content_width = 350, content_height = 820, wall_id = 3)
			db.session.add(curtain_side)
			db.session.commit()
			print('Success creating database...')
		except SQLAlchemyError as ex:
			print('Error creating clear zones...', ex)

createClearZones()