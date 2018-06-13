//@flow

import React, {Component} from 'react';
import {
  AppBar,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  TextField,
  Toolbar,
  Typography,
    withStyles
} from '@material-ui/core';
import type {Match, RouterHistory} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import projectConstants from './projectConstants';
import type {ServerResponse} from './projectConstants';
import {endPoint} from './helpers';

type LoginProps = {
  classes: typeof styles,
  match: Match,
  history: RouterHistory
}

type LoginState = {
  email: string,
  password: string,
  emailError: string,
  passwordError: string
}

class LoginScreen extends Component<LoginProps,LoginState> {

  constructor(props: LoginProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
    };
    this.loginUser = this.loginUser.bind(this);
    this.handleSiteDataChange = this.handleSiteDataChange.bind(this);
    this.handleLoginError = this.handleLoginError.bind(this);
    console.log("constructor");

  }

  loginUser= (event:Object) => {
    console.log("Inside loginUser");
    event.preventDefault();
    let loginData = {
        username: this.state.email,
        password:this.state.password
    }

    fetch(`${endPoint}/api/sign-in`,{
      body : JSON.stringify(loginData),
      headers : {
        'content-type': 'application/json'
      },
      method : 'POST'
    })
    .then(response => response.json())
    .then( (data:ServerResponse) => {
      console.log(data);
      if(data.message !== projectConstants.SUCCESS){
            this.handleLoginError(data);
      }else{
            this.handleLoginSuccess(data);
      }
    }).catch(err => {
      console.log("Errorin fetch");
      this.handleLoginError({message:projectConstants.GENERIC_ERROR});
    })

  }

  handleLoginError= (data: ServerResponse) => {
    switch (data.message){
      case projectConstants.USER_NOT_PRESENT:
        this.setState({
          emailError: "Not Correct Email ",
          passwordError : ""
        });
        break;
      case projectConstants.INCORRECT_PASSWORD:
        this.setState({
          emailError: "",
          passwordError : "Wrong password"
        });
        break;
      default :
        this.setState({
          emailError: "SomeThing went wrong",
          passwordError : ""
        });
    }

  }

  handleLoginSuccess(data: ServerResponse){
        localStorage.setItem('token', data.data.token);
        this.props.history.push("/");
  }

  handleSiteDataChange = name => (event: Object) => {
    let eventValue = event.target.value; //cannot use event in a asynchronus way.
    this.setState({
       [name]: eventValue
    });
  };

  render() {
    console.log("inside render ");
    const {classes} = this.props;
    return (
        <div>
          <AppBar position="static">
            <Toolbar>
              <Grid item sm={4}>
                <Typography variant="title" color="inherit">
                  Login
                </Typography>
              </Grid>
            </Toolbar>
          </AppBar>

          <form className={classes.container} onSubmit={this.loginUser}>

            <TextField id="email" className = {classes.container} required label="Email"
                       className={classes.textField}
                       value={this.state.email}
                       onChange={this.handleSiteDataChange('email')}
                       margin="normal"
                       />

            <TextField id="password" required label="Password"
                       className={classes.textField}
                       value={this.state.password}
                       type="password"
                       onChange={this.handleSiteDataChange('password')}
                       margin="normal"
                       />

            <Button type="submit" value="Save" className={classes.textField}
                    variant='raised' color="secondary">Login </Button>

          </form>
        </div>


          )
  }

}

const styles = theme => ({
  root: {
    flexGrow: 1,
    width : "100%"
  },
  flex: {
    flex: 1,
  },
  addSiteButton: {
    float : "right",
  },
  textField: {
    marginLeft: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit * 5,
    width: 200,
    display: 'block',
    overFlowX: 'auto',
  },
  container: {
    display: 'block',
  },
});


const loginScreenContainer = withStyles(styles)(withRouter(LoginScreen));

export default loginScreenContainer;

