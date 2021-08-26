import React, { useState, useEffect, useCallback } from 'react';
import { MenuItem, Typography, FormControl, makeStyles, Select } from '@material-ui/core';
import { SmallError } from '../../../../icons/SmallError';
import useDevices from '../../../../hooks/useDevices/useDevices';

const labels = {
  audioinput: {
    audioLevelText: 'Input level',
    headerText: 'Microphone',
  },
  audiooutput: {
    audioLevelText: 'Output level',
    headerText: 'Speaker',
  },
};

interface AudioDeviceProps {
  disabled: boolean;
  kind: 'audioinput' | 'audiooutput';
  onDeviceChange: (value: string) => void;
  setDeviceError: (value: string) => void;
  error?: string;
}

const useStyles = makeStyles({
  form: {
    margin: '0.5em 0 1em',
  },
  deviceLabelContainer: {
    margin: '0.8em 0',
  },
  deviceList: {
    height: '36px',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1em',
    '& svg': {
      marginRight: '0.3em',
    },
  },
});

export function AudioDevice({ disabled, kind, onDeviceChange, setDeviceError, error }: AudioDeviceProps) {
  const classes = useStyles();
  const devices = useDevices();
  const audioDevices = kind === 'audiooutput' ? devices.audioOutputDevices : devices.audioInputDevices;
  const [selectedDevice, setSelectedDevice] = useState('');
  const { headerText } = labels[kind];
  const noAudioRedirect = !Audio.prototype.setSinkId && kind === 'audiooutput';

  const updateSelectedDevice = useCallback(
    (value: string) => {
      onDeviceChange(value);
      setSelectedDevice(value);
      setDeviceError('');
    },
    [onDeviceChange, setSelectedDevice, setDeviceError]
  );

  useEffect(() => {
    const hasSelectedDevice = audioDevices.some((device) => device.deviceId === selectedDevice);
    if (audioDevices.length && !hasSelectedDevice) {
      updateSelectedDevice(audioDevices[0].deviceId);
    }
  }, [audioDevices, devices, selectedDevice, updateSelectedDevice]);

  return (
    <>
      <Typography variant="subtitle2">
        <strong>{headerText}</strong>
      </Typography>

      {noAudioRedirect && (
        <div className={classes.deviceLabelContainer}>
          <Typography variant="body1">System Default Audio Output</Typography>
        </div>
      )}

      {!noAudioRedirect && (
        <FormControl variant="outlined" disabled={disabled} className={classes.form} fullWidth>
          <Select
            value={selectedDevice}
            onChange={(e) => updateSelectedDevice(e.target.value as string)}
            className={classes.deviceList}
          >
            {audioDevices.map((device) => (
              <MenuItem value={device.deviceId} key={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {error && (
        <div className={classes.error}>
          <SmallError />
          <Typography variant="subtitle2" color="error">
            {error === 'No audio detected' ? 'No audio detected.' : 'Unable to connect.'}
          </Typography>
        </div>
      )}
    </>
  );
}

export default React.memo(AudioDevice);
