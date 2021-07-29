import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { MenuItem, Typography, FormControl, makeStyles, Select } from '@material-ui/core';
import { ActivePane, useAppStateContext } from '../../../AppStateProvider/AppStateProvider';
import useDevices from '../useDevices/useDevices';

const labels = {
  audioinput: {
    audioLevelText: 'Input level',
    deviceLabelHeader: 'Input device',
    headerText: 'Microphone',
  },
  audiooutput: {
    audioLevelText: 'Output level',
    deviceLabelHeader: 'Output device',
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
  disablePointerEvent: {
    pointerEvents: 'none',
  },
});

export function AudioDevice({ disabled, kind, onDeviceChange }: AudioDeviceProps) {
  const classes = useStyles();
  const devices = useDevices();
  const audioDevices = kind === 'audiooutput' ? devices.audioOutputDevices : devices.audioInputDevices;
  const { state } = useAppStateContext();
  const [selectedDevice, setSelectedDevice] = useState('');
  const { deviceLabelHeader, headerText } = labels[kind];
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
          <Typography variant="subtitle2">
            <strong>{deviceLabelHeader}</strong>
          </Typography>
          <Typography variant="body1">System Default Audio Output</Typography>
        </div>
      )}

      {!noAudioRedirect && (
        <FormControl variant="outlined" disabled={disabled} className={classes.form} fullWidth>
          <Select
            value={selectedDevice}
            onChange={(e) => updateSelectedDevice(e.target.value as string)}
            className={clsx(classes.deviceList, {
              [classes.disablePointerEvent]: state.activePane !== ActivePane.AudioTest,
            })}
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
