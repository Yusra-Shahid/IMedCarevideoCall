import React, { useState, useContext } from 'react';
import { Button, TextField, Grid, Typography, Container, Paper } from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Assignment, Phone, PhoneDisabled } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { SocketContext } from '../Context';
import './sidebar.css';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridContainer: {
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  container: {
    width: '600px',
    margin: '35px 0',
    padding: 0,
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    },
  },
  margin: {
    marginTop: 20,
  },
  padding: {
    padding: 20,
  },
  paper: {
    padding: '10px 20px',
    border: '2px solid black',
  },
  // patient_info: {
  //   width: '30px',
  //   height: '500px',
  //   backgroundColor: 'red',
  // },
}));

const Sidebar = ({ children }) => {
  const { me, callAccepted, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');
  const [appid, setappid] = useState('');
  const [PatientName, setPatientName] = useState('');
  const [AppointmentTime, setAppointmentTime] = useState('');
  const [AppointmetDate, setAppointmetDate] = useState('');
  const [active, setactive] = useState('false');
  const [active2, setactive2] = useState('');
  const classes = useStyles();
  const handleclick = async () => {
    axios.post('https://imedcare.herokuapp.com/request/videocall', { appointID: appid, videocallID: me }).then((acc) => {
      console.log(acc);
      setName(acc.data.patient);
      setactive('true');
      setactive2('');
      setPatientName(acc.data.patient);
      setAppointmentTime(acc.data.Time);
      setAppointmetDate(acc.data.Date);
    });
  };
  const handleclick2 = async () => {
    axios.post('https://imedcare.herokuapp.com/request/videocallbydoc', { appointID: idToCall }).then((acc) => {
      console.log(acc);
      setName(acc.data.doctor);
      callUser(acc.data.videocallID);
      // setactive('true');
      // setactive2('');
      // setPatientName(acc.data.patient);
      // setAppointmentTime(acc.data.Time);
      // setAppointmetDate(acc.data.Date);
    });
  };
  return (
    <Container className={classes.container}>
      <Paper elevation={10} className={classes.paper}>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid container className={classes.gridContainer}>
            <Grid item xs={12} md={6} className={classes.padding}>
              <div className="ask"> are you patient?<input type="radio" onChange={() => setactive2('false')} name="udertype" /> are you doctor? <input onChange={() => setactive2('true')} type="radio" name="udertype" /></div>
              {active2 === 'false'
                && (
                  <>
                    <Typography gutterBottom variant="h6">Account Info</Typography>
                    <TextField label="enter your Appoiment tracker id" type="email" value={appid} onChange={(e) => setappid(e.target.value)} fullWidth />
                    <CopyToClipboard text={me} className={classes.margin}>
                      <Button onClick={handleclick} variant="contained" color="primary" fullWidth startIcon={<Assignment fontSize="large" />}>
                        Sumbit
                      </Button>
                      {/* <div>kuch bhi</div> */}
                    </CopyToClipboard>
                  </>
                )}
              {active === 'true'
                && (
                  <div className="patient_info">
                    <div className="Patient_details">
                      <h12> Patient Name : {PatientName}</h12><br /><br />
                      <h13> Appointment Time: {AppointmentTime}</h13><br /><br />
                      <h14> Appointmet Date: {AppointmetDate}</h14><br /><br />
                    </div>
                  </div>
                )}

            </Grid>

            {active2 === 'true'
              && (

                <Grid item xs={12} md={6} className={classes.padding}>
                  <Typography gutterBottom variant="h6">Enter appoint tracker ID to make call</Typography>
                  <TextField label="Appoiment Id" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth />
                  {callAccepted && !callEnded ? (
                    <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} fullWidth onClick={leaveCall} className={classes.margin}>
                      Hang Up
                    </Button>
                  ) : (
                    <Button variant="contained" color="primary" startIcon={<Phone fontSize="large" />} fullWidth onClick={handleclick2} className={classes.margin}>
                      Call
                    </Button>
                  //    <Button variant="contained" color="primary" startIcon={<Phone fontSize="large" />} fullWidth onClick={() => callUser(idToCall)} className={classes.margin}>
                  //    Call
                  //  </Button>
                  )}
                </Grid>
              )}
          </Grid>

        </form>
        {children}
      </Paper>
    </Container>
  );
};

export default Sidebar;
