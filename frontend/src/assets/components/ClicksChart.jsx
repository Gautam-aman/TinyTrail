import React from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function ClicksChart({ data, theme }) {
    if (!data || data.length === 0) {
        return <p style={{color: theme.FOREGROUND}}>No click data available for this range.</p>;
    }

    const chartColor = theme.ACCENT;
    const textColor = theme.FOREGROUND;

    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div style={{ 
            backgroundColor: theme.CARD_BG, 
            border: `1px solid ${theme.ACCENT}`, 
            padding: '10px', 
            borderRadius: '4px',
            color: textColor 
          }}>
            <p className="label" style={{ fontWeight: 'bold', margin: 0 }}>{`Date: ${label}`}</p>
            <p className="intro" style={{ margin: 0, color: chartColor }}>{`Clicks: ${payload[0].value.toLocaleString()}`}</p>
          </div>
        );
      }
      return null;
    };


    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 20, left: 10, bottom: 20 }} 
                >
                    <CartesianGrid stroke={theme.BORDER} strokeDasharray="3 3" />
                    
                    <XAxis 
                        dataKey="date" 
                        angle={-20} 
                        textAnchor="end" 
                        height={40}
                        stroke={textColor}
                        tick={{ fill: '#aaaaaa', fontSize: 12 }}
                        axisLine={{ stroke: theme.BORDER }}
                    />
                    
                    <YAxis 
                        dataKey="clicks" 
                        allowDecimals={false}
                        stroke={textColor}
                        tick={{ fill: '#aaaaaa', fontSize: 12 }}
                        axisLine={{ stroke: theme.BORDER }}
                    />
                    
                    <Tooltip content={<CustomTooltip />} />
                    
                   
                    <Line 
                        type="monotone" 
                        dataKey="clicks" 
                        stroke={chartColor} 
                        strokeWidth={3}
                        fill="url(#colorClicks)"
                        dot={{ r: 4, fill: chartColor, stroke: theme.CARD_BG, strokeWidth: 2 }} 
                        activeDot={{ r: 8, fill: chartColor, stroke: textColor, strokeWidth: 2 }}
                    />
                    
                   
                    <defs>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartColor} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                        </linearGradient>
                    </defs>

                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default ClicksChart;