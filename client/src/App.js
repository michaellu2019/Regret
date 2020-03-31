import React from 'react';
import Cookies from 'js-cookie';

import FacebookLoginButton from './components/FacebookLoginButton';
import AddDoodle from './components/AddDoodle';
import AddImage from './components/AddImage';
import Wall from './components/Wall';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            serverRoute: 'http://localhost:5000',
            showAddButtons: false,
            pieceAdded: true,
            mode: 'view',
            addingImg: false,
            imgToAddSrc: '',
            showForceLogin: true,
            errorWindowMsg: '',
            currentWall: 0,
            user: {
                username: '',
                fbId: '',
                pkId: -1,
                profilePicture: '',
                numPieces: 0,
                maxNumPieces: 1
            },
        };
        this.toggleMode = this.toggleMode.bind(this);
        this.login = this.login.bind(this);
        this.unAuthLogin = this.unAuthLogin.bind(this);
        this.addImgToWall = this.addImgToWall.bind(this);
        this.pieceAddedToWall = this.pieceAddedToWall.bind(this);
        this.toggleShowOptions = this.toggleShowOptions.bind(this);
        this.hidePopUpWindow = this.hidePopUpWindow.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.changeWall = this.changeWall.bind(this);
    }

    toggleMode(mode) {
        if ((mode == "doodle") && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.setState({
                errorWindowMsg: 'Sorry, you\'re going to have to use a computer to do this, because I can\'t program on Mobile Devices for shit!'
            });
            return;
        }

        if (this.state.user.numPieces < this.state.user.maxNumPieces) {
            this.setState({
                showAddButtons: !this.state.showAddButtons,
                mode: mode
            });
        } else if (mode != 'view' && this.state.user.numPieces >= this.state.user.maxNumPieces && this.state.user.fbId.includes('unauth_user')) {
            this.setState({
                showForceLogin: true
            });
        } else if (mode != 'view' && this.state.user.numPieces >= this.state.user.maxNumPieces && !this.state.user.fbId.includes('unauth_user')) {
            this.setState({
                errorWindowMsg: 'You\'ve reached the maximum number of pieces that you can add to the wall! Congratu-fucking-lations!'
            });
        }
    }

    login(user) {
        console.log('User logging in...', user);
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user: user})
        };
        fetch(/*this.state.serverRoute + */'/login', requestOptions).then(response => response.json()).then((responseData) => {
            if (responseData.status == 'success') {
                console.log('Login successful...', responseData);
                this.setState({
                    loggedIn: responseData.data.user.authenticated,
                    showForceLogin: false,
                    user: {
                        username: responseData.data.user.username,
                        fbId: responseData.data.user.fbId,
                        pkId: responseData.data.user.pkId, 
                        profilePicture: responseData.data.user.profilePicture, 
                        numPieces: responseData.data.user.numPieces,
                        maxNumPieces: responseData.data.user.maxNumPieces
                    }
                });
                this.hidePopUpWindow();
            } else {
                console.log('Login failed...', responseData);
            }
        }).catch((error) => {
            console.log('Login error...', error);
        });
    }

    unAuthLogin() {
        const userId = Cookies.get('userId');
        if (userId == undefined) {
            const unauthUserId = 'unauth_user_' + Date.now() + '_' + Math.random();
            Cookies.set('userId', unauthUserId);
            const user = {
                username: 'Unknown Artist ' + unauthUserId.split('_')[2],
                picture: '',
                userId: unauthUserId
            }
            this.login(user);
        } else {
            const user = {
                username: 'Unknown Artist ' + userId.split('_')[2],
                picture: '',
                userId: userId
            }
            this.login(user);
        }
    }

    addImgToWall(src) {
        this.setState({
            imgToAddSrc: src,
            imgToAddPlaced: false,
            addingImg: true,
            showAddButtons: false,
            pieceAdded: false
        });
    }

    pieceAddedToWall() {
        const userUpdated = this.state.user;
        userUpdated.numPieces += 1;

        this.setState({
            mode: 'view',
            user: userUpdated,
            pieceAdded: true,
            addingImg: false,
            imgToAddPlaced: true
        });
    }

    toggleShowOptions() {
        this.setState({
            showAddButtons: !this.state.showAddButtons
        });
    }

    hidePopUpWindow() {
        this.setState({
            showForceLogin: false,
            errorWindowMsg: ''
        });
    }

    updateUser(user) {
        console.log('Updated User: ', user);
        this.setState({
            user: user
        });
    }

    changeWall() {
        if (this.state.currentWall == 3) {
            this.setState({
                currentWall: 0
            });
        } else {
            this.setState({
                currentWall: this.state.currentWall + 1
            });
        }
        this.toggleMode('view');
    }

    render() {
        return (
            <div className = "wrapper">
                <header className = "primary">
                    <nav>
                        <span className = "heading">Regret</span>

                        <ul className = "nav-buttons links">
                            <li><FacebookLoginButton login = {this.login}/></li>
                            <li>{this.state.user.username.length > 0 ? 'Welcome ' + this.state.user.username.split(' ')[0] : ''}</li>
                            <li>{this.state.user.numPieces > -1 ? 'Contributions Left: ' + (this.state.user.maxNumPieces - this.state.user.numPieces) : ''}</li>
                        </ul>
                    </nav>
                </header>

                <main className = "primary">
                    <article>
                        <Wall id = {0} currentWall = {this.state.currentWall} user = {this.state.user} updateUser = {this.updateUser} imgToAddSrc = {this.state.imgToAddSrc} imgToAddPlaced = {this.state.imgToAddPlaced} pieceAddedToWall = {this.pieceAddedToWall} />
                        {this.state.pieceAdded ?
                            <div>
                                <div className = {this.state.showAddButtons ? "art-options" : "art-options hide"}>
                                    <span>Logged in as {this.state.user.username}</span> <br />
                                    <span>Additions Remaining: {this.state.user.maxNumPieces - this.state.user.numPieces}</span>
                                    <a className = "art-option-button" href = "#" onClick = {() => this.toggleMode('doodle')}>Add Doodle</a>
                                    <a className = "art-option-button" href = "#" onClick = {() => this.toggleMode('img')}>Add Image</a>
                                    <a className = "art-option-button" href = "#" onClick = {this.changeWall}>Next Wall</a>
                                </div>
                                <a className = {this.state.showAddButtons ? "round-button active" : "round-button"} href = "#" onClick = {() => this.toggleShowOptions()}>+</a>
                            </div>
                        : ""}
                    </article>

                    <article>
                        <div className = {this.state.mode == "doodle" && !this.state.addingImg ? "editing-container" : "editing-container hide"}>{this.state.mode == "doodle" && !this.state.addingImg ? <AddDoodle toggleMode = {this.toggleMode} addImgToWall = {this.addImgToWall} /> : ""}</div>
                        <div className = {this.state.mode == "img" && !this.state.addingImg ? "editing-container" : "editing-container hide"}>{this.state.mode == "img" && !this.state.addingImg ?<AddImage toggleMode = {this.toggleMode} addImgToWall = {this.addImgToWall} /> : ""}</div>
                    </article>

                    <article>
                        <div className = {this.state.showForceLogin && !this.state.loggedIn ? "force-login-container" : "force-login-container hide"}>
                            {this.state.user.numPieces >= this.state.user.maxNumPieces ? <span className = "close-window-button" onClick = {this.hidePopUpWindow}>+</span> : ""}
                            <span className = "heading">{this.state.user.numPieces < this.state.user.maxNumPieces ? "Would You Like to Login with Facebook?" : "Login to Contribute More to the Wall!" }</span>
                            <div className = "force-login-button-container">
                                <FacebookLoginButton login = {this.login}/>
                                {this.state.user.numPieces < this.state.user.maxNumPieces ? <a className = "button" href = "#" onClick = {this.unAuthLogin}>Hahaha... No.</a> : ""}
                            </div>
                        </div>
                    </article>

                    <article>
                        <div className = {this.state.errorWindowMsg != '' ? "error-window-container" : "error-window-container hide"}>
                            <span className = "close-window-button" onClick = {this.hidePopUpWindow}>+</span>
                            <span className = "heading">{this.state.errorWindowMsg}</span>
                        </div>
                    </article>
                </main>
            </div>
        );
    }
}

export default App;
