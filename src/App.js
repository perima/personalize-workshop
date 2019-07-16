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
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';

Amplify.configure(aws_exports);



  
class App extends Component { 
  constructor() {
    super();
    this.state = {
      movies: [],
      moviesWatched: [],
      recommendations: [],
      recommendationsArr: [],
      recommendationsRanked: [],
      userId: 1,
      };
      this.handleUserChange = this.handleUserChange.bind(this);
      this.handleFetch = this.handleFetch.bind(this);
      this.handleMovieSelected = this.handleMovieSelected.bind(this);
      this.getMoviesPreDeployedEndPoint = this.getMoviesPreDeployedEndPoint.bind(this);
    }
    
    async  getRecommendations() { 
        let apiName = 'personalize';
        let path = '/items/?userId=' + this.state.userId;
        let myInit = { // OPTIONAL
            headers: {} // OPTIONAL
        }
        return  API.get(apiName, path, myInit);
    }

    async getRecommendartionsRanked(){
        console.log('recommendations arr call','/items/?userId=' + this.state.userId + '&inputList=' + this.state.recommendationsArr.join(",")   );
      let apiName = 'personalize';
        let path = '/items/?userId=' + this.state.userId + '&inputList=' +  this.state.recommendationsArr.join ;
        let myInit = { // OPTIONAL
            headers: {} // OPTIONAL
        }
        return  API.get(apiName, path, myInit);
    }

  /**
   * 
   * Rank the recommendations 
   * not working yet this is a @todo item
   * 
   */ 
  getMoviesRanked(){
     this.getRecommendartionsRanked().then(response => {
            console.log('recommendations ranked response', response);
              const recommendationsRanked = [];
              response.data.itemList.forEach(
               (item) => { 
                  const movie = this.getMovie(item.itemId);
                  console.log(movie);
                  recommendationsRanked.push(
                    {
                      ITEM_ID: item.itemId,
                      title: movie.title
                    }
                  ); 
                }
              );
              //console.log(recommendations);
              this.setState({
                recommendationsRanked: recommendationsRanked
              });
              
          });
  }  
    
  /**
   * 
   * Fetch recommendations from our deployed
   * campaign and replace ids with titles
   * 
   * This will not work unless you edit the 
   * lambda function as per workshop 
   * documentation
   * 
   */ 
  getMovies(){
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
              
              const recommendationsArr = [];
              response.data.itemList.forEach(
               (item) => { 
                  const movie = this.getMovie(item.itemId);
                  console.log(movie);
                  recommendationsArr.push(item.itemId); 
                }
              );
              
              //console.log(recommendations);
              this.setState({
                recommendations: recommendations,
                recommendationsArr: recommendationsArr
              });
              
              // get ranked
              this.getRecommendartionsRanked();
              console.log(this.state);
          }).then(() => {
           // this.getMoviesRanked(); //@todo add ranked results for a user
          });
  }
  
  /**
   * 
   * 
   * Fetch recommendations  from our pre-deployed 
   * campaign and replace ids with titles
   * 
   * This is using existing workshop demonstration
   * endpoint trained using same dataset.
   * 
   */
  getMoviesPreDeployedEndPoint(){
    const url = 'https://1347dfqxnc.execute-api.us-west-2.amazonaws.com/dev/items/?userId=' + this.state.userId;
    axios.get(url).then(response => response.data)
    .then((payload) => {
      
      console.log('pre-deployed endpoint response', JSON.stringify(payload, null, 2));
      
     //console.log('recommendations response', data, null, 2);
     
            const recommendations = []; 
            payload.data.itemList.forEach(
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
              
              const recommendationsArr = [];
             payload.data.itemList.forEach(
               (item) => { 
                  const movie = this.getMovie(item.itemId);
                  console.log(movie);
                  recommendationsArr.push(item.itemId); 
                }
              );
              
              //console.log(recommendations);
              this.setState({
                recommendations: recommendations,
                recommendationsArr: recommendationsArr
              });
              
              // get ranked
              this.getRecommendartionsRanked();
              console.log(this.state);
              
              
     })
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
    
  /*  
   * Load the  local movies  file  into state
   * so that we can convert movie id to title    
   *
   */
    componentDidMount(){
     Papa.parse('./movies.csv', {
        header: true,
        delimiter: ',',
        download: true,
	      complete: (results) =>  {
		      this.setState({
		        movies: results.data
		      });
  	    }
      });
    }
    
    
    /**
     * 
     * Fetch recommendations and rank them
     * 
     * 
     */ 
    handleFetch(){
      console.log('fetching recommendations');
      this.getMovies(); // get recommendations
      // this.getMoviesRanked(); // rank them to the user
    }
    
    /**
     * 
     * Update state with the user entered in the control
     * 
     */  
    handleUserChange = event => {
        this.setState({
          userId: event.target.value
        });
    }
    
    getButtonWithUserId(){
      return(' recommendations for user id ' + this.state.userId );
    }
    
    /**
     * 
     * Emit the event that indicates the user has watched the movie
     * @todo
     * 
     */ 
    handleMovieSelected = (movieId, title) => {
      const moviesWatched = this.state.moviesWatched;
      moviesWatched.push(movieId);
      console.log('movies watched ', this.state.moviesWatched);
    //  this.getMovies();
    }
  
    render() { 
      const classes = makeStyles(theme => ({
        input: {
          color: "white"
        },
        container: {
          display: 'flex',
          flexWrap: 'wrap',
        },
        textField: {
          marginLeft: theme.spacing(1),
          marginRight: theme.spacing(1),
          color: 'white'
          
        },
        dense: {
          marginTop: theme.spacing(2),
        },
        menu: {
          width: 200,
        },
      }));
      

        return (
          
      <Box component="span" m={1}>
           
      <Grid 
        container 
        spacing={4}
        style={{textAlign: "center", padding: 10}}
      >
        
         <Grid item xs={3}>
           
           
            <Grid item style={{textAlign: "center", padding: 25}}>
             
             <Box>
               <img src={logo} alt="logo" />
              </Box>    
            
            </Grid>
            
            <Grid item style={{textAlign: "center", color: "white"}}>
              <code>Amazon Personalize Workshop</code>
            </Grid>
            
            <Grid container 
                spacing={3} 
                justify="center"
                alignItems="center"
                 style={{ padding: 10}}
              >
              
              <Box width="25%">
                <Grid item xs >
                              <TextField
                                id="outlined-name"
                                label="User-id"
                                className={classes.textField}
                                defaultValue={this.state.userId}
                                onChange={this.handleUserChange}
                                margin="normal"
                                variant="outlined"
                              />
                </Grid>
              </Box>
              
              <Grid item  >
               <Button variant="contained" className={classes.button} onClick={this.handleFetch}>
                    Fetch
                  </Button>
                  
              </Grid>
              <Grid item  >
               <Button variant="contained" className={classes.button} onClick={this.getMoviesPreDeployedEndPoint}>
                    Fetch pretrained
                  </Button>
                  
              </Grid>
             
            </Grid>
            
         <Grid item xs>
          <Box style={{ padding: 10, color: "white"}}>
                         {this.getButtonWithUserId()}
                         </Box>
          </Grid>
        
              
        </Grid>
        
        <Grid item xs={8} style={{ padding: 10}}>
            <ListMovies movies={this.state.recommendations} action={this.handleMovieSelected} />
        </Grid>
        

        
      </Grid>
           
      </Box>


           
        );
    }
}

export default App;
