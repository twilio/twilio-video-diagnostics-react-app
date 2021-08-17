import React, { useState, useEffect, useCallback } from 'react';
import { MenuItem, Typography, FormControl, makeStyles, Select } from '@material-ui/core';
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
});

export function AudioDevice({ disabled, kind, onDeviceChange }: AudioDeviceProps) {
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
    },
    [onDeviceChange, setSelectedDevice]
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
    </>
  );
}

export default React.memo(AudioDevice);
