/**
 * 
 * Amazon Personalize Workshop Demo Application
 * sample data from movielens data
 * perima@ 
 * 01-June-2019
 * 
 * Docs
 * https://docs.aws.amazon.com/personalize/latest/dg/getting-recommendations.html
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/PersonalizeRuntime.html
 * 
 * 
 */ 
import React, { Component } from 'react';
import logo from './AWS_logo_RGB_REV.png';
import './personalize.css';

import { makeStyles } from '@material-ui/core/styles';
//import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Amplify, {API} from 'aws-amplify';
import aws_exports from './aws-exports';
import Papa from 'papaparse';
import ListMovies from './components/ListMovies';

Amplify.configure(aws_exports);



  
class App extends Component { 
  constructor() {
    super();
    this.state = {
      movies: [],
      recommendations: [],
      userId: 1
      };
      this.handleUserChange = this.handleUserChange.bind(this);
       this.handleFetch = this.handleFetch.bind(this);
    }
    
    
    async  getRecommendations() { 
        let apiName = 'personalize';
        let path = '/items/?userId=' + this.state.userId;
        let myInit = { // OPTIONAL
            headers: {} // OPTIONAL
        }
        return  API.get(apiName, path, myInit);
    }

    
  /**
   * 
   * Load the  local movies  file  into state
   * so that we can convert movie id to title
   * 
   */ 
  getMovies(){
     Papa.parse('./movies.csv', {
        header: true,
        delimiter: ',',
        download: true,
      //  preview: 10, //use 0 for all rows
	      complete: (results) =>  {
		     // console.log(results);
		      this.setState({
		        movies: results.data
		      });
		      //  console.log('file', this.state);
		      //   this.getMovie(1);
		      this.getRecommendations().then(response => {
            console.log('recommendations response', response);
            const recommendations = []; 
            response.data.itemList.forEach(
               (item) => { 
                const movie = this.getMovie(item.itemId);
                console.log(movie);
                recommendations.push(
                    {
                      ITEM_ID: item.itemId,
                      title: movie.title
                    }
                  ); 
              }
              );
              //console.log(recommendations);
              this.setState({
                recommendations: recommendations
              })
          });
  	    }
      });
  }
  
  /**
   * 
   * Get a movie title from movieId
   * 
   */ 
  getMovie(movieId){
    if(this.state.movies.length > 0){
     // console.log('movies 2', this.state.movies);
      var movie = this.state.movies.filter(function(value){
      return value.ITEM_ID === '' + movieId;
      });
     // console.log('movie', movie); 
      return movie[0];
    }
  }
    
    componentDidMount(){
     
     
    
    }
    
    handleFetch(){
      console.log('fetching recommendations');
       this.getMovies();
    }
    
    handleUserChange = event => {
     // console.log(event.target.value);
        this.setState({
          userId: event.target.value
        })
    }
    
    getButtonWithUserId(){
      return(' Get user ' + this.state.userId + ' recommendations');
    }
  
    render() { 
      const classes = makeStyles(theme => ({
        container: {
          display: 'flex',
          flexWrap: 'wrap',
        },
        textField: {
          marginLeft: theme.spacing(1),
          marginRight: theme.spacing(1),
          
        },
        dense: {
          marginTop: theme.spacing(2),
        },
        menu: {
          width: 200,
        },
      }));
      
        return (
            <div className="App">
        <img src={logo} alt="logo" />
        <p>
          <code> Amazon Personalize Workshop</code>
        </p>
     <TextField
              id="outlined-name"
              label="User-id"
              className={classes.textField}
              defaultValue={this.state.userId}
              onChange={this.handleUserChange}
              margin="normal"
              variant="outlined"
            />
             <Button variant="contained" className={classes.button} onClick={this.handleFetch}>
              Fetch
      </Button>
       {this.getButtonWithUserId()}
            <ListMovies movies={this.state.recommendations}  />
           
    </div>
        );
    }
}

//export default withAuthenticator(App, {includeGreetings: true});

export default App;
