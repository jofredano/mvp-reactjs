import React from 'react'
import axios from 'axios'

class LoginFormComponent extends React.Component{
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind( this );
        this.state = {
            form: {
                email: '',
                password: ''
            }
        }
    }
    
    handleChange = async e => {
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }

    async handleSubmit( event ) {
        event.preventDefault();
        const baseUrl = 'http://localhost:8081/auth/sign-in';
        const data = { email: this.state.form.email , password: this.state.form.password };
        await axios.post( baseUrl, data ).then( response => {
            return response.data;
        } )
        .then( response => {
            const accessToken = response.access_token;
            localStorage.setItem( 'token', accessToken );
            window.location.href = './socket';
        } )
        .catch( error => {
            console.log( error );
        } )
    }

    render() {
        return (<div className="container">
                <div className="d-flex justify-content-center h-100">
                    <div className="card">
                        <div className="card-header">
                            <h3>Sign In</h3>
                            <div className="d-flex justify-content-end social_icon">
                                <span><i className="fab fa-facebook-square"></i></span>
                                <span><i className="fab fa-google-plus-square"></i></span>
                                <span><i className="fab fa-twitter-square"></i></span>
                            </div>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="input-group form-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fas fa-user"></i></span>
                                    </div>
                                    <input type="text" className="form-control" name="email" id="email" onChange={this.handleChange} placeholder="username" />
                                </div>
                                <div className="input-group form-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fas fa-key"></i></span>
                                    </div>
                                    <input type="password" className="form-control" name="password" id="password" onChange={this.handleChange} placeholder="password" />
                                </div>
                                <div className="row align-items-center remember">
                                    <input type="checkbox" />Remember Me
                                </div>
                                <div className="form-group">
                                    <input type="submit" value="Login" className="btn float-right login_btn" onClick={this.handleSubmit} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>);
    }
}

export default LoginFormComponent;