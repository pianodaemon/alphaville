import React from 'react';
import { Controller } from "react-hook-form";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';

type Props = {
  title: string,
  options?: Array<{
    id: any,
    description?: string,
    code?: string,
    title?: string,
  }>,
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void,
  name: string,
  control: any,
  getValues: any,
  setValue: any,
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      '& > *': {
        // margin: theme.spacing(1),
        width: 'auto',
        // maxWidth: '300px',
        // height: theme.spacing(16),
        flexWrap: 'wrap',
      },
      '& > div': {
        overflowY: 'scroll',
        maxHeight: '300px',
      },
      '& > * > fieldset': {
        wordBreak: 'break-all',
      },
      '& > span': {
        marginBottom: theme.spacing(1),
      },
      marginBottom: theme.spacing(3),
      // maxHeight: '100px',
    },
    formControl: {
      margin: theme.spacing(1),
    },
  }),
);

/**
 * 
 * Warning: 
 * this component is Highly Coupled to React Hook Forms lib  
 */
export function CheckboxesGroup({
  name,
  options,
  title,
  control,
  getValues,
  setValue,
}: Props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <FormLabel component="span">{title}</FormLabel>
      <Paper elevation={3}>
        <FormControl component="fieldset" className={classes.formControl}>
          {/* <FormLabel component="legend">Assign responsibility</FormLabel> */}
          <FormGroup>
            {options &&
              options.map((option, index) => (
                <Controller
                  name={name}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          name={name}
                          value={option.id}
                          key={index}
                          onChange={(e:any) => {
                            const value = parseInt(e.target.value, 10);
                            const values = getValues(name) || [];
                            if (e.target.checked) {
                              if (!values.includes(value)) {
                                setValue(name, [...values, value]);
                              }
                            } else if (!e.target.checked) {
                              if (values.includes(value)) {
                                const a = (values || []).filter(item => item !== value);
                                setValue(name, [...a]);
                              }
                            }
                          }}
                          checked={
                            (getValues(name) || []).includes(parseInt(option.id, 10))
                          }
                        />
                      }
                      label={`${option.title} - ${option.code}`}
                      key={`${option.id}-${index.toString().concat('index')}`}
                    />
                  )}
                  key={index}
                />
              ))}
          </FormGroup>
          {/* <FormHelperText>Be careful</FormHelperText> */}
        </FormControl>
      </Paper>
    </div>
  );
}
