// @flow
import React, { Component } from "react";
import {
  AppBar,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Toolbar,
  Typography,
  withStyles,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
    Input,
    FormHelperText
} from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import type { RouterHistory, Match } from "react-router-dom";
import type { ServerResponse } from "./projectConstants";
import projectConstants from "./projectConstants";
import {endPoint} from './helpers';

type LandScreenProps = {
  history: RouterHistory,
  match: Match,
  classes: *
};

type dataResult = {
  ram: number,
  totalTime: number,
  averageTime: number,
  cost: number
};

type LandScreenState = {
  isLoggedIn: boolean,
  numLoops: number,
  maxPrime: number,
  memory : number,
  isFetching: boolean,
  token: string,
  fetchResult?: {
    memory : string,
    durationSeconds : string
  },
  clientTime : number
};

class LandingScreen extends Component<LandScreenProps, LandScreenState> {
  constructor(props: LandScreenProps) {
    super(props);
    this.state = {
      isLoggedIn: localStorage.getItem("token") !== null,
      numLoops: 1,
      maxPrime: 100,
      isFetching: false,
      memory : 128,
      token: localStorage.getItem("token") || "",
      clientTime : 0
    };
    this.handleSiteDataChange = this.handleSiteDataChange.bind(this);
    this.fetchLamdaFunctions = this.fetchLamdaFunctions.bind(this);
    this.getTimeElasped = this.getTimeElasped.bind(this);
  }

  startTime : number

  componentDidMount() {
    if (!this.state.isLoggedIn) {
      this.props.history.push("/login");
    }
  }

  getTimeElasped = (startTime : number) => {
    let endTime : Date = new Date();
    let timeDiff = endTime - startTime; //in ms
    // strip the ms
    timeDiff /= 1000;
    return timeDiff;
  }

  handleSiteDataChange = (name: string) => (event: Object) => {
    let eventValue = event.target.value; //cannot use event in a asynchronus way.
    this.setState({
      [name]: eventValue
    });
  };

  fetchLamdaFunctions = () => {
    this.startTime = Date.now();
    this.setState({ isFetching: true });
    let lamdaData = {
      maxPrime: this.state.maxPrime,
      numLoops: this.state.numLoops > 0 ? this.state.numLoops : 1,
      memory: this.state.memory || "128"
    };

    fetch(`${endPoint}/rest-api/getsingleLambda`, {
      body: JSON.stringify(lamdaData),
      headers: {
        "x-access-token": this.state.token,
        "content-type": "application/json"
      },
      method: "POST"
    })
    .then(data => data.json())
    .then((jsonData: ServerResponse) => {
      if (jsonData.message === projectConstants.SESSION_EXPIRED) {
        this.props.history.push("/login");
      }else if( !jsonData.message === projectConstants.SUCCESS) {
        this.setState({
          isFetching: false
        });
      }
      else {
        this.setState({
          fetchResult: jsonData.data,
          isFetching: false,
          clientTime : this.getTimeElasped(this.startTime)
        });
      }
    })
    .catch(err => {
      this.setState({
        isFetching: false
      });
    });
  };

  render() {
    const { classes } = this.props;
    const displayElement = (
        <div>
          <AppBar position="static">
            <Toolbar>
              <Grid item sm={8}>
                <Typography variant="title" color="inherit">
                  Enter the parameters to access the lamda function
                </Typography>
              </Grid>
              <Grid item sm = {4}>
                <Button variant={'raised'} className={classes.button} onClick = {() => this.props.history.push("/getall")}>
                  Go to Execute All
                </Button>
              </Grid>
            </Toolbar>
          </AppBar>

          <form className={classes.container} onSubmit={this.fetchLamdaFunctions}>
            <TextField
                id="maxPrime"
                required
                label="Max Prime To be Calculated"
                className={classes.textField}
                value={this.state.maxPrime}
                onChange={this.handleSiteDataChange("maxPrime")}
                margin="normal"
            />

            <TextField
                id="numOfLoops"
                className={classes.container}
                required
                label="Number of Loops"
                className={classes.textField}
                value={this.state.numLoops}
                onChange={this.handleSiteDataChange("numLoops")}
                margin="normal"
            />

            <FormControl className={classes.textField}>
              <InputLabel htmlFor="age-helper">Memory</InputLabel>
              <Select
                  value={this.state.memory}
                  onChange={this.handleSiteDataChange("memory")}
                  input={<Input name="memory" id="memory-helper" />}
              >
                <MenuItem value={128}>
                  <em>128</em>
                </MenuItem>
                <MenuItem value={256}>256</MenuItem>
                <MenuItem value={512}>512</MenuItem>
                <MenuItem value={1024}>1024</MenuItem>
              </Select>
              <FormHelperText>Select the Lambda memory to be called</FormHelperText>
            </FormControl>

            <Button
                type="submit"
                value="Login"
                variant="raised"
                color="secondary"
                className={classes.addSiteButton}
            >
              Send{" "}
            </Button>
          </form>

          {this.state.fetchResult &&
          this.state.fetchResult.durationSeconds && (
              <div>
                <Typography variant="title" color="inherit" className={classes.addSiteButton}>
                  {`Client side Time taken - ${this.state.clientTime} S`}
                </Typography>

                <Typography variant="title" color="inherit" className={classes.addSiteButton}>
                  {`Lambda Time Taken - ${this.state.fetchResult.durationSeconds} S`}
                </Typography>

              </div>
          )}
        </div>
    );

    return (
        <div>
          {this.state.isFetching ? (
              <div>
                <CircularProgress size={50} />
              </div>
          ) : (
              <div>{displayElement} </div>
          )}
        </div>
    );
  }
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%"
  },
  flex: {
    flex: 1
  },
  addSiteButton: {
    marginLeft: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit * 5,
    marginBottom : theme.spacing.unit * 3,
    display : "block"
  },
  textField: {
    marginLeft: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit * 5,
    width: 400,
    minWidth: 200,
    display: "block",
    overFlowX: "auto"
  },
  container: {
    display: "block"
  },
  table: {
    minWidth: 700
  },

});

const homeScreenContainer = withStyles(styles)(withRouter(LandingScreen));

export default homeScreenContainer;
