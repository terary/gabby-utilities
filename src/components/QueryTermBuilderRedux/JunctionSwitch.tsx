import { FormControlLabel, FormGroup, Switch } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

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
        },
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

const defaultJunctionLabels = {
  $and: 'All of',
  $or: 'Any of',
};

interface JunctionSwitchProps {
  junctionLabels?: typeof defaultJunctionLabels;
  junctionOperator: '$and' | '$or';
  onChange: (junction: string) => void;
}

export const JunctionSwitch = ({
  junctionLabels = defaultJunctionLabels,
  junctionOperator,
  onChange,
}: JunctionSwitchProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };
  return (
    <ThemeProvider theme={theme}>
      <FormGroup style={{ display: 'inline' }}>
        <FormControlLabel
          control={
            <Switch
              size="small"
              value={junctionOperator}
              // defaultChecked
              checked={junctionOperator === '$and'}
              onChange={handleChange}
            />
          }
          label={junctionLabels[junctionOperator]}
        />
      </FormGroup>
    </ThemeProvider>
  );
};
