import React from 'react';
import { useHistory, /*useParams,*/ useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AssessmentIcon from '@material-ui/icons/Assessment';
import SettingsIcon from '@material-ui/icons/Settings';

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    marginTop: '85px',
    position: 'fixed',
  },
  indicator: {
    backgroundColor: 'red',
  },
}));

const menu = [
  'users',
  'catalogs',
  'processes',
  'reports',
];

export default function ScrollableTabsButtonAuto() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const history = useHistory();
  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
    history.push(`/${menu[newValue]}`);
  };

  /** delete me */
  const match: any | null = useRouteMatch([
    '/:module',
  ]);

  return (
    <div className={classes.root} style={{display: match ? 'block' : 'none'}}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          classes={{
              indicator: classes.indicator
          }}
        >
          <Tab icon={<PersonPinIcon />} label="Usuarios" {...a11yProps(0)} />
          <Tab icon={<ListAltIcon />} label="Catálogos" {...a11yProps(1)} />
          <Tab icon={<SettingsIcon />} label="Procesos" {...a11yProps(2)} />
          <Tab icon={<AssessmentIcon />} label="Reportes" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      {/*
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      */}
    </div>
  );
}
