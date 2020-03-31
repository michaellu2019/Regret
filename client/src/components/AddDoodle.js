// Source Code: https://github.com/christiannwamba/react-paintapp/blob/master/src/canvas.js
import React from 'react';

import ColorSelector from './ColorSelector';
import StrokeWeightSelector from './StrokeWeightSelector';
import ImageSelector from './ImageSelector';

class AddDoodle extends React.Component {
	isPainting = false;
	backgroundColor = '#ffffff';
	strokeColor = '#000000';
	fillColor = 'none';
	strokeWeight = 1;
	prevMousePos = {x: 0, y: 0};
	prevDragMousePos = {x: 0, y: 0};
	imgToPlace = {src: '', aspectRatio: 1};
	strokes = [];
	lines = [];
	rects = [];
	ellipses = [];
	images = [];
	elements = [];
	undos = [];
	mode = 'stroke';

	constructor(props) {
		super(props);
		this.state = {
			backgroundColor: '#ffffff',
			elements: [],
			mode: 'stroke',
			showImageSelect: false
		};
		this.toggleMode = this.toggleMode.bind(this);
		this.initCanvas = this.initCanvas.bind(this);
		this.getMousePos = this.getMousePos.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.endPaintEvent = this.endPaintEvent.bind(this);
        this.useImg = this.useImg.bind(this);
        this.showStroke = this.showStroke.bind(this);
        this.showErase = this.showErase.bind(this);
        this.showRect = this.showRect.bind(this);
        this.showImg = this.showImg.bind(this);
        this.renderCanvas = this.renderCanvas.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.changeStrokeWeight = this.changeStrokeWeight.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.clearCanvas = this.clearCanvas.bind(this);
        this.save = this.save.bind(this);
	}

	componentDidMount() {
		this.initCanvas();
		window.addEventListener('resize', this.initCanvas);
	}

	toggleMode(mode) {
		this.setState({
			mode: mode,
			showImageSelect: false
		});
		this.mode = mode;

		if (mode == 'img') {
			this.imgToPlace = {src: '', aspectRatio: 1};
			this.setState({
				showImageSelect: true
			});
		}
	}

	initCanvas() {
		this.canvas.width = this.doodleCanvasContainer.clientWidth;
		this.canvas.height = this.doodleCanvasContainer.clientHeight;
		this.ctx = this.canvas.getContext('2d');
		this.renderCanvas();
	}

	getMousePos(e) {
		const rect = this.canvas.getBoundingClientRect();
		return {x: e.x - rect.left, y: e.y - rect.top};
	}

	onMouseDown({nativeEvent}) {
		this.isPainting = true;
		this.prevMousePos = this.getMousePos(nativeEvent);

		if (this.mode == 'line' || this.mode == 'rect' || this.mode == 'ellipse' || this.mode == 'img') {
			this.prevDragMousePos = this.prevMousePos;
		}
	}

	onMouseMove({nativeEvent}) {
		if (this.isPainting) {
			const currMousePos = this.getMousePos(nativeEvent);

			if (this.mode == 'stroke') {
				this.showStroke(this.prevMousePos, currMousePos, this.strokeColor, this.strokeWeight, true);
			} else if (this.mode == 'eraser') {
				this.showErase(this.prevMousePos, currMousePos, this.strokeWeight, true);
			} else if (this.mode == 'line') {
				this.renderCanvas();
				this.showLine(this.prevDragMousePos, currMousePos, this.strokeColor, this.strokeWeight, false);
			} else if (this.mode == 'rect') {
				this.renderCanvas();
				this.showRect(this.prevDragMousePos, currMousePos, this.strokeColor, this.strokeWeight, this.fillColor, false);
			} else if (this.mode == 'ellipse') {
				this.renderCanvas();
				this.showEllipse(this.prevDragMousePos, currMousePos, this.strokeColor, this.strokeWeight, this.fillColor, false);
			} else if (this.mode == 'img') {
				this.renderCanvas();
				var imgObj = new Image();
				imgObj.src = this.imgToPlace.src;
				imgObj.ctx = this.ctx;
				var that = this;
				imgObj.onload = function() {
					that.showImg(imgObj, that.prevDragMousePos, currMousePos, false);
				}
			} 

			this.prevMousePos = currMousePos;
		}
	}

	endPaintEvent({nativeEvent}) {
		if (this.isPainting) {
			this.isPainting = false;
			const offsetMousePos = {x: this.prevMousePos.x + 0.5, y: this.prevMousePos.y + 0.5};

			if (this.mode == 'stroke') {
				this.showStroke(this.prevMousePos, offsetMousePos, this.strokeColor, this.strokeWeight, true);
			} else if (this.mode == 'eraser') {
				this.showErase(this.prevMousePos, offsetMousePos, this.strokeWeight, true);
			} else if (this.mode == 'line') {
				this.renderCanvas();
				this.showLine(this.prevDragMousePos, this.prevMousePos, this.strokeColor, this.strokeWeight, true);
			} else if (this.mode == 'rect') {
				this.renderCanvas();
				this.showRect(this.prevDragMousePos, this.prevMousePos, this.strokeColor, this.strokeWeight, this.fillColor, true);
			} else if (this.mode == 'ellipse') {
				this.renderCanvas();
				this.showEllipse(this.prevDragMousePos, this.prevMousePos, this.strokeColor, this.strokeWeight, this.fillColor, true);
			} else if (this.mode == 'img') {
				this.renderCanvas();
				this.renderCanvas();
				var imgObj = new Image();
				imgObj.src = this.imgToPlace.src;
				imgObj.ctx = this.ctx;
				var that = this;
				imgObj.onload = function() {
					that.showImg(imgObj, that.prevDragMousePos, that.prevMousePos, true);
				}
			} 
		}
	}

	showStroke(prevPos, currPos, color, strokeWeight, create) {
		const stroke = {
			type: 'stroke',
			strokeColor: color,
			strokeWeight: strokeWeight,
			pos: prevPos,
			nextPos: currPos,
		};

		if (stroke.strokeColor != 'none') {
			this.ctx.strokeStyle = stroke.strokeColor;
			this.ctx.lineWidth = stroke.strokeWeight;
			this.ctx.beginPath();
			this.ctx.lineJoin = 'round';
			this.ctx.moveTo(stroke.pos.x, stroke.pos.y);
			this.ctx.lineTo(stroke.nextPos.x, stroke.nextPos.y);
			this.ctx.closePath();
			this.ctx.stroke();
		}

		if (create) {
			this.strokes.push(stroke);
			this.elements.push(stroke);
		}
	}

	showErase(prevPos, currPos, strokeWeight, create) {
		const eraser = {
			type: 'eraser',
			strokeColor: this.backgroundColor,
			strokeWeight: strokeWeight,
			pos: prevPos,
			nextPos: currPos,
		};

		if (eraser.strokeColor != 'none') {
			this.ctx.strokeStyle = eraser.strokeColor;
			this.ctx.lineWidth = eraser.strokeWeight;
			this.ctx.beginPath();
			this.ctx.lineJoin = 'round';
			this.ctx.moveTo(eraser.pos.x, eraser.pos.y);
			this.ctx.lineTo(eraser.nextPos.x, eraser.nextPos.y);
			this.ctx.closePath();
			this.ctx.stroke();
		}

		if (create) {
			this.strokes.push(eraser);
			this.elements.push(eraser);
		}
	}

	showLine(prevPos, currPos, color, strokeWeight, create) {
		const line = {
			type: 'line',
			strokeColor: color,
			strokeWeight: strokeWeight,
			pos: prevPos,
			nextPos: currPos,
		}

		if (line.strokeColor != 'none') {
			this.ctx.strokeStyle = line.strokeColor;
			this.ctx.lineWidth = line.strokeWeight;
			this.ctx.beginPath();
			this.ctx.moveTo(line.pos.x, line.pos.y);
			this.ctx.lineTo(line.nextPos.x, line.nextPos.y);
			this.ctx.closePath();
			this.ctx.stroke();
		}

		if (create) {
			this.lines.push(line);
			this.elements.push(line);
		}
	}

	showRect(prevPos, currPos, strokeColor, strokeWeight, fillColor, create) {
		const rect = {
			type: 'rect',
			strokeColor: strokeColor,
			strokeWeight: strokeWeight,
			fillColor: fillColor,
			pos: prevPos,
			nextPos: currPos,
			size: {w: currPos.x - prevPos.x, h: currPos.y - prevPos.y}
		}


		if (rect.strokeColor != 'none') {
			this.ctx.strokeStyle = rect.strokeColor;
			this.ctx.lineWidth = rect.strokeWeight;
			this.ctx.beginPath();
			this.ctx.lineJoin = 'miter';
			this.ctx.rect(rect.pos.x, rect.pos.y, rect.size.w, rect.size.h);
			this.ctx.closePath();
			this.ctx.stroke();
		}

		if (rect.fillColor != 'none') {
			this.ctx.fillStyle = rect.fillColor;
			this.ctx.fillRect(rect.pos.x, rect.pos.y, rect.size.w, rect.size.h);
		}

		if (create) {
			this.rects.push(rect);
			this.elements.push(rect);
		}
	}

	showEllipse(prevPos, currPos, strokeColor, strokeWeight, fillColor, create) {
		const ellipse = {
			type: 'ellipse',
			strokeColor: strokeColor,
			strokeWeight: strokeWeight,
			fillColor: fillColor,
			pos: prevPos,
			nextPos: currPos,
			size: {w: currPos.x - prevPos.x, h: currPos.y - prevPos.y}
		}


		if (ellipse.strokeColor != 'none') {
			this.ctx.strokeStyle = ellipse.strokeColor;
			this.ctx.lineWidth = ellipse.strokeWeight;
			this.ctx.beginPath();
			this.ctx.ellipse((ellipse.pos.x + ellipse.nextPos.x)/2, (ellipse.pos.y + ellipse.nextPos.y)/2, Math.abs(ellipse.size.w/2), Math.abs(ellipse.size.h/2), 0, 0, 2 * Math.PI);
			this.ctx.closePath();
			this.ctx.stroke();
		}

		if (ellipse.fillColor != 'none') {
			this.ctx.fillStyle = ellipse.fillColor;
			this.ctx.beginPath();
			this.ctx.ellipse((ellipse.pos.x + ellipse.nextPos.x)/2, (ellipse.pos.y + ellipse.nextPos.y)/2, Math.abs(ellipse.size.w/2), Math.abs(ellipse.size.h/2), 0, 0, 2 * Math.PI);
			this.ctx.fill();
		}

		if (create) {
			this.ellipses.push(ellipse);
			this.elements.push(ellipse);
		}
	}

	showImg(imgObj, prevPos, currPos, create) {
		const img = {
			type: 'img',
			src: this.imgToPlace.src,
			obj: imgObj,
			pos: prevPos,
			nextPos: currPos,
			size: {w: (currPos.y - prevPos.y) * (imgObj.width/imgObj.height), h: currPos.y - prevPos.y}
		}

		this.ctx.drawImage(img.obj, img.pos.x, img.pos.y, img.size.w, img.size.h);

		if (create) {
			this.images.push(img);
			this.elements.push(img);
		}
	}

	useImg(src, w, h) {
		this.imgToPlace.src = src;
		this.imgToPlace.aspectRatio = w/h;
		this.setState({
			showImageSelect: false
		});
	}

	renderCanvas() {
		this.ctx.fillStyle = this.backgroundColor;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		for (var i = 0; i < this.elements.length; i++) {
			var element = this.elements[i];
			if (element != undefined && element != null) {
				if (element.type == 'stroke') {
					this.showStroke(element.pos, element.nextPos, element.strokeColor, element.strokeWeight, false);
				} else if (element.type == 'eraser') {
					this.showErase(element.pos, element.nextPos, element.strokeWeight, false);
				} else if (element.type == 'line') {
					this.showLine(element.pos, element.nextPos, element.strokeColor, element.strokeWeight, false);
				} else if (element.type == 'rect') {
					this.showRect(element.pos, element.nextPos, element.strokeColor, element.strokeWeight, element.fillColor, false);
				} else if (element.type == 'ellipse') {
					this.showEllipse(element.pos, element.nextPos, element.strokeColor, element.strokeWeight, element.fillColor, false);
				}  else if (element.type == 'img') {
					this.showImg(element.obj, element.pos, element.nextPos, false);
				} 
			}
		}
	}

	changeColor(color, colorType) {
		if (colorType == 'backgroundColor') {
			this.backgroundColor = color;
			this.setState({
				backgroundColor: color
			});
		} else if (colorType == 'strokeColor') {
			this.strokeColor = color;
		} else if (colorType == 'fillColor') {
			this.fillColor = color;
		}
		this.renderCanvas();
	}

	changeStrokeWeight(weight) {
		this.strokeWeight = weight;
	}

	undo() {
		const element = this.elements.pop();
		this.undos.push(element);
		this.renderCanvas();

		if (element != undefined && element != null && element.type == 'stroke') {
			var i = 0;
			while (element != undefined && element != null && element.type == 'stroke' && i < 5) {
				const element = this.elements.pop();
				this.undos.push(element);
				this.renderCanvas();
				i += 1;
			}
		}
	}

	redo() {
		if (this.undos.length > 0) {
			const element = this.undos.pop();
			this.elements.push(element);
			this.renderCanvas();

			if (element != undefined && element != null && element.type == 'stroke') {
				var i = 0;
				while (element != undefined && element != null && element.type == 'stroke' && i < 5) {
					const element = this.undos.pop();
					this.elements.push(element);
					this.renderCanvas();
					i += 1;
				}
			}
		}
	}

	clearCanvas() {
		this.strokes = [];
		this.lines = [];
		this.rects = [];
		this.ellipses = [];
		this.elements = [];
		this.renderCanvas();
	}

	save() {
		const data = this.canvas.toDataURL();
		this.props.addImgToWall(data);
	}

	render() {
		return (
			<div ref = {(ref) => {this.doodleCanvasContainer = ref}} style = {{backgroundColor: this.state.backgroundColor}} className = "doodle-canvas-container">
				<span className = "subheading">Create a Doodle</span><span className = "close-window-button" onClick = {() => this.props.toggleMode('view')}>+</span> 
				<nav className = "tool-panel">
					<div className = "tool-panel-button" style = {{marginRight: "1em"}} title = "Clear All" onClick = {this.clearCanvas}>Clear</div>
					<div className = {this.state.mode == "stroke" ? "tool-panel-button active" : "tool-panel-button"} title = "Draw" onClick = {() => this.toggleMode('stroke')}>
						<svg className = "icon" width = "1.5em" height = "1.5em"><path d = "m8.602 21.351-5.535-5.535 13.388-13.387 5.535 5.535zm-6.052-4.56 5.077 5.077-7.612 2.535zm21.142-10.523-.96.96-5.542-5.542.96-.96c.967-.968 2.535-.968 3.502 0l2.04 2.04c.96.97 .96 2.532 0 3.502zm0 0"/></svg>
					</div>
					<div className = {this.state.mode == "eraser" ? "tool-panel-button active" : "tool-panel-button"} title = "Erase" onClick = {() => this.toggleMode('eraser')}>
						<svg className = "icon" width = "1.5em" height = "1.5em"><path d = "M24.911 8.07 17.517.675c-.23-.23-.604-.23-.834 0L4.167 13.191c-.111.111-.173.261-.173.417 0 .127.042 .248.117 .349l-3.808 3.808C.108 17.96 0 18.22 0 18.496c0 .276.108 .536.303 .732l4.34 4.34c.654.654 1.523 1.014 2.448 1.014.925 0 1.794-.36 2.448-1.014l2.092-2.092c.101.074 .222.117 .349.117 .156 0 .307-.062.417-.173L24.911 8.904c.111-.111.173-.261.173-.417S25.022 8.18 24.911 8.07zM8.703 22.734c-.431.431-1.004.668-1.613.668-.609 0-1.182-.237-1.613-.668L1.24 18.496l3.698-3.698 5.85 5.85L8.703 22.734z"/></svg>
					</div>
					<div className = {this.state.mode == "line" ? "tool-panel-button active" : "tool-panel-button"} title = "Line" onClick = {() => this.toggleMode('line')}>
						<svg className = "shape" width = "1.5em" height = "1.5em"><line x1 = "0" y1 = "0" x2 = "100" y2 = "100" /></svg>
					</div>
					<div className = {this.state.mode == "rect" ? "tool-panel-button active" : "tool-panel-button"} title = "Rectangle" onClick = {() => this.toggleMode('rect')}>
						<svg className = "shape" width = "1.5em" height = "1.5em"><rect width = "1.5em" height = "1.5em" style = {{strokeWidth: 6}} /></svg>
					</div>
					<div className = {this.state.mode == "ellipse" ? "tool-panel-button active" : "tool-panel-button"} title = "Ellipse" onClick = {() => this.toggleMode('ellipse')}>
						<svg className = "shape" width = "1.5em" height = "1.5em"><circle cx = "0.75em" cy = "0.75em" r = "0.6em" /></svg>
					</div>
					<div className = {this.state.mode == "img" ? "tool-panel-button active" : "tool-panel-button"} title = "Image" onClick = {() => this.toggleMode('img')}>
						<svg className = "icon" width = "1.5em" height = "1.5em"><path d = "M8.32 7.488q0 1.04-.728 1.768t-1.768.728-1.768-.728-.728-1.768.728-1.768 1.768-.728 1.768.728 .728 1.768zm13.312 4.992v5.824h-18.304v-2.496l4.16-4.16 2.08 2.08 6.656-6.656zm1.248-9.152h-20.8q-.169 0-.293.123t-.123.293v15.808q0 .169.123 .293t.293.123h20.8q.169 0 .293-.123t.123-.293v-15.808q0-.169-.123-.292t-.293-.123zm2.08.416v15.808q0 .858-.611 1.469t-1.469.611h-20.8q-.858 0-1.469-.611t-.611-1.469v-15.808q0-.858.611-1.469t1.469-.611h20.8q.858 0 1.469.611t.611 1.469z"/></svg>
					</div>
					<div className = "tool-panel-button" title = "Undo" onClick = {this.undo}>
						<svg className = "icon" width = "1.5em" height = "1.5em"><path d = "M22.395 18.41c0-.84.18-4.155-2.435-6.785-1.76-1.77-4.015-2.67-7.165-2.81V4.8L3.2 11.2l9.6 6.4v-3.99c2 .055 3.12.455 4.335 1 1.545.69 2.765 2.2 3.79 3.83l.96 1.56H22.4C22.4 19.495 22.395 18.855 22.395 18.41z"/></svg>
					</div>
					<div className = "tool-panel-button" title = "Redo" onClick = {this.redo}>
						<svg className = "icon" width = "1.5em" height = "1.5em" style = {{transform: "scale(-1, 1)"}}><path d = "M22.395 18.41c0-.84.18-4.155-2.435-6.785-1.76-1.77-4.015-2.67-7.165-2.81V4.8L3.2 11.2l9.6 6.4v-3.99c2 .055 3.12.455 4.335 1 1.545.69 2.765 2.2 3.79 3.83l.96 1.56H22.4C22.4 19.495 22.395 18.855 22.395 18.41z"/></svg>
					</div>
					<div className = "tool-panel-button" style = {{marginLeft: "1em"}} title = "Done" onClick = {this.save}>Done</div>
					<ImageSelector show = {this.state.showImageSelect} useImg = {this.useImg} />
				</nav>
				<div className = "settings-panel">
					Background:<ColorSelector changeColor = {this.changeColor} colorType = "backgroundColor"/>
					Stroke:<ColorSelector changeColor = {this.changeColor} colorType = "strokeColor"/>
					Fill:<ColorSelector changeColor = {this.changeColor} colorType = "fillColor"/>
					Stroke Size: <StrokeWeightSelector changeStrokeWeight = {this.changeStrokeWeight} />
				</div>
				<canvas className = "doodle-canvas" ref = {(ref) => {this.canvas = ref}} onMouseDown = {this.onMouseDown} onTouchStart = {this.onMouseDown} onMouseLeave = {this.endPaintEvent} onMouseUp = {this.endPaintEvent} onTouchEnd = {this.endPaintEvent} onTouchCancel = {this.endPaintEvent} onMouseMove = {this.onMouseMove} onTouchMove = {this.onMouseMove}>Your browser doesn't support canvas...</canvas>
			</div>
		);
	}
}

export default AddDoodle;