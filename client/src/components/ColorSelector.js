import React from 'react';

class ColorSelector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hide: true,
			currentColor: 'white'
		};
		this.toggleShowSelector = this.toggleShowSelector.bind(this);
	}

	componentDidMount() {
		if (this.props.colorType == 'strokeColor') {
			this.setState({
				currentColor: 'black'
			});
		} else if (this.props.colorType == 'fillColor') {
			this.setState({
				currentColor: 'none'
			});
		}
	}

	toggleShowSelector(hide) {
		this.setState({
			hide: hide
		});
	}

	changeColor(color) {
		this.toggleShowSelector(true);
		this.setState({
			currentColor: color
		});
		this.props.changeColor(color, this.props.colorType);
	}

	render() {
		return (
			<div className = "color-select-container">
				<div style = {this.state.currentColor == "none" ? {background: "linear-gradient(white, black)"} : {backgroundColor: this.state.currentColor}} className = "color-select-head" onClick = {() => this.toggleShowSelector(!this.state.hide)}></div>
				<div className = {this.state.hide ? "color-select-options hide" : "color-select-options"}>
					{this.props.colorType != 'backgroundColor' ? <div style = {{background: "linear-gradient(white, black)"}} className = "color-select-box" onClick = {() => this.changeColor('none')}></div> : ''}
					<div style = {{backgroundColor: 'red'}} className = "color-select-box" onClick = {() => this.changeColor('red')}></div>
					<div style = {{backgroundColor: 'orange'}} className = "color-select-box" onClick = {() => this.changeColor('orange')}></div>
					<div style = {{backgroundColor: 'gold'}} className = "color-select-box" onClick = {() => this.changeColor('gold')}></div>
					<div style = {{backgroundColor: 'yellow'}} className = "color-select-box" onClick = {() => this.changeColor('yellow')}></div>
					<div style = {{backgroundColor: 'lime'}} className = "color-select-box" onClick = {() => this.changeColor('lime')}></div>
					<div style = {{backgroundColor: 'green'}} className = "color-select-box" onClick = {() => this.changeColor('green')}></div>
					<div style = {{backgroundColor: 'cyan'}} className = "color-select-box" onClick = {() => this.changeColor('cyan')}></div>
					<div style = {{backgroundColor: 'blue'}} className = "color-select-box" onClick = {() => this.changeColor('blue')}></div>
					<div style = {{backgroundColor: 'indigo'}} className = "color-select-box" onClick = {() => this.changeColor('indigo')}></div>
					<div style = {{backgroundColor: 'purple'}} className = "color-select-box" onClick = {() => this.changeColor('purple')}></div>
					<div style = {{backgroundColor: 'violet'}} className = "color-select-box" onClick = {() => this.changeColor('violet')}></div>
					<div style = {{backgroundColor: 'pink'}} className = "color-select-box" onClick = {() => this.changeColor('pink')}></div>
					<div style = {{backgroundColor: 'black'}} className = "color-select-box" onClick = {() => this.changeColor('black')}></div>
					<div style = {{backgroundColor: 'gray'}} className = "color-select-box" onClick = {() => this.changeColor('gray')}></div>
					<div style = {{backgroundColor: 'white'}} className = "color-select-box" onClick = {() => this.changeColor('white')}></div>
					<div style = {{backgroundColor: 'chocolate'}} className = "color-select-box" onClick = {() => this.changeColor('chocolate')}></div>
				</div>
			</div>
		);
	}
}

export default ColorSelector;