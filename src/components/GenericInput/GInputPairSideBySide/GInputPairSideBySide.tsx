import React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {
  DoubleValueFields,
  Subfield,
  ClickHanlder,
} from './GInputPairSideBySide.types';
import { NONAME } from 'dns';

const noopOnChange = (values: object) => {};
const useStyles = makeStyles({
  root: {},
  overRideFocus: {
    /*
    Not currently in use.  Keeping because it maybe handy.
    Can be used to set disabled to appear active (parent disable but children active)
    */
    '& .Mui-disabled ': {
      color: '#0041b1',
    },
    '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
      color: '#0041b1',
      border: '2px solid #0041b1',
    },
  },
  textField: {
    backgroundColor: 'white',
    maxWidth: '18em',
  },
  subField: {
    backgroundColor: 'white',
    maxWidth: '7em',
    marginRight: '1em',
    top: '-1.5em',
    color: 'primary',
  },
  subFieldHidden: {
    display: 'none',
  },
  input: {
    color: 'white',
  },
});

const defaultSubfields = {
  min: { label: 'min', id: 'min' },
  max: { label: 'max', id: 'max' },
} as DoubleValueFields;

const extractValue = (updateValue: any, subfields: DoubleValueFields) => {
  const newValue = { ...updateValue };
  newValue[subfields.min.id] = updateValue[subfields.min.id];
  newValue[subfields.max.id] = updateValue[subfields.max.id];
  return newValue;
};

const defaultGetDisplayValue = (min: string | number, max: string | number) => {
  return `${min} / ${max}`;
};

interface TheAdornmentProps {
  onClick: ClickHanlder;
  isExpanded: boolean;
}

const TheAdornment = ({ onClick, isExpanded }: TheAdornmentProps) => {
  return (
    <InputAdornment position="end">
      <IconButton color="primary" onClick={onClick}>
        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
    </InputAdornment>
  );
};

export interface GInputPairSideBySideProps {
  /**
   * Parent set error messages for subfields
   */
  errorSubfields?: { [fieldId: string]: string };
  /**
   * Parent defined main text fields display
   */
  formatDispayedValues?: (min: string | number, max: string | number) => string;
  helperText?: string | ((value: any) => string);
  id?: string;
  inputProps?: object;
  expanded?: boolean;
  label?: string;
  onChange?: (newValue: any) => void; // should be <T> or something
  subfields?: { min: Subfield; max: Subfield };
  textFieldProps?: TextFieldProps;
  value?: any; // should be <T> or something?
}

/**
 * Primary UI component for user interaction
 */
export function GInputPairSideBySide({
  errorSubfields,
  formatDispayedValues = defaultGetDisplayValue,
  helperText,
  // id,
  inputProps = {},
  expanded = false,
  label,
  subfields = defaultSubfields,
  textFieldProps = {},
  value,
  onChange = noopOnChange,
}: GInputPairSideBySideProps) {
  const classes = useStyles();
  const [focusedField, setFocusedField] = React.useState(subfields.min);
  const [isExpanded, setIsExpanded] = React.useState(expanded);
  const [thisValue, setThisValue] = React.useState(
    extractValue(
      value || {
        [subfields.min.id]: subfields.min.intialValue || '',
        [subfields.max.id]: subfields.max.intialValue || '',
      },
      subfields
    )
  );
  const getHelperText = () => {
    // maybe parameterize then move to module scope
    // may not work... (see effectiveTextFieldProps)
    if (typeof helperText === 'function') {
      return helperText({
        [subfields.min.id]: thisValue[subfields.min.id],
        [subfields.max.id]: thisValue[subfields.max.id],
      });
    }
    return helperText;
  };

  const effectiveTextFieldProps = {
    label,
    helperText: getHelperText(),
    placeholder: focusedField.label, // not sure why this works, but it seems to
    required: false,
    variant: 'outlined' as 'outlined', // typescript compplains if I dont do it this way.
  };
  Object.assign(effectiveTextFieldProps, textFieldProps);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldIndex: 'min' | 'max'
  ) => {
    const newValue = { ...thisValue };
    newValue[subfields[fieldIndex].id] = e.target.value;

    setThisValue(newValue);
    onChange(newValue);
  };

  const handleExpandFields = () => {
    setIsExpanded(!isExpanded);
    toggleMaxMinFocus();
  };

  const setExpandedTrue = () => {
    setIsExpanded(true);
  };

  const setExpandedFalse = () => {
    setIsExpanded(false);
  };

  const toggleMaxMinFocus = () => {
    if (focusedField.id === subfields.max.id) {
      setFocusedField(subfields.min);
    } else {
      setFocusedField(subfields.max);
    }
  };

  const getValueForDisplay = (): string => {
    return formatDispayedValues(
      thisValue[subfields['min'].id],
      thisValue[subfields['max'].id]
    );
  };

  const hasError = () => {
    return subfieldError('min') || subfieldError('max');
  };

  const getAppropriateHelperText = () => {
    if (isExpanded) {
      return null;
    }
    if (hasError()) {
      return getSubfieldErrorMessages();
    }
    if (helperText && typeof helperText === 'function') {
      return helperText(thisValue);
    }
    if (helperText && typeof helperText === 'string') {
      return helperText;
    }
    return null;
  };

  const getSubfieldErrorMessages = () => {
    const errors = Object.assign({}, errorSubfields);
    const message = ['min', 'max']
      .map((idx, i) => {
        const fieldId = idx as 'min' | 'max';
        if (errors[subfields[fieldId].id] && errors[subfields[fieldId].id].length > 0) {
          return (
            <span key={i}>
              {subfields[fieldId].label + ': ' + errors[subfields[fieldId].id]}
              <br />
            </span>
          );
        }
        return false;
      })
      .filter((x) => x);
    return message.length > 0 ? message : false;
  };

  const subfieldError = (fieldId: 'min' | 'max') => {
    if (typeof errorSubfields !== 'object') {
      return false;
    }

    if (typeof errorSubfields[subfields[fieldId].id] !== 'string') {
      return false;
    }

    return errorSubfields[subfields[fieldId].id].length > 0;
  };

  return (
    <ClickAwayListener onClickAway={setExpandedFalse}>
      <div>
        <TextField
          error={subfieldError('min') || subfieldError('max')}
          className={classes.textField}
          onFocus={setExpandedTrue}
          // key={id}
          // id={id}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <TheAdornment onClick={handleExpandFields} isExpanded={isExpanded} />
            ),
            ...inputProps,
          }}
          value={getValueForDisplay()}
          {...effectiveTextFieldProps}
          helperText={getAppropriateHelperText()}
        />
        <Fade in={isExpanded}>
          <div>
            <TextField
              error={subfieldError('min')}
              className={isExpanded ? classes.subField : classes.subFieldHidden}
              // id={id + '-min'}
              inputProps={subfields['min'].inputProps}
              label={subfields['min'].label}
              margin="dense"
              onFocus={setExpandedTrue}
              onChange={(e) => {
                handleChange(e, 'min');
              }}
              value={thisValue[subfields['min'].id]}
              variant="outlined"
            />
            <TextField
              error={subfieldError('max')}
              className={isExpanded ? classes.subField : classes.subFieldHidden}
              color="primary"
              // id={id + '-max'}
              inputProps={subfields['max'].inputProps}
              label={subfields['max'].label}
              margin="dense"
              onChange={(e) => {
                handleChange(e, 'max');
              }}
              value={thisValue[subfields['max'].id]}
              variant="outlined"
            />
          </div>
        </Fade>
      </div>
    </ClickAwayListener>
  );
}
