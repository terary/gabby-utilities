import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// const useStyles = makeStyles({
//   root: {
//     backgroundColor: 'red',
//     color: props => props.color,
//   },
// });


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      border: '1px black solid',
      borderRadius: '5px',
      // margin: 5,
    },
    gridItem: {
      border: '1px grey solid',
      borderRadius: '25px',
      // margin: theme.spacing(1),
      // padding: '20px',
      // margin: '20px',
    },
    termItem : {

    },
    termItemText : {
      display: 'inline-block',
    },
    termItemButtonBar : {
      display: 'inline-block',
      float: 'right',
    },
    branch: {

    },

    branchContainer: {
      flexGrow: 1,
      border: '1px black solid',
      borderRadius: '5px',
      // margin: 5,
    },
    leafContainer: {
      border: '1px black solid',
      borderRadius: '5px',
      flexGrow: 1,
      // padding: theme.spacing(2),
      // margin:  '3px',
    },
    branchJunction: {

    },
    branchChildren: {
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  })
);

export { useStyles };
