import React from 'react';

class WallSpot extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}

	render() {
		return (
			<div className = "wall-spot" onClick = {() => this.props.placeImg(this.props.index)}>
				<img id = {"wall-img-" + this.props.index} className = "wall-spot-img" style = {this.props.spotStyle} src = {this.props.imgSrc} width = "95%" />
			</div>
		);
	}
}

export default WallSpot;