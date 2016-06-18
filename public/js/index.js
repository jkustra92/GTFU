// ========================
// the entire application
// ========================

var App = React.createClass({ 
	//checking for cookie
	//true otherwise cookie is an empty string
	getInitialState: function() {
		var cookieCheck;
		if(document.cookie) {
			cookieCheck = true;
		} else {
			cookieCheck = '';
		}
		return {
			authenticatedUser: cookieCheck
		};
	},
	//removing cookie and tempory cookies
	//and returning auth user 
	eatTheCookie: function() { 												// thanks Joe
		Cookies.remove('jwt_token');
		Cookies.remove('temp');  
		console.log(this.state)
		this.setState({
			authenticatedUser: '',
		});
	},
	//setting auth user to true to 
	//keep them logged in
	changeLogin: function() {
		this.setState({
			authenticatedUser: true
		});
	},
	//renders the login form and the signup button
	render: function() {
		console.log('authenticatedUser: ', this.state.authenticatedUser);
		// console.log('cookie:', document.cookie);
		if(this.state.authenticatedUser === true) {
			return (
				<Page onChange={this.eatTheCookie} />									
			)																																			
		}else{
			return (
				<div id = 'homepage'>
					<LoginForm
						initialLoginCheck={this.state.authenticatedUser}
						onChange={this.changeLogin}
					/>
					<SignUpButton onChange={this.changeLogin}/>
				</div>
			);
		}
	}
});

// ======================
// login form component
// ======================

var LoginForm = React.createClass({
	//username to be filled
	getInitialState: function() {
		return {
			username: this.props.initialLoginCheck,
			password: this.props.initialLoginCheck,
			loginStatus: this.props.initialLoginCheck
		};
	},
	//whatever changes happen are applied
	handleLoginFormChange: function(stateName, e) {
		var change = {};
		change[stateName] = e.target.value;
		this.setState(change);
	},
	handleSubmit: function(e) {
		//the user credentials are then saved 
		e.preventDefault();
		var username = this.state.username.trim();
		var password = this.state.password.trim();
		this.loginAJAX(username, password);
	},
	loginAJAX: function(username, password) {
		//ajax request to save the user creds 
		$.ajax({
			url: '/auth',
			method: 'POST',
			data: {
				username: username,
				password: password
			},
			//if saved it console logs
			success: function(data) {
				console.log('Token acquired.');
				console.log(data);
				Cookies.set('jwt_token', data.token);
				this.props.onChange(data.token)
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(status, err.toString());
			}.bind(this)
		});
	},
	//rendering the login form
	render: function() {
		return (
			<div className='login-form'>
				<h3>Please Login</h3>
				<form onSubmit={this.handleSubmit}>
					<label htmlFor='username'>Username</label>
					<input
						className='username-login-form'
						type='text' 
						value={this.state.username}
						onChange={this.handleLoginFormChange.bind(this, 'username')}
					/>
					<br/>
					<label htmlFor='password'>Password</label>
					<input
						className='password-login-form'
						type='text'
						value={this.state.password}
						onChange={this.handleLoginFormChange.bind(this, 'password')}
					/>
					<br/>
					<input type='submit' />
				</form>
			</div>
		)
	}
})

//=========================																	
// signup button component
//=========================

//sign up form, sets user to false
//when clicked it turns it to true,
//if false the sign up is rendered
var SignUpButton = React.createClass({
	getInitialState: function(){
	return ({clicked: false})
	},
	handleClick: function(){
		this.setState({clicked: true})
	},
	render: function() {
		if (this.state.clicked == false){
			return(<button onClick = {this.handleClick}>sign up!</button>)
		}else{
			return(
				<SignUpForm onChange={this.changeLogin}/>)
		}
	}
});

//========================
// sign up form component
//========================

//sign up form; empty strings to be filled
var SignUpForm = React.createClass({
	getInitialState: function() {
		return {
			username: '',
			email: '',
			password: ''
		}
	},
	handleSignupFormChange: function(stateName, e) {
		var change = {};
		change[stateName] = e.target.value;
		console.log(change)
		this.setState(change);
	},
	//submits the user input
	//and saves it 
	handleSubmit: function(e) {
		e.preventDefault();
		console.log('WAT THE HELL');
		var username = this.state.username.trim();
		var email = this.state.email.trim();
		var password = this.state.password.trim();
		this.signupAJAX(username, email, password);
	},
	signupAJAX: function(username, email, password) {
		var self = this;
		var callback = function() {
			self.props.onChange();
		}

		$.ajax({
			url: '/users',
			method: 'POST',
			data: {
				username: username,
				email: email,
				password: password
			}
		}).done(function(data) {
			console.log(data);
			Cookies.set('temp', 'asdfghjkl;');
			callback();
		});
	},
	//rendering sign up form
	render: function() {
		return(
			<div className='signup-form'>
				<h3>Sign Up</h3>
				<form onSubmit={this.handleSubmit}>
					<label htmlFor='username'>Username</label>
					<input
						className='username-signup-form'
						type='text'
						value={this.state.username}
						onChange={this.handleSignupFormChange.bind(this, 'username')}
					/>
					<label htmlFor='email'>E-Mail</label>
					<input
						className='email-signup-form'
						type='text'
						value={this.state.email}
						onChange={this.handleSignupFormChange.bind(this, 'email')}
					/>
					<label htmlFor='password'>Password</label>
					<input
						className='password-signup-form'
						type='text'
						value={this.state.password}
						onChange={this.handleSignupFormChange.bind(this, 'password')}
					/>
					<input type='submit'/>
				</form>
			</div>
		);
	}
});


//=================
// WITH AUTH
//=================

//logging out 
var Page = React.createClass({
	render: function() {
		return (
			<div>
				<LogOut onChange = {this.props.onChange} />
				<Weather />
			</div>
		);
	}
});

var LogOut = React.createClass({
	handleClick: function() {
		console.log('WAT')
		console.log(this.props.onChange);
		this.props.onChange();
	},
	render: function() {
		console.log(this.props.onChange);
		return (
			<div>
				<button
					onClick={this.handleClick}
					id='logout-button'
					>
					Log Out
				</button>
			</div>
		);
	}	
});

//=================
// WEATHER
//=================

//Using ajax, requests the api w/ 
//entered zipcode
var Weather = React.createClass({
	weatherAJAX: function(zipcode) {
		$.ajax({
			url: "/users/weather/" + zipcode,
			method: "GET"
		}).done(function(data){
			console.log(data)
		})
	},
	//the zipsearch takes that data from
	//weather ajax and renders it
	render: function() {
		return (
			<div>
				<ZipSearch weatherData={this.weatherAJAX} />

			</div>
		);
	}
});
//searching zipcode
var ZipSearch = React.createClass({
	getInitialState: function() {
		return {
			searchText: ''
		}
	},
	//that search text is given a target value
	//to call upon 
	handleLocationChange: function(e) {
		console.log(e.target.value);
		this.setState({
			searchText: e.target.value
		});
	},
	//the search text becomes zip
	handleSearch: function(e) {
		e.preventDefault();
		var zip = this.state.searchText.trim();
		console.log(zip);
		// this.props.weatherData(zip);
		console.log('Hi.');
	},
	//rendering the zip 
	render: function() {
		return (
			<form onSubmit={this.handleSearch}>
				<input
					type='text'
					placeholder='Zip Code'
					value={this.state.searchText}
					onChange={this.handleLocationChange}
				/>
				<button type='submit'>Submit</button>
			</form>		
		);
	}
});

// var WeatherSidebar = React.createClass({

// });

// var WeatherDisplay = React.createClass({

// });


//=================
// test ajax calls
//=================

//----------
// ny times
//----------

// $.ajax({																	
// 	url: "/users/news/" + topic,		
// 	method: "GET"
// }).done(function(data){
// 	console.log(data)
// })

//--------------
// open weather
//--------------

// $.ajax({
// 	url: "/users/weather/" + zipcode,
// 	method: "GET"
// }).done(function(data){
// 	console.log(data)
// })

ReactDOM.render(<App />, document.getElementById('main-container'));