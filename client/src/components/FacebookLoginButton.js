import React from 'react';
import FacebookLoginBtn from 'react-facebook-login';

class FacebookLoginButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			auth: false,
			user: {
				username: '',
				picture: '',
				userId: ''
			}
		};
		this.componentClicked = this.componentClicked.bind(this);
		this.responseFacebook = this.responseFacebook.bind(this);
	}

	componentClicked() {
		console.log('Button clicked...');
	}

	responseFacebook(response) {
		if (response.status != 'unknown') {
			this.setState({
				auth: true,
				user: {
					username: response.name,
					picture: response.picture.data.url,
					userId: response.userID
				}
			}, () => {
				this.props.login(this.state.user);
			});
		}
	}

	render() {
		let facebookData;

		if (this.state.auth) {
			//facebookData = (<div>Welcome {this.state.user.username.split(' ')[0]}</div>);
		} else {
			facebookData = (<FacebookLoginBtn appId = "245982219776305" autoLoad = {false} fields = "name,picture" onClick = {this.componentClicked} callback = {this.responseFacebook} />);
		}

		return (
			<div>{facebookData}</div>
		);
	}
}

export default FacebookLoginButton;