import React from 'react';

class StrokeWeightSelector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hide: true,
			currentWeight: 1
		};
		this.toggleShowSelector = this.toggleShowSelector.bind(this);
	}

	toggleShowSelector(hide) {
		this.setState({
			hide: hide
		});
	}

	changeStrokeWeight(weight) {
		this.toggleShowSelector(true);
		this.setState({
			currentWeight: weight
		});
		this.props.changeStrokeWeight(weight);
	}

	render() {
		return (
			<div className = "size-select-container">
				<div className = "size-select-head" onClick = {() => this.toggleShowSelector(!this.state.hide)}>{this.state.currentWeight}</div>
				<div className = {this.state.hide ? "size-select-options hide" : "size-select-options"}>
					<div className = "size-select-box" onClick = {() => this.changeStrokeWeight(1)}>1</div>
					<div className = "size-select-box" onClick = {() => this.changeStrokeWeight(3)}>3</div>
					<div className = "size-select-box" onClick = {() => this.changeStrokeWeight(5)}>5</div>
					<div className = "size-select-box" onClick = {() => this.changeStrokeWeight(7)}>7</div>
					<div className = "size-select-box" onClick = {() => this.changeStrokeWeight(9)}>9</div>
					<div className = "size-select-box" onClick = {() => this.changeStrokeWeight(11)}>11</div>
					<div className = "size-select-box" onClick = {() => this.changeStrokeWeight(13)}>13</div>
					<div className = "size-select-box" onClick = {() => this.changeStrokeWeight(15)}>15</div>
				</div>
			</div>
		);
	}
}

export default StrokeWeightSelector;