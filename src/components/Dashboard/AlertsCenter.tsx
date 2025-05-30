import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Card,
  CardContent,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
  alpha,
  Badge,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WaterDamageIcon from '@mui/icons-material/WaterDamage';

type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
type AlertType = 'leak' | 'consumption' | 'maintenance' | 'system';

interface Alert {
  id: string;
  message: string;
  severity: AlertSeverity;
  type: AlertType;
  timestamp: Date;
  isRead: boolean;
  location?: string;
  details?: string;
}

// Mock data generator for alerts
const generateMockAlerts = (): Alert[] => {
  return [
    {
      id: '1',
      message: 'LEAK DETECTED: Kitchen Faucet automatically shut down',
      severity: 'critical',
      type: 'leak',
      timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
      isRead: false,
      location: 'Kitchen',
      details: 'Abnormal flow pattern detected. System initiated emergency shutdown.',
    },
    {
      id: '2',
      message: 'High water consumption detected in Kitchen Faucet',
      severity: 'high',
      type: 'consumption',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isRead: false,
    },
    {
      id: '3',
      message: 'Bathroom Sink maintenance due in 2 days',
      severity: 'medium',
      type: 'maintenance',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: true,
    },
    {
      id: '4',
      message: 'Garden Tap water pressure optimized',
      severity: 'low',
      type: 'system',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isRead: true,
    },
  ];
};

const AlertsCenter = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [alerts, setAlerts] = useState<Alert[]>(generateMockAlerts());

  // Simulate receiving new alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new alert
        const alertTypes: AlertType[] = ['consumption', 'maintenance', 'system'];
        const randomType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        
        // 10% chance of leak alert
        if (Math.random() < 0.1) {
          const locations = ['Kitchen', 'Bathroom', 'Garden'];
          const randomLocation = locations[Math.floor(Math.random() * locations.length)];
          const newAlert: Alert = {
            id: Date.now().toString(),
            message: `LEAK DETECTED: ${randomLocation} Faucet automatically shut down`,
            severity: 'critical',
            type: 'leak',
            timestamp: new Date(),
            isRead: false,
            location: randomLocation,
            details: 'Abnormal flow pattern detected. System initiated emergency shutdown.',
          };
          setAlerts(prev => [newAlert, ...prev].slice(0, 10));
        } else {
          const newAlert: Alert = {
            id: Date.now().toString(),
            message: 'New anomaly detected in water usage',
            severity: Math.random() > 0.5 ? 'medium' : 'low',
            type: randomType,
            timestamp: new Date(),
            isRead: false,
          };
          setAlerts(prev => [newAlert, ...prev].slice(0, 10));
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const getSeverityIcon = (severity: AlertSeverity, type: AlertType) => {
    const iconProps = { 
      fontSize: isMobile ? "medium" : "small",
      sx: { 
        color: theme.palette[getSeverityColor(severity)].main,
      }
    };

    if (type === 'leak') {
      return <WaterDamageIcon {...iconProps} />;
    }

    switch (severity) {
      case 'critical':
      case 'high':
        return <ErrorIcon {...iconProps} />;
      case 'medium':
        return <WarningIcon {...iconProps} />;
      case 'low':
        return <InfoIcon {...iconProps} />;
    }
  };

  const getSeverityColor = (severity: AlertSeverity): 'error' | 'warning' | 'info' => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (minutes < 1440) {
      return `${Math.floor(minutes / 60)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Alerts & Notifications
        </Typography>
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.75rem',
              height: 20,
              minWidth: 20,
            },
          }}
        >
          <NotificationsIcon color="action" />
        </Badge>
      </Box>

      <Card
        sx={{
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <List sx={{ p: 0 }}>
            {alerts.map((alert, index) => (
              <Box key={alert.id}>
                <ListItem
                  sx={{
                    py: isMobile ? 2 : 1.5,
                    px: isMobile ? 2 : 3,
                    backgroundColor: !alert.isRead ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteAlert(alert.id)}
                      sx={{
                        color: theme.palette.grey[500],
                        '&:hover': {
                          color: theme.palette.error.main,
                        },
                      }}
                    >
                      <DeleteIcon fontSize={isMobile ? "medium" : "small"} />
                    </IconButton>
                  }
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getSeverityIcon(alert.severity, alert.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Stack spacing={1}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: !alert.isRead ? 600 : 400,
                            mb: 0.5,
                          }}
                        >
                          {alert.message}
                        </Typography>
                        {alert.details && (
                          <Typography 
                            variant="body2" 
                            color="textSecondary"
                            sx={{ 
                              mb: 0.5,
                              fontSize: isMobile ? '0.875rem' : '0.75rem',
                            }}
                          >
                            {alert.details}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={alert.severity.toUpperCase()}
                            color={getSeverityColor(alert.severity)}
                            size={isMobile ? "medium" : "small"}
                            sx={{ 
                              borderRadius: 1,
                              height: isMobile ? 28 : 24,
                            }}
                          />
                          {alert.type === 'leak' && (
                            <Chip
                              label="LEAK"
                              color="error"
                              size={isMobile ? "medium" : "small"}
                              sx={{ 
                                borderRadius: 1,
                                height: isMobile ? 28 : 24,
                              }}
                            />
                          )}
                          <Typography 
                            variant="caption" 
                            color="textSecondary"
                            sx={{ fontSize: isMobile ? '0.875rem' : '0.75rem' }}
                          >
                            {formatTimestamp(alert.timestamp)}
                          </Typography>
                        </Box>
                      </Stack>
                    }
                  />
                </ListItem>
                {index < alerts.length - 1 && (
                  <Divider 
                    sx={{ 
                      borderColor: theme.palette.divider,
                      opacity: 0.5,
                    }} 
                  />
                )}
              </Box>
            ))}
            {alerts.length === 0 && (
              <Box sx={{ 
                p: 4, 
                textAlign: 'center',
                color: theme.palette.text.secondary,
              }}>
                <Typography variant="body1">
                  No alerts to display
                </Typography>
              </Box>
            )}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AlertsCenter; 