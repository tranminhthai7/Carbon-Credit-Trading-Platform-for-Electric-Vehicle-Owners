import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

interface CarbonSavingsChartProps {
  data: Array<{
    month: string;
    carbonSaved: number;
  }>;
  height?: number;
}

export const CarbonSavingsChart: React.FC<CarbonSavingsChartProps> = ({ 
  data,
  height = 300 
}) => {
  const months = data.map(item => item.month);
  const values = data.map(item => item.carbonSaved);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Carbon Savings Over Time
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Monthly CO₂ emissions saved (kg)
        </Typography>
        
        <Box sx={{ width: '100%', height }}>
          <LineChart
            xAxis={[{
              scaleType: 'point',
              data: months,
              label: 'Month',
            }]}
            series={[{
              data: values,
              label: 'Carbon Saved (kg)',
              color: '#4caf50',
            }]}
            height={height}
            margin={{ top: 20, right: 20, bottom: 40, left: 60 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
