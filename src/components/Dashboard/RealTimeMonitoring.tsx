import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  useMediaQuery,
  Stack,
  Paper,
  CircularProgress,
  Divider,
} from '@mui/material';
import OpacityIcon from '@mui/icons-material/Opacity';
import CompressIcon from '@mui/icons-material/Compress';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
  ChartData,
  ScaleOptions,
  GridLineOptions,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// Mock data generator
const generateMockData = () => {
  return {
    flowRate: (Math.random() * 10).toFixed(2),
    pressure: (Math.random() * 100).toFixed(1),
    temperature: (20 + Math.random() * 20).toFixed(1),
    qualityIndex: Math.floor(Math.random() * 100),
    pH: (6.5 + Math.random() * 2).toFixed(1),
    turbidity: (Math.random() * 5).toFixed(2),
  };
};

const getQualityColor = (quality: number) => {
  if (quality >= 90) return '#4caf50';
  if (quality >= 70) return '#8bc34a';
  if (quality >= 50) return '#ffc107';
  if (quality >= 30) return '#ff9800';
  return '#f44336';
};

const getQualityLabel = (quality: number) => {
  if (quality >= 90) return 'Excellent';
  if (quality >= 70) return 'Good';
  if (quality >= 50) return 'Fair';
  if (quality >= 30) return 'Poor';
  return 'Poor';
};

const QualityIndicator = ({ value }: { value: number }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const color = getQualityColor(value);
  const size = isMobile ? 120 : 140;

  return (
    <Box sx={{ 
      position: 'relative', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
    }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={size}
          thickness={4}
          sx={{ color: alpha(theme.palette.grey[200], 0.4) }}
        />
        <CircularProgress
          variant="determinate"
          value={value}
          size={size}
          thickness={4}
          sx={{
            color: color,
            position: 'absolute',
            left: 0,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Typography variant={isMobile ? "h4" : "h3"} component="div" sx={{ 
            fontWeight: 600,
            color: color,
          }}>
            {value}%
          </Typography>
        </Box>
      </Box>
      <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 500 }}>
        {getQualityLabel(value)}
      </Typography>
    </Box>
  );
};

const MetricCard = ({ title, value, unit, icon, color }: any) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: isMobile ? 2.5 : 3 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? 48 : 56,
                height: isMobile ? 48 : 56,
                borderRadius: 2,
                backgroundColor: alpha(color, 0.12),
                color: color,
                mr: 2,
              }}
            >
              {React.cloneElement(icon, { 
                sx: { fontSize: isMobile ? 24 : 28 } 
              })}
            </Box>
            <Box>
              <Typography color="textSecondary" variant="body2" sx={{ mb: 0.5 }}>
                {title}
              </Typography>
              <Typography variant={isMobile ? "h5" : "h4"} component="div" sx={{ 
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}>
                {value}
                <Typography 
                  component="span" 
                  variant={isMobile ? "body1" : "h6"} 
                  color="textSecondary" 
                  sx={{ ml: 1 }}
                >
                  {unit}
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const RealTimeMonitoring = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [liveData, setLiveData] = useState(generateMockData());
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [
      {
        label: 'Flow Rate',
        data: [],
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        fill: true,
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateMockData();
      setLiveData(newData);
      
      setChartData((prevData: ChartData<'line'>) => {
        const newLabels = [...prevData.labels, new Date().toLocaleTimeString()].slice(-10);
        const newDataPoints = [...prevData.datasets[0].data, parseFloat(newData.flowRate)].slice(-10);
        
        return {
          labels: newLabels,
          datasets: [
            {
              ...prevData.datasets[0],
              data: newDataPoints,
            },
          ],
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Real-time Monitoring
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          color: theme.palette.success.main,
        }}>
          <TrendingUpIcon />
          <Typography variant="body2">Live Updates</Typography>
        </Box>
      </Box>
      
      <Grid container spacing={isMobile ? 3 : 2.5}>
        {/* Main Metrics Row for Desktop */}
        {!isMobile && (
          <Grid item xs={12}>
            <Grid container spacing={2.5}>
              {/* Water Quality Card */}
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: 2,
                      }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            backgroundColor: alpha(getQualityColor(liveData.qualityIndex), 0.12),
                            color: getQualityColor(liveData.qualityIndex),
                          }}
                        >
                          <WaterDropIcon sx={{ fontSize: 28 }} />
                        </Box>
                        <Typography variant="h6">Overall Water Quality</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <QualityIndicator value={liveData.qualityIndex} />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* pH and Turbidity Card */}
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={4}>
                      <Box>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          pH Level
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 600 }}>
                          {liveData.pH}
                          <Typography 
                            component="span" 
                            variant="h6" 
                            color="textSecondary" 
                            sx={{ ml: 1 }}
                          >
                            pH
                          </Typography>
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Turbidity
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 600 }}>
                          {liveData.turbidity}
                          <Typography 
                            component="span" 
                            variant="h6" 
                            color="textSecondary" 
                            sx={{ ml: 1 }}
                          >
                            NTU
                          </Typography>
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Live Metrics Card */}
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <Box>
                        <MetricCard
                          title="Flow Rate"
                          value={liveData.flowRate}
                          unit="L/min"
                          icon={<OpacityIcon />}
                          color={theme.palette.primary.main}
                        />
                      </Box>
                      <Box>
                        <MetricCard
                          title="Pressure"
                          value={liveData.pressure}
                          unit="kPa"
                          icon={<CompressIcon />}
                          color={theme.palette.secondary.main}
                        />
                      </Box>
                      <Box>
                        <MetricCard
                          title="Temperature"
                          value={liveData.temperature}
                          unit="°C"
                          icon={<DeviceThermostatIcon />}
                          color="#ff9800"
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <>
            {/* Water Quality Card */}
            <Grid item xs={12}>
              <Card 
                sx={{ 
                  mb: 2,
                  borderRadius: 3,
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Stack spacing={3} alignItems="center">
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: 2,
                        }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              backgroundColor: alpha(getQualityColor(liveData.qualityIndex), 0.12),
                              color: getQualityColor(liveData.qualityIndex),
                            }}
                          >
                            <WaterDropIcon sx={{ fontSize: 24 }} />
                          </Box>
                          <Typography variant="h6">Overall Water Quality</Typography>
                        </Box>
                        <QualityIndicator value={liveData.qualityIndex} />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Divider orientation="horizontal" sx={{ mb: 3 }} />
                      <Stack spacing={4}>
                        <Box>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            pH Level
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 600 }}>
                            {liveData.pH}
                            <Typography 
                              component="span" 
                              variant="h6" 
                              color="textSecondary" 
                              sx={{ ml: 1 }}
                            >
                              pH
                            </Typography>
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            Turbidity
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 600 }}>
                            {liveData.turbidity}
                            <Typography 
                              component="span" 
                              variant="h6" 
                              color="textSecondary" 
                              sx={{ ml: 1 }}
                            >
                              NTU
                            </Typography>
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Mobile Metrics */}
            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="Flow Rate"
                value={liveData.flowRate}
                unit="L/min"
                icon={<OpacityIcon />}
                color={theme.palette.primary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="Pressure"
                value={liveData.pressure}
                unit="kPa"
                icon={<CompressIcon />}
                color={theme.palette.secondary.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <MetricCard
                title="Temperature"
                value={liveData.temperature}
                unit="°C"
                icon={<DeviceThermostatIcon />}
                color="#ff9800"
              />
            </Grid>
          </>
        )}

        {/* Flow Rate Chart - Full Width */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <CardContent sx={{ p: isMobile ? 2 : 3 }}>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Flow Rate Trend
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                >
                  <Typography variant="body2">
                    Last 10 Minutes
                  </Typography>
                </Paper>
              </Box>
              <Box sx={{ height: isMobile ? 300 : 500 }}>
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        backgroundColor: theme.palette.background.paper,
                        titleColor: theme.palette.text.primary,
                        bodyColor: theme.palette.text.secondary,
                        borderColor: theme.palette.divider,
                        borderWidth: 1,
                        padding: isMobile ? 12 : 8,
                        titleFont: {
                          size: isMobile ? 14 : 12,
                          weight: 600 as const,
                        },
                        bodyFont: {
                          size: isMobile ? 13 : 11,
                        },
                        displayColors: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: alpha(theme.palette.divider, 0.1),
                          display: true,
                        },
                        ticks: {
                          color: theme.palette.text.secondary,
                          font: {
                            size: isMobile ? 12 : 10,
                          },
                          padding: 8,
                        },
                      } as ScaleOptions<'linear'>,
                      x: {
                        grid: {
                          display: false,
                        },
                        ticks: {
                          color: theme.palette.text.secondary,
                          font: {
                            size: isMobile ? 12 : 10,
                          },
                          maxRotation: isMobile ? 45 : 0,
                          minRotation: isMobile ? 45 : 0,
                          padding: 8,
                        },
                      } as ScaleOptions<'linear'>,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RealTimeMonitoring; 