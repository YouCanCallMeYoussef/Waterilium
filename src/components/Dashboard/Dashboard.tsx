import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useTheme,
  Stack,
  Popover,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DevicesIcon from '@mui/icons-material/Devices';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import RealTimeMonitoring from './RealTimeMonitoring';
import AnalyticsDashboard from './AnalyticsDashboard';
import AlertsCenter from './AlertsCenter';
import DeviceManagement from './DeviceManagement';

// Water scarcity facts about Tunisia
const tunisiaWaterFacts = [
  "Tunisia is among the 33 countries most likely to face extreme water stress by 2040.",
  "80% of Tunisia's water resources are used for agriculture.",
  "Tunisia loses about 30% of its water due to leaks in the distribution system.",
  "Climate change could reduce Tunisia's water resources by 28% by 2030.",
  "Tunisia's per capita water availability is below the water poverty line of 1,000m³ per year.",
  "Groundwater resources in Tunisia are being depleted at an alarming rate.",
  "Over 50% of Tunisia's water resources are considered highly vulnerable to climate change.",
  "Tunisia's water demand is expected to increase by 30% by 2030.",
  "Some regions in Tunisia receive less than 100mm of rainfall per year.",
  "Water scarcity affects about 75% of Tunisia's agricultural land."
];

const WaterFactsChatbot = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [currentFact, setCurrentFact] = useState(0);
  const [isMessageDismissed, setIsMessageDismissed] = useState(() => {
    return localStorage.getItem('waterBotMessageDismissed') === 'true';
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isMessageDismissed) {
      setIsMessageDismissed(false);
      localStorage.removeItem('waterBotMessageDismissed');
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDismiss = () => {
    handleClose();
    setIsMessageDismissed(true);
    localStorage.setItem('waterBotMessageDismissed', 'true');
  };

  const open = Boolean(anchorEl);
  const id = open ? 'water-facts-popover' : undefined;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!open) {
        setCurrentFact((prev) => (prev + 1) % tunisiaWaterFacts.length);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [open]);

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: theme.zIndex.drawer + 2 }}>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          width: 56,
          height: 56,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
          boxShadow: theme.shadows[4],
          transition: 'transform 0.2s ease-in-out',
          '&:active': {
            transform: 'scale(0.95)',
          },
        }}
      >
        <SmartToyIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPopover-paper': {
            maxWidth: 320,
            borderRadius: 3,
            mt: -2,
            mr: 2,
          },
        }}
      >
        <Box sx={{ position: 'relative', p: 2, pr: 5 }}>
          <IconButton
            size="small"
            onClick={handleDismiss}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.error.main,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToyIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Water Awareness Bot
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Did you know?
            </Typography>
            <Typography variant="body1">
              {tunisiaWaterFacts[currentFact]}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Facts update every 10 seconds to raise awareness about water scarcity in Tunisia.
            </Typography>
          </Stack>
        </Box>
      </Popover>
    </Box>
  );
};

interface DashboardProps {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

const DRAWER_WIDTH = 240;

const Dashboard = ({ darkMode, setDarkMode }: DashboardProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(0);
  const theme = useTheme();

  const menuItems = [
    { text: 'Real-time Monitoring', icon: <DashboardIcon />, component: RealTimeMonitoring },
    { text: 'Analytics', icon: <TimelineIcon />, component: AnalyticsDashboard },
    { text: 'Alerts', icon: <NotificationsIcon />, component: AlertsCenter },
    { text: 'Devices', icon: <DevicesIcon />, component: DeviceManagement },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Waterilium
          </Typography>
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={selectedSection === index}
                  onClick={() => setSelectedSection(index)}
                  sx={{
                    borderRadius: '0 24px 24px 0',
                    mr: 2,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main + '20',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main + '30',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: selectedSection === index ? theme.palette.primary.main : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    sx={{ 
                      '& .MuiListItemText-primary': {
                        fontWeight: selectedSection === index ? 600 : 400,
                        color: selectedSection === index ? theme.palette.primary.main : 'inherit',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={selectedSection === index}
                  onClick={() => {
                    setSelectedSection(index);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          pt: 8,
          px: { xs: 2, sm: 3, md: 4 },
          pb: 4,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          {menuItems[selectedSection].component && (
            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              {React.createElement(menuItems[selectedSection].component)}
            </Paper>
          )}
        </Container>
      </Box>

      {/* Add WaterFactsChatbot to the main layout */}
      <WaterFactsChatbot />
    </Box>
  );
};

export default Dashboard; 