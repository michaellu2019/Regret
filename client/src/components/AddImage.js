import React from 'react';

import ImageSelector from './ImageSelector';

class AddImage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		};
        this.useImg = this.useImg.bind(this);
	}

	useImg(src, w, h) {
		this.props.addImgToWall(src);
	}

	render() {
		return (
			<div className = "editing-image-container">
				<span className = "subheading">Add an Image</span><span className = "close-window-button" onClick = {() => this.props.toggleMode('view')}>+</span><br />
				<ImageSelector show = {true} useImg = {this.useImg} />
			</div>
		);
	}
}

export default AddImage;