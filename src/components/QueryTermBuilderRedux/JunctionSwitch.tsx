import { FormControlLabel, FormGroup, Switch } from "@material-ui/core";
import {
  createMuiTheme,
  makeStyles,
  createStyles,
  // Theme as AugmentedTheme,
  ThemeProvider,
} from '@material-ui/core/styles';

const theme = createMuiTheme({
  overrides: {
    MuiFormControlLabel: {
      root: {
        marginLeft: 'unset',
      },
    },
    MuiSwitch: {
      switchBase: {
        // Controls default (unchecked) color for the thumb
        // color: '#ccc',
        // margin: '3px',
        color: '#aab6fe',
      },
      colorSecondary: {
        '&$checked': {
          // Controls checked color for the thumb
          color: '#7986cb',
        }
      },
      track: {
        // Controls default (unchecked) color for the track
        opacity: 0.2,
        backgroundColor: '#7986cb',
        '$checked$checked + &': {
          // Controls checked color for the track
          opacity: 0.7,
          backgroundColor: '#aab6fe',
        },
      },
    },
  },
});

interface JunctionSwitchProps {
  junctionOperator: '$and' | '$or';
  onChange: (junction: string) => void;
}
const junctionLabel = {
  $and: 'All of',
  $or: 'Any Of',
};


export const JunctionSwitch = ({ onChange, junctionOperator }: JunctionSwitchProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };
  return (
    <ThemeProvider theme={theme}>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              size="small"
              value={junctionOperator}
              defaultChecked
              onChange={handleChange}
            />
          }
          label={junctionLabel[junctionOperator]}
        />
      </FormGroup>
    </ThemeProvider>
  );
}