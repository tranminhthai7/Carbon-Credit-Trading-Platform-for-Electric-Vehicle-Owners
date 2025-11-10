import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

interface EarningsChartProps {
  data: Array<{
    month: string;
    earnings: number;
  }>;
  height?: number;
}

export const EarningsChart: React.FC<EarningsChartProps> = ({ 
  data,
  height = 300 
}) => {
  const months = data.map(item => item.month);
  const values = data.map(item => item.earnings);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Monthly Earnings
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Carbon credit sales revenue ($)
        </Typography>
        
        <Box sx={{ width: '100%', height }}>
          <BarChart
            xAxis={[{
              scaleType: 'band',
              data: months,
              label: 'Month',
            }]}
            series={[{
              data: values,
              label: 'Earnings ($)',
              color: '#ff9800',
            }]}
            height={height}
            margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
