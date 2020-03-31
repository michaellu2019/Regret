import React from 'react';

class WallPiece extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}

	render() {
		return (
			<div className = {this.props.wallId == this.props.currentWall ? "wall-piece" : "wall-piece hide"} style = {{left: this.props.x + "px", top: this.props.y + "px"}} onClick = {() => this.props.getPieceInfo(this.props.index)}>
				{this.props.imgSrc != 'clear' && this.props.artistPkId != 0 ? 
					<img id = {"wall-piece-img-" + this.props.index} className = "wall-piece-img" src = {this.props.imgSrc} width = {this.props.width} draggable = "false" />
				:
					<div id = {"wall-piece-clearzone-" + this.props.index} className = "wall-piece-clearzone" style = {{width: this.props.width, height: this.props.height}} draggable = "false"></div>
				}
			</div>
		);
	}
}

export default WallPiece;