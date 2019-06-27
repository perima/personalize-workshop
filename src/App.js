import React from 'react';
import logo from './AWS_logo_RGB_REV.png';
import './personalize.css';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Amplify, {API} from 'aws-amplify';
import aws_exports from './aws-exports';
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
    return await API.get(apiName, path, myInit);
}

 function App() {
  
  
  
  const constdata =   getData().then(response => {
      console.log('constdata response', response);
  });
  
  console.log('constdata', constdata);
  
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

export default App;
