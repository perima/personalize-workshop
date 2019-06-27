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

import Amplify, {API} from 'aws-amplify';
import aws_exports from './aws-exports';
import Papa from 'papaparse';
//import fetch from 'isomorphic-fetch'
//import txt from './movies.csv';
//import moviescsv from './movies.csv';

Amplify.configure(aws_exports);


const useStyles = makeStyles(theme => ({
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

async function getData() { 
    let apiName = 'personalize';
    let path = '/items/?userId=5';
    let myInit = { // OPTIONAL
        headers: {} // OPTIONAL
    }
    return  API.get(apiName, path, myInit);
}

function getFile(){
 // console.log(txt);
  /*
  fetch('/movies.csv')
    .then((r) => r.text())
    .then(text  => {
      console.log(text);
    })  
  */
//  var file = require('file-system');
  //var fs = require('fs');
  //console.log(file.readFile('./movies.csv'));
  //const filetxt = fs.readFile("test.txt", "utf8", function(err, data) {
//     console.log(data);
//  });
 

    return Papa.parse('./movies.csv', {
        header: true,
        delimiter: ',',
        download: true,
	      complete: (results) =>  {
		      console.log(results);
		      return results;
  	    }
      }); 
      
}

 function App2() {
  
  getFile();
  
  const constdata =   getData().then(response => {
      console.log('constdata response', response);
  });
  
  //console.log('constdata', constdata);
  
  const classes = useStyles();
  const [values, setValues] = React.useState({
    name: 'Cat in the Hat',
    age: '',
    multiline: 'Controlled',
    currency: 'EUR',
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };


  return (
    <div className="App">
     
        <img src={logo} alt="logo" />
        <p>
          <code> Amazon Personalize Workshop</code>
          <p>
          <TextField
              id="outlined-name"
              label="User-id"
              className={classes.textField}
              value={values.name}
              onChange={handleChange('name')}
              margin="normal"
              variant="outlined"
            />
            </p>
        </p>
     
    </div>
  );
}

class App extends Component { 
  constructor() {
    super();
    this.state = {
      movies: []
      };
    }
    
  getMovies(){
     Papa.parse('./movies.csv', {
        header: true,
        delimiter: ',',
        download: true,
        preview: 10, //use 0 for all rows
	      complete: (results) =>  {
		     // console.log(results);
		      this.setState({
		        movies: results.data
		      });
		      //  console.log('file', this.state);
		         this.getMovie(1);
  	    }
      });
  }
  
  /**
   * 
   * Get a movie title from movieId
   * 
   */ 
  getMovie(movieId){
   // console.log('move array length', this.state.movies.length);
    if(this.state.movies.length > 0){
      console.log('movies 2', this.state.movies);
    var movie = this.state.movies.filter(function(value){
     // console.log(value);
      return value.ITEM_ID === '' + movieId;
    });
    console.log('movie', movie);      
    }
  }
    
    componentDidMount(){
      this.getMovies();
     
    
    }
  
    render() { 
        return (
            <div>
               
            </div>
        );
    }
}

//export default withAuthenticator(App, {includeGreetings: true});

export default App;
