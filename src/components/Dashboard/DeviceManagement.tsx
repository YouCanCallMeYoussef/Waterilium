import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton,
  Chip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  LinearProgress,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';

interface Device {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  isActive: boolean;
  health: number;
  lastMaintenance: Date;
}

interface NewDevice {
  name: string;
  location: string;
}

// Mock data generator for devices
const generateMockDevices = (): Device[] => {
  return [
    {
      id: '1',
      name: 'Kitchen Faucet',
      location: 'Main Kitchen',
      status: 'online',
      isActive: true,
      health: 95,
      lastMaintenance: new Date(2024, 2, 1),
    },
    {
      id: '2',
      name: 'Bathroom Sink',
      location: 'Master Bathroom',
      status: 'online',
      isActive: true,
      health: 88,
      lastMaintenance: new Date(2024, 1, 15),
    },
    {
      id: '3',
      name: 'Garden Tap',
      location: 'Backyard',
      status: 'maintenance',
      isActive: false,
      health: 45,
      lastMaintenance: new Date(2023, 11, 20),
    },
  ];
};

const DeviceManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [devices, setDevices] = useState<Device[]>(generateMockDevices());
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [newDevice, setNewDevice] = useState<NewDevice>({
    name: '',
    location: '',
  });
  const [addDeviceError, setAddDeviceError] = useState<string>('');

  const handleDeviceToggle = (deviceId: string) => {
    setDevices(prev =>
      prev.map(device =>
        device.id === deviceId
          ? { ...device, isActive: !device.isActive }
          : device
      )
    );
  };

  const getStatusColor = (status: Device['status']) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'offline':
        return 'error';
      case 'maintenance':
        return 'warning';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'success';
    if (health >= 50) return 'warning';
    return 'error';
  };

  const handleOpenSettings = (device: Device) => {
    setSelectedDevice(device);
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setSelectedDevice(null);
    setIsSettingsOpen(false);
  };

  const handleOpenAddDevice = () => {
    setIsAddDeviceOpen(true);
    setAddDeviceError('');
    setNewDevice({ name: '', location: '' });
  };

  const handleCloseAddDevice = () => {
    setIsAddDeviceOpen(false);
    setAddDeviceError('');
  };

  const handleAddDevice = () => {
    // Validate inputs
    if (!newDevice.name.trim() || !newDevice.location.trim()) {
      setAddDeviceError('Please fill in all required fields');
      return;
    }

    // Create new device
    const device: Device = {
      id: Date.now().toString(),
      name: newDevice.name.trim(),
      location: newDevice.location.trim(),
      status: 'online',
      isActive: true,
      health: 100,
      lastMaintenance: new Date(),
    };

    // Add device to list
    setDevices(prev => [...prev, device]);
    handleCloseAddDevice();
  };

  const handleDeviceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDevice({ ...newDevice, name: e.target.value });
  };

  const handleDeviceLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDevice({ ...newDevice, location: e.target.value });
  };

  return (
    <Box>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'stretch' : 'center',
          mb: 3,
          gap: 2
        }}
      >
        <Typography variant="h6" sx={{ mb: isMobile ? 1 : 0 }}>
          Device Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size={isMobile ? "medium" : "small"}
          onClick={handleOpenAddDevice}
          fullWidth={isMobile}
          sx={{
            borderRadius: 2,
            height: isMobile ? 48 : 'auto',
          }}
        >
          Add Device
        </Button>
      </Box>

      <Grid container spacing={2}>
        {devices.map(device => (
          <Grid item xs={12} key={device.id}>
            <Card 
              sx={{ 
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" component="div" sx={{ mb: 0.5 }}>
                        {device.name}
                      </Typography>
                      <Typography color="textSecondary" variant="body2">
                        {device.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Switch
                        checked={device.isActive}
                        onChange={() => handleDeviceToggle(device.id)}
                        disabled={device.status === 'maintenance'}
                        size={isMobile ? "medium" : "small"}
                      />
                      <IconButton
                        size={isMobile ? "medium" : "small"}
                        onClick={() => handleOpenSettings(device)}
                      >
                        <SettingsIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" sx={{ minWidth: 80 }}>
                        Status:
                      </Typography>
                      <Chip
                        label={device.status.toUpperCase()}
                        color={getStatusColor(device.status)}
                        size={isMobile ? "medium" : "small"}
                        sx={{ borderRadius: 1.5 }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          Device Health
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {device.health}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={device.health}
                        color={getHealthColor(device.health)}
                        sx={{ 
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: theme.palette.grey[200],
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                          }
                        }}
                      />
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Device Settings Dialog */}
      <Dialog 
        open={isSettingsOpen} 
        onClose={handleCloseSettings}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            m: isMobile ? 0 : 2,
            borderRadius: isMobile ? 0 : 2,
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}>
          Device Settings
        </DialogTitle>
        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          {selectedDevice && (
            <Stack spacing={3} sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Device Name"
                defaultValue={selectedDevice.name}
                variant="outlined"
                size={isMobile ? "medium" : "small"}
              />
              <TextField
                fullWidth
                label="Location"
                defaultValue={selectedDevice.location}
                variant="outlined"
                size={isMobile ? "medium" : "small"}
              />
              <Box sx={{ 
                p: 2, 
                bgcolor: theme.palette.grey[50], 
                borderRadius: 2,
                border: `1px solid ${theme.palette.grey[200]}` 
              }}>
                <Typography variant="body2" color="textSecondary">
                  Last Maintenance: {selectedDevice.lastMaintenance.toLocaleDateString()}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          p: isMobile ? 2 : 3,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}>
          <Button onClick={handleCloseSettings} size={isMobile ? "large" : "medium"}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCloseSettings}
            size={isMobile ? "large" : "medium"}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Device Dialog */}
      <Dialog 
        open={isAddDeviceOpen} 
        onClose={handleCloseAddDevice}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            m: isMobile ? 0 : 2,
            borderRadius: isMobile ? 0 : 2,
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}>
          Add New Device
        </DialogTitle>
        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          <Stack spacing={3} sx={{ pt: 2, width: isMobile ? '100%' : '400px' }}>
            {addDeviceError && (
              <Alert 
                severity="error"
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                {addDeviceError}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Device Name"
              value={newDevice.name}
              onChange={handleDeviceNameChange}
              variant="outlined"
              size={isMobile ? "medium" : "small"}
              required
            />
            <TextField
              fullWidth
              label="Location"
              value={newDevice.location}
              onChange={handleDeviceLocationChange}
              variant="outlined"
              size={isMobile ? "medium" : "small"}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ 
          p: isMobile ? 2 : 3,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}>
          <Button 
            onClick={handleCloseAddDevice}
            size={isMobile ? "large" : "medium"}
            fullWidth={isMobile}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddDevice}
            size={isMobile ? "large" : "medium"}
            fullWidth={isMobile}
          >
            Add Device
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeviceManagement; 