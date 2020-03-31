import React from 'react';

class CanvasImageSelector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imgSrc: ''
		};
		this.loadImgUrl = this.loadImgUrl.bind(this);
		this.loadImgFile = this.loadImgFile.bind(this);
		this.useImg = this.useImg.bind(this);
	}

	loadImgFile(e) {
		const img = new Image();
		img.src = URL.createObjectURL(e.target.files[0]);
		var that = this;
		img.onload = function() {
			that.setState({
				imgSrc: this.src,
				imgW: this.naturalWidth,
				imgH: this.naturalHeight
			});
		}
	}

	loadImgUrl() {
		const img = new Image();
		img.src = this.urlInput.value;
		var that = this;
		img.onload = function() {
			that.setState({
				imgSrc: this.src,
				imgW: this.naturalWidth,
				imgH: this.naturalHeight
			});
		}
	}

	useImg() {
		this.props.useImg(this.state.imgSrc, this.state.imgW, this.state.imgH);
	}

	render() {
		return (
			<div className = {this.props.show ? "image-selector" : "image-selector hide"}>
				<div className = "image-inputs">
					<input type = "file" accept = "image/*" id = "input-image-file" onChange = {this.loadImgFile} />
					<label id = "input-image-file-label" className = "ghost-button" for = "input-image-file">
						<svg width = "1.5em" height = "1.2em"><g><path class = "st0" d = "M9.825 15.275h4.375V10.9h2.925L12 5.8 6.9 10.9h2.925V15.275zM6.9 16.75h10.2v1.45H6.9V16.75z" /></g></svg>
						Upload Image
					</label>
					<input ref = {(ref) => {this.urlInput = ref}} type = "text" id = "input-image-url" placeholder = " Enter URL" onChange = {this.loadImgUrl} /> <br />
				</div>
				Image Preview: <br /> 
  				<div className = {this.state.imgSrc != '' ? "image-selector-preview" : "image-selector-preview hide"}>
	  				<div className = "ghost-button" id = "choose-image" onClick = {this.useImg}>Use Image</div> <br />
					<img ref = {(ref) => {this.img = ref}} src = {this.state.imgSrc} />
	  			</div>
			</div>
		);
	}
}

export default CanvasImageSelector;