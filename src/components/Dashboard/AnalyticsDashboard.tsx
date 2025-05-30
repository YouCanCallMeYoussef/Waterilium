import { useState, useMemo } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery,
  Stack,
  alpha,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ConsumptionData {
  usage: number;
  savings: number;
}

interface ChartData {
  date: string;
  value: number;
}

// Mock data generator
const generateConsumptionData = (count: number): ConsumptionData[] => {
  return Array.from({ length: count }, () => ({
    usage: Math.floor(Math.random() * 1000),
    savings: Math.floor(Math.random() * 200),
  }));
};

const AnalyticsDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');

  const handleTimeRangeChange = (_: React.MouseEvent<HTMLElement>, newTimeRange: string) => {
    if (newTimeRange !== null) {
      setSelectedTimeRange(newTimeRange);
    }
  };

  const generateMockData = (days: number): ChartData[] => {
    const data: ChartData[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString(),
        value: Math.floor(Math.random() * 100) + 50,
      });
    }
    
    return data;
  };

  const data = useMemo(() => {
    switch (selectedTimeRange) {
      case 'week':
        return generateMockData(7);
      case 'month':
        return generateMockData(30);
      case 'year':
        return generateMockData(365);
      default:
        return generateMockData(7);
    }
  }, [selectedTimeRange]);

  const getChartData = () => {
    let labels: string[] = [];
    let consumptionData: ConsumptionData[] = [];

    switch (selectedTimeRange) {
      case 'week':
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        consumptionData = generateConsumptionData(7);
        break;
      case 'month':
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        consumptionData = generateConsumptionData(4);
        break;
      case 'year':
        labels = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        consumptionData = generateConsumptionData(12);
        break;
    }

    return {
      labels,
      datasets: [
        {
          label: 'Water Usage (L)',
          data: consumptionData.map(d => d.usage),
          backgroundColor: alpha(theme.palette.primary.main, 0.7),
          borderRadius: 4,
        },
        {
          label: 'Water Savings (L)',
          data: consumptionData.map(d => d.savings),
          backgroundColor: alpha(theme.palette.success.main, 0.7),
          borderRadius: 4,
        },
      ],
    };
  };

  const totalUsage = generateConsumptionData(7).reduce((acc, curr) => acc + curr.usage, 0);
  const totalSavings = generateConsumptionData(7).reduce((acc, curr) => acc + curr.savings, 0);
  const efficiency = ((totalSavings / (totalUsage + totalSavings)) * 100).toFixed(1);

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Analytics Dashboard
      </Typography>

      <Grid container spacing={isMobile ? 3 : 2}>
        {/* Summary Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardContent sx={{ p: isMobile ? 3 : 2 }}>
                  <Stack spacing={1}>
                    <Typography color="textSecondary" variant="body2">
                      Total Usage
                    </Typography>
                    <Typography variant={isMobile ? "h4" : "h5"} sx={{ fontWeight: 600 }}>
                      {totalUsage}
                      <Typography component="span" variant="body1" color="textSecondary" sx={{ ml: 1 }}>
                        L
                      </Typography>
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardContent sx={{ p: isMobile ? 3 : 2 }}>
                  <Stack spacing={1}>
                    <Typography color="textSecondary" variant="body2">
                      Water Saved
                    </Typography>
                    <Typography variant={isMobile ? "h4" : "h5"} sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                      {totalSavings}
                      <Typography component="span" variant="body1" color="textSecondary" sx={{ ml: 1 }}>
                        L
                      </Typography>
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardContent sx={{ p: isMobile ? 3 : 2 }}>
                  <Stack spacing={1}>
                    <Typography color="textSecondary" variant="body2">
                      Efficiency Score
                    </Typography>
                    <Typography variant={isMobile ? "h4" : "h5"} sx={{ fontWeight: 600 }}>
                      {efficiency}
                      <Typography component="span" variant="body1" color="textSecondary" sx={{ ml: 1 }}>
                        %
                      </Typography>
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Time Range Toggle */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: isMobile ? 'stretch' : 'flex-start', mb: 2 }}>
            <ToggleButtonGroup
              value={selectedTimeRange}
              exclusive
              onChange={handleTimeRangeChange}
              aria-label="time range"
              sx={{
                width: isMobile ? '100%' : 'auto',
                '& .MuiToggleButton-root': {
                  flex: isMobile ? 1 : 'initial',
                  px: isMobile ? 3 : 2,
                  py: isMobile ? 1.5 : 1,
                  typography: isMobile ? 'body1' : 'body2',
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    },
                  },
                },
              }}
            >
              <ToggleButton value="week">Week</ToggleButton>
              <ToggleButton value="month">Month</ToggleButton>
              <ToggleButton value="year">Year</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Grid>

        {/* Usage Chart */}
        <Grid item xs={12}>
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
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Water Usage & Savings
              </Typography>
              <Box sx={{ height: isMobile ? 300 : 400, p: 1 }}>
                <Bar
                  data={getChartData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                        align: 'end' as const,
                        labels: {
                          boxWidth: 12,
                          padding: isMobile ? 16 : 20,
                          font: {
                            size: isMobile ? 12 : 11,
                          },
                        },
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
                        },
                        bodyFont: {
                          size: isMobile ? 13 : 11,
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: theme.palette.divider,
                        },
                        ticks: {
                          color: theme.palette.text.secondary,
                          font: {
                            size: isMobile ? 12 : 10,
                          },
                        },
                      },
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
                        },
                      },
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

export default AnalyticsDashboard; 