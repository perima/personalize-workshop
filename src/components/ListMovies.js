import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

export default function ListMovies(props) {
    

const listItems = props.movies.map((link) => 
        <ListItem 
          key={link.ITEM_ID} 
          button
          onClick={() => {props.action(link.ITEM_ID, link.title)}}
          >
          <ListItemText primary={link.title} />
        </ListItem>
        );
  const classes = useStyles();

  return (
    <div className={classes.root}>
          {listItems}
    </div>
  );
  
}