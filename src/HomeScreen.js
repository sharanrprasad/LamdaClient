// @flow
import React, { Component } from "react";
import {
  AppBar,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  TextField,
  Toolbar,
  Typography,
  withStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import type { RouterHistory, Match } from "react-router-dom";
import type { ServerResponse } from "./projectConstants";
import projectConstants from "./projectConstants";

type HomeScreenProps = {
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

type HomeScreenState = {
  isLoggedIn: boolean,
  numLoops: number,
  maxPrime: number,
  numExecutions: number,
  isFetching: boolean,
  token: string,
  fetchResult?: {
    dataSet: Array<dataResult>,
    err: number
  }
};

class HomeScreen extends Component<HomeScreenProps, HomeScreenState> {
  constructor(props: HomeScreenProps) {
    super(props);
    this.state = {
      isLoggedIn: localStorage.getItem("token") !== null,
      numLoops: 1,
      maxPrime: 2,
      numExecutions: 100,
      isFetching: false,
      token: localStorage.getItem("token") || ""
    };
    this.handleSiteDataChange = this.handleSiteDataChange.bind(this);
    this.fetchLamdaFunctions = this.fetchLamdaFunctions.bind(this);
  }

  componentDidMount() {
    if (!this.state.isLoggedIn) {
      this.props.history.push("/login");
    }
  }

  handleSiteDataChange = (name: string) => (event: Object) => {
    let eventValue = event.target.value; //cannot use event in a asynchronus way.
    this.setState({
      [name]: eventValue
    });
  };

  fetchLamdaFunctions = () => {
    this.setState({ isFetching: true });
    let lamdaData = {
      maxPrime: this.state.maxPrime,
      numLoops: this.state.numLoops > 0 ? this.state.numLoops : 1,
      numOfExecutions: this.state.numExecutions
    };

    fetch("http://localhost:4000/rest-api/getresults", {
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
            isFetching: false
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
            id="numExecutions"
            required
            label="Number of times lambda to be called"
            className={classes.textField}
            value={this.state.numExecutions}
            onChange={this.handleSiteDataChange("numExecutions")}
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
          this.state.fetchResult.dataSet && (
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell> Lamda Memory</TableCell>
                  <TableCell>
                    {" "}
                    Total time {`(${this.state.numLoops})`}{" "}
                  </TableCell>
                  <TableCell> Average time</TableCell>
                  <TableCell> Cost </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.fetchResult.dataSet.map((row: dataResult) => {
                  return (
                    <TableRow key={row.ram}>
                      <TableCell> {row.ram} </TableCell>
                      <TableCell> {row.totalTime} </TableCell>
                      <TableCell> {row.averageTime} </TableCell>
                      <TableCell> {row.cost}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
    display : "block"
  },
  textField: {
    marginLeft: theme.spacing.unit * 5,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit * 5,
    width: 400,
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

const homeScreenContainer = withStyles(styles)(withRouter(HomeScreen));

export default homeScreenContainer;
