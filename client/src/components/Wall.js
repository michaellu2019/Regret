import React from 'react';
import {DragDropContainer, DropTarget} from 'react-drag-drop-container';

import WallPiece from './WallPiece';

class Wall extends React.Component {
	pieces = [];
	hitboards = [];
	constructor(props) {
		super(props);
		this.state = {
			pieces: [],
			canPlace: true,
			imgToAddTitle: 'Untitled Piece',
			imgToAddDescription: 'A beautiful work of art.',
			imgToAddWidth: '200px',
			imgDragging: false,
			hitbox: {
	        	src: '',
	        	x: 0,
	        	y: 0,
	        	w: 0,
	        	h: 0
	        },
	        hitboards: [],
	        pieceToShow: null,
			buffering: false,
			bufferingCounter: 15,
			loadingMessageIndex: 0,
			loadingMessages: ['Unfortunately... This may take a while...',
							  'Don\'t you hate it when you tell him something sentimental, and he texts back \"Cool Beans 🥔🥔🥔\"? (jhn)',
							  'I could get cuffed by the time this loads. Hell, I could even get married!',
							  'TFW you make the same mistake twice...',
							  'I\'m going to grow a full beard by the time this loads!',
							  'According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don\'t care what humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Let\'s shake it up a little. Barry! Breakfast is ready! Ooming! Hang on a second. Hello? - Barry? - Adam? - Oan you believe this is happening? - I can\'t. I\'ll pick you up. Looking sharp. Use the stairs. Your father paid good money for those. Sorry. I\'m excited. Here\'s the graduate. We\'re very proud of you, son. A perfect report card, all B\'s. Very proud. Ma! I got a thing going here. - You got lint on your fuzz. - Ow! That\'s me! - Wave to us! We\'ll be in row 118,000. - Bye! Barry, I told you, stop flying in the house! - Hey, Adam. - Hey, Barry. - Is that fuzz gel? - A little. Special day, graduation. Never thought I\'d make it. Three days grade school, three days high school. Those were awkward. Three days college. I\'m glad I took a day and hitchhiked around the hive. You did come back different. - Hi, Barry. - Artie, growing a mustache? Looks good. - Hear about Frankie? - Yeah. - You going to the funeral? - No, I\'m not going. Everybody knows, sting someone, you die. Don\'t waste it on a squirrel. Such a hothead. I guess he could have just gotten out of the way. I love this incorporating an amusement park into our day. That\'s why we don\'t need vacations. Boy, quite a bit of pomp... under the circumstances. - Well, Adam, today we are men. - We are! - Bee-men.'],
			currentWall: 0,
			imgToAddSrc: '',
			mobileUser: false,
			errorWindowMsg: ''
		};
		this.loadPieces = this.loadPieces.bind(this);
		this.createHitboard = this.createHitboard.bind(this);
		this.addPieceToHitboard = this.addPieceToHitboard.bind(this);
		this.checkPieceClear = this.checkPieceClear.bind(this);
		this.setHitboxOffset = this.setHitboxOffset.bind(this);
        this.handleImgPick = this.handleImgPick.bind(this);
        this.handleImgDrag = this.handleImgDrag.bind(this);
        this.handleImgDrop = this.handleImgDrop.bind(this);
        this.getOpenSpot = this.getOpenSpot.bind(this);
        this.autoPlace = this.autoPlace.bind(this);
        this.renderPieces = this.renderPieces.bind(this);
        this.adjustImgProps = this.adjustImgProps.bind(this);
        this.getPieceInfo = this.getPieceInfo.bind(this);
        this.hidePieceInfo = this.hidePieceInfo.bind(this);
        this.likePiece = this.likePiece.bind(this);
        this.hidePopUpWindow = this.hidePieceInfo.bind(this);
        this.bufferingTick = this.bufferingTick.bind(this);
        this.startBufferingCountdown = this.startBufferingCountdown.bind(this);
        this.intervalHandle = null;
	}

	componentDidMount() {
		this.setState({
			buffering: true,
			loadingMessageIndex: Math.floor(Math.random() * 3)
		});
		this.loadPieces();


        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        	this.setState({
        		mobileUser: true
        	});
        }

        this.startBufferingCountdown();
	}

	bufferingTick() {
		if (this.state.bufferingCounter == 0) {
			clearInterval(this.intervalHandle);
			return;
		}

		if (this.state.bufferingCounter % 5 == 0) {
        	this.setState({
        		loadingMessageIndex: Math.floor(Math.random() * this.state.loadingMessages.length)
        	});
		}

		this.setState({
			bufferingCounter: this.state.bufferingCounter - 1
		});
	}

	startBufferingCountdown() {
		this.intervalHandle = setInterval(this.bufferingTick, 1300);
	}

	loadPieces() {
        console.log('Loading wall...');
        const requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'}
        };
        fetch(/*this.state.serverRoute + */'/load_wall', requestOptions).then(response => response.json()).then((responseData) => {
            if (responseData.status == 'success') {
                console.log('Loading successful...', responseData);
                this.pieces = responseData.data.pieces;

                console.log('Creating Hitboards');
				this.createHitboard();
				for (var i = 0; i < this.pieces.length; i++) {
					this.addPieceToHitboard(this.pieces[i]);
				}
				console.log('Done Creating Hitboards');

				clearInterval(this.intervalHandle);
                this.setState({
                    pieces: responseData.data.pieces,
                    buffering: false,
                    hitboards: this.hitboards,
                    bufferingCounter: 0
                });

                this.props.changeBufferingStatus(false);
            } else {
                console.log('Loading failed...', responseData);
				this.setState({
					buffering: false
				});
            }
        }).catch((error) => {
            console.log('Loading error...', error);
			this.setState({
				buffering: false
			});
        });
	}

	createHitboard() {
		for (var i = 0; i < 4; i++) {
			var hitboard = []
			for (var y = 0; y < this.wall.clientHeight; y++) {
				var row = [];
				for (var x = 0; x < this.wall.clientWidth; x++) {
					row.push(0);
				}
				hitboard.push(row);
			}
			this.hitboards.push(hitboard);
		}
	}

	addPieceToHitboard(piece) {
		for (var y = Math.floor(piece.y); y < piece.y + piece.h; y++) {
			for (var x = Math.floor(piece.x); x < piece.x + piece.w; x++) {
				this.hitboards[piece.wallId][y][x] = 1;
			}
		}
	}

    checkPieceClear(hitbox) {
    	var canPlace = true;
    	const offset = 20;
    	for (var i = 0; i < this.state.pieces.length; i++) {
    		var piece = this.state.pieces[i];

    		if (piece.wallId == this.props.currentWall &&
    			hitbox.x + offset < piece.x + piece.w && hitbox.x + hitbox.w - offset > piece.x &&
    			hitbox.y + offset < piece.y + piece.h && hitbox.y + hitbox.h - offset > piece.y) {
    			canPlace = false;
    		}
    	}

    	if (!(hitbox.x >= 0 && hitbox.x + hitbox.w < this.wall.clientWidth &&
    		hitbox.y >= 0 && hitbox.y + hitbox.h < this.wall.clientHeight)) {
    		canPlace = false;
    	}

    	return canPlace;
    }

    setHitboxOffset(e) {
    	this.setState({
    		hitboxOffset: {
    			x: e.pageX - document.getElementById('image-to-add').getBoundingClientRect().x - window.scrollX,
    			y: e.pageY - document.getElementById('image-to-add').getBoundingClientRect().y - window.scrollY
    		}
    	});
    }

    handleImgPick(e) {
    	if (!this.props.imgToAddPlaced && !this.state.mobileUser) {
	        // e.dataTransfer.setData('text/plain', this.imgToAdd.width, this.imgToAdd.height);
	        // e.dataTransfer.setDragImage(this.imgToAdd, 0, 0);
	        this.setState({
	            imgToAddSrc: this.imgToAdd.src
	        });
	    }
    }

    handleImgDrag(dragData, target, x, y) {
	    // e.preventDefault();
    	if (!this.props.imgToAddPlaced && !this.state.mobileUser) {
	    	const hitbox = {
	        	src: this.imgToAdd.src,
	        	x: x - this.state.hitboxOffset.x  + window.scrollX,
	        	y: y - this.state.hitboxOffset.y + window.scrollY,
	        	w: this.imgToAdd.clientWidth,
	        	h: this.imgToAdd.clientHeight
	        }

	        var hitboxClear = this.checkPieceClear(hitbox);
	        this.setState({
	        	canPlace: hitboxClear,
	        	hitbox: hitbox,
				imgDragging: true
	        });
	    }
    }

    handleImgDrop(dragData, target, x, y) {
        const piece = {
        	pkId: -1,
        	index: this.state.pieces.length,
        	title: this.state.imgToAddTitle,
        	artist: this.props.user.username,
        	description: this.state.imgToAddDescription,
        	artistPkId: this.props.user.pkId,
        	likesPkIds: [],
        	numLikes: 0,
        	src: this.state.imgToAddSrc,
        	x: Math.floor(this.state.hitbox.x),
        	y: Math.floor(this.state.hitbox.y),
        	w: Math.floor(this.state.hitbox.w),
        	h: Math.floor(this.state.hitbox.h),
        	wallId: this.props.currentWall
        }
        console.log('Dropping ', piece);

	    if (this.checkPieceClear(piece)) {
	    	console.log('Piece clear...');
	    	var img = new Image();
			img.crossOrigin = 'Anonymous';
	    	img.src = this.state.imgToAddSrc;
	    	var that = this;
	        that.setState({
	        	canPlace: true,
				imgDragging: false,
		        buffering: true,
				loadingMessageIndex: Math.floor(Math.random() * this.state.loadingMessages.length),
				hitbox: {
		        	src: '',
		        	x: 0,
		        	y: 0,
		        	w: 0,
		        	h: 0
		        },
		        hitboxOffset: {
		        	x: 0,
		        	y: 0
		        }
	        });

	    	img.onload = function() {
	    		console.log('Image loaded...');

	    		var scalingFactor = 1;
	    		const widthCap = 720;
	    		if (img.naturalWidth > widthCap) {
	    			scalingFactor = img.naturalWidth/widthCap;
	    			console.log('Image rescaled from ' + img.naturalWidth + ' x ' + img.naturalHeight + ' to ' + img.naturalWidth/scalingFactor + ' x ' + img.naturalHeight/scalingFactor + '...');
	    		}

	    		that.hiddenCanvas.width = img.naturalWidth/scalingFactor;
	    		that.hiddenCanvas.height = img.naturalHeight/scalingFactor;
	    		var ctx = that.hiddenCanvas.getContext('2d');
	    		ctx.drawImage(img, 0, 0, img.naturalWidth/scalingFactor, img.naturalHeight/scalingFactor);
	    		var uri = that.hiddenCanvas.toDataURL('image/png'); 
	    		var b64URI = 'data:image/png;base64,' + uri.replace(/^data:image.+;base64,/, '');
		    	piece.src = b64URI;

		        console.log('Adding piece to wall...');
		        const requestOptions = {
		            method: 'POST',
		            mode: 'cors',
		            headers: {'Content-Type': 'application/json'},
		            body: JSON.stringify({piece: piece})
		        };
		        fetch(/*this.state.serverRoute + */'/add_piece', requestOptions).then(response => response.json()).then((responseData) => {
		            if (responseData.status == 'success') {
		                console.log('Addition successful...', responseData);
				        that.pieces.push(responseData.data.piece); 
			        	that.props.pieceAddedToWall();

			        	that.setState({
			        		pieces: that.pieces,
			        		buffering: false
			        	});

		                const updatedUser = {
							username: responseData.data.user.username, 
							fbId: responseData.data.user.fbId, 
							pkId: responseData.data.user.pkId, 
							profilePicture: responseData.data.user.profilePicture, 
							numPieces: responseData.data.user.numPieces,
                        	maxNumPieces: responseData.data.user.maxNumPieces
		                }
		                that.props.updateUser(updatedUser);
		            } else {
		                console.log('Addition failed...', responseData);
		            }
		        }).catch((error) => {
		            console.log('Addition error...', error);
		        });
	    	}
	    } else {
	    	console.log('Piece not clear...');
	    	this.setState({
	        	canPlace: true,
				imgDragging: false,
				buffering: false,
				hitbox: {
		        	src: '',
		        	x: 0,
		        	y: 0,
		        	w: 0,
		        	h: 0
		        },
		        hitboxOffset: {
		        	x: 0,
		        	y: 0
		        }
	    	});
	    }
    }

    getOpenSpot(piece) {
    	var hitboard = this.hitboards[this.props.currentWall];
    	// console.log(hitboard.length, hitboard[0].length, piece.w, piece.h)
    	for (var y = 0; y < hitboard.length - piece.h; y += 5) {
    		for (var x = 0; x < hitboard[y].length - piece.w; x += 5) {
    			// console.log(y, x, hitboard[y][x], ' and ', y, x + piece.w - 1, hitboard[y][x + piece.w - 1], ' and ', y + piece.h - 1, x, hitboard[y + piece.h - 1][x], ' and ', y + piece.h - 1, x + piece.w - 1, hitboard[y + piece.h - 1][x + piece.w - 1]);
    			if (hitboard[y][x] == 0 && hitboard[y][x + piece.w - 1] == 0 &&
    				hitboard[y + piece.h - 1][x] == 0 && hitboard[y + piece.h - 1][x + piece.w - 1] == 0) {
    				// console.log('start', x, y);
					var perimeterClear = true;
					var areaClear = true;

					// console.log('sweep H');
					for (var i = 1; i < piece.w - 1; i += 10) {
						// console.log('break H?', x + i, y, hitboard[y][x + i], ' or ', x + i, y + piece.h - 1, hitboard[y + piece.h - 1][x + i]);
						if (hitboard[y][x + i] == 1 || hitboard[y + piece.h - 1][x + i] == 1) {
							// console.log('break H')
							perimeterClear = false;
							break;
						}
					}

					if (perimeterClear) {
						// console.log('sweep V');
						for (var j = 1; j < piece.h - 1; j += 10) {
							// console.log('break V?', x, y + j, hitboard[y + j][x], ' or ', x + piece.w - 1, y + j, hitboard[y + j][x + piece.w - 1]);
							if (hitboard[y + j][x] == 1 || hitboard[y + j][x + piece.w - 1] == 1) {
								// console.log('break V');
								perimeterClear = false;
								break;
							}
						}
					}

					if (perimeterClear) {
						for (var i = x + 1; i < x + piece.w - 2; i += 35) {
							for (var j = y + 1; j < y + piece.h - 2; j+= 35) {
								if (hitboard[j][i] == 1) {
									// console.log('break A');
									areaClear = false;
									break;
								}
							}
						}
					}

					// console.log('all clear?', perimeterClear, areaClear);
					if (perimeterClear && areaClear) {
						// console.log('return all clear');
						return {x: x, y: y}
					}
    			}
    		}
    	}

    	return {x: -1, y: -1}
    }

    autoPlace() {
    	var hitbox = {
    		w: document.getElementById('image-to-add').width,
    		h: document.getElementById('image-to-add').height
    	}
    	console.log(hitbox);
    	this.setState({
    		imgToAddSrc: document.getElementById('image-to-add').src
	    }, () => {
    		const openSpot = this.getOpenSpot(hitbox);

	    	if (openSpot.x > -1 && openSpot.y > -1) {
		    	hitbox.x = openSpot.x;
		    	hitbox.y = openSpot.y;
		    	this.setState({
		    		hitbox: hitbox
		    	}, () => {
		    		console.log('sending to ', openSpot.x, openSpot.y);
		    		this.handleImgDrop({}, {}, openSpot.x, openSpot.y);
		    	});
	    	} else {
	    		this.setState({
	    			errorWindowMsg: 'There\'s no space on this wall for your image. Try decreasing the size or cycling to another wall!'
	    		});
	    	}
    	});
    }

    adjustImgProps(adjustment) {
    	if (adjustment == 'title') {
    		this.setState({
	    		imgToAddTitle: this.imgTitle.value
	    	});
    	} else if (adjustment == 'description') {
    		this.setState({
	    		imgToAddDescription: this.imgDescription.value
	    	});
    	} else if (adjustment == 'size') {
	    	this.setState({
	    		imgToAddWidth: this.imgSlider.value + 'px'
	    	});
    	}
    }

    renderPieces(piece, index) {
    	return (
			<WallPiece id = {"wall-piece-" + index} currentWall = {this.props.currentWall} artistPkId = {piece.artistPkId} wallId = {piece.wallId} key = {index} index = {index} imgSrc = {piece.src} getPieceInfo = {this.getPieceInfo} handleImgDrag = {(e) => this.handleImgDrag(e)} handleImgDrop = {(e) => this.handleImgDrop(e)} x = {piece.x} y = {piece.y} width = {piece.w} height = {piece.h} />
    	)
    }

    getPieceInfo(index) {
    	this.setState({
    		pieceToShow: this.state.pieces[index]
    	});
    }

    hidePieceInfo() {
    	this.setState({
    		pieceToShow: null
    	});
    }

    likePiece() {
    	var piece = this.state.pieceToShow;
    	if (!piece.likesPkIds.includes(this.props.user.pkId)) {
			console.log("Liking piece...", piece);
			this.setState({
				buffering: true,
				loadingMessageIndex: Math.floor(Math.random() * this.state.loadingMessages.length),
			});

			const data = {
				userPkId: this.props.user.pkId,
				piecePkId: piece.pkId
			}
		    const requestOptions = {
		        method: 'POST',
		        mode: 'cors',
		        headers: {'Content-Type': 'application/json'},
		        body: JSON.stringify({data: data})
		    };
		    fetch(/*this.state.serverRoute + */'/like_piece', requestOptions).then(response => response.json()).then((responseData) => {
		        if (responseData.status == 'success') {
		            console.log('Like successful...', responseData);
		            this.pieces[responseData.data.piece.index] = responseData.data.piece
		            this.setState({
		            	pieceToShow: responseData.data.piece,
		            	pieces: this.pieces,
		            	buffering: false
		            });
		        } else {
		            console.log('Like failed...', responseData);
		        }
		    }).catch((error) => {
		        console.log('Like error...', error);
		    });
		}
    }

    hidePopUpWindow() {
        this.setState({
            errorWindowMsg: ''
        });
    }

	render() {
		const wallColors = ['#f5f5f5', '#e0e0e0', '#9e9e9e', '#616161'];

		return (
			<div style = {{cursor: this.state.mouseCursor}} className = "wall-container">
				<DropTarget>
					<div id = "wall-front" className = {this.props.currentWall == 0 ? "wall" : "wall hide"} ref = {(ref) => {this.wall = ref}} style = {{opacity: this.props.currentWall == 0 && this.state.canPlace ? 1 : 0.5, backgroundColor: wallColors[0]}}></div>
				</DropTarget>
				<DropTarget>
					<div id = "wall-right" className = {this.props.currentWall == 1 ? "wall" : "wall hide"} ref = {(ref) => {this.wall = ref}} style = {{opacity: this.props.currentWall == 1 && this.state.canPlace ? 1 : 0.5, backgroundColor: wallColors[1]}} onDragOver = {(e) => this.handleImgDrag(e)} onDrop = {(e) => this.handleImgDrop(e)}></div>
				</DropTarget>
				<DropTarget>	
					<div id = "wall-back" className = {this.props.currentWall == 2 ? "wall" : "wall hide"} ref = {(ref) => {this.wall = ref}} style = {{opacity: this.props.currentWall == 2 && this.state.canPlace ? 1 : 0.5, backgroundColor: wallColors[2]}} onDragOver = {(e) => this.handleImgDrag(e)} onDrop = {(e) => this.handleImgDrop(e)}></div>
				</DropTarget>
				<DropTarget>
					<div id = "wall-left" className = {this.props.currentWall == 3 ? "wall" : "wall hide"} ref = {(ref) => {this.wall = ref}} style = {{opacity: this.props.currentWall == 3 && this.state.canPlace ? 1 : 0.5, backgroundColor: wallColors[3]}} onDragOver = {(e) => this.handleImgDrag(e)} onDrop = {(e) => this.handleImgDrop(e)}></div>
				</DropTarget>

				{this.state.pieces.map((piece, index) => (
					this.renderPieces(piece, index)
				))}

				<img id = "hitbox" style = {{pointerEvents: "none", display: "inline", position: "absolute", left: this.state.hitbox.x + 'px', top: this.state.hitbox.y + 'px'}} src = {this.state.hitbox.src} width = {this.state.hitbox.w} />

				{this.props.imgToAddSrc && !this.props.imgToAddPlaced ? 
					<div className = {this.state.imgDragging ? "image-to-add-container hide" : "image-to-add-container"}>
						<div className = "image-to-add-text-inputs">
							Title: <input className = "image-to-add-text-input" ref = {(ref) => {this.imgTitle = ref}} type = "text" onChange = {() => this.adjustImgProps('title')} /><br />
							Description: <input className = "image-to-add-text-input" ref = {(ref) => {this.imgDescription = ref}} type = "text" onChange = {() => this.adjustImgProps('description')} /><br />
						</div>
						Adjust Image Size: <input ref = {(ref) => {this.imgSlider = ref}} type = "range" min = "30" max = "200" onChange = {() => this.adjustImgProps('size')} /><br />
						
						{!this.state.mobileUser ? 
							<DragDropContainer ref = {(ref) => {this.imgToDrag = ref}} onDragStart = {this.handleImgPick} onDrag = {this.handleImgDrag} onDragEnd = {this.handleImgDrop}>
								<img src = {this.props.imgToAddSrc} id = "image-to-add" className = "image-to-add" ref = {(ref) => {this.imgToAdd = ref}} draggable = "false" width = {this.state.imgToAddWidth} onMouseDown = {(e) => this.setHitboxOffset(e)} />
							</DragDropContainer>
						: 
							<img src = {this.props.imgToAddSrc} id = "image-to-add" className = "image-to-add" ref = {(ref) => {this.imgToAdd = ref}} draggable = "false" width = {this.state.imgToAddWidth} onMouseDown = {(e) => this.setHitboxOffset(e)} />	
						}
						<br />
						{!this.state.mobileUser ? "Click and Drag Image to Place" : ""} <br />
						<div className = "ghost-button" onClick = {this.autoPlace}>Auto Place</div>
					</div>
				: ""}

				<div className = {this.state.pieceToShow != null ? "wall-piece-info-container" : "wall-piece-info-container hide"}>
					<span className = "close-window-button" onClick = {this.hidePieceInfo}>+</span> 
					{this.state.pieceToShow != null ?
						<div className = "wall-piece-info-grid-container">
							<div className = "wall-piece-info-image-container">
								{this.state.pieceToShow.src != 'clear' ? <img src = {this.state.pieceToShow.src} className = "wall-piece-info-image" /> : ""}
							</div>
							<div className = "wall-piece-info">
								<span className = "heading">{this.state.pieceToShow.title}</span>
								<span className = "subheading">By {this.state.pieceToShow.artist}</span>
								<p>Description: {this.state.pieceToShow.description}</p>
								<svg className = {this.state.pieceToShow.likesPkIds.includes(this.props.user.pkId) ? "active" : "unloved"} onClick = {this.likePiece}><path d = "M34.692 0c-4.998 0-9.261 3.969-11.172 8.232C21.609 3.969 17.346 0 12.348 0 5.586 0 0 5.586 0 12.348c0 13.818 13.965 17.493 23.52 31.164 8.967-13.671 23.52-17.787 23.52-31.164C47.04 5.586 41.454 0 34.692 0z"/></svg>
								<span className = "likes-counter">{this.state.pieceToShow.numLikes}</span>
							</div>
						</div>
					: ""}
				</div>

                <div className = {this.state.errorWindowMsg != '' ? "error-window-container" : "error-window-container hide"}>
                    <span className = "close-window-button" onClick = {this.hidePopUpWindow}>+</span>
                    <span className = "heading">{this.state.errorWindowMsg}</span>
                </div>

				{this.state.buffering && this.props.user.fbId != '' ?
					<div className = "buffering-container">
						<span className = "heading">
							<i>Loading Data...</i><br />
							{this.state.loadingMessages[this.state.loadingMessageIndex]}
							<br /><br />
							{this.state.bufferingCounter != 0 ? this.state.bufferingCounter : ""}
						</span>
					</div>
				: ""}

				<canvas id = "hidden-canvas" ref = {(ref) => {this.hiddenCanvas = ref}} style = {{display: "none"}}></canvas>
			</div>
		);
	}
}

export default Wall;