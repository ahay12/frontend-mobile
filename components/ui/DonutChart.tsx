import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Path, Circle } from 'react-native-svg';

interface DataPoint {
  name: string;
  value: number;
}

interface DonutChartProps {
  data: DataPoint[];
  colors: string[];
  size?: number;
  strokeWidth?: number;
}

export const DonutChart = ({ 
  data, 
  colors, 
  size = 200, 
  strokeWidth = 30 
}: DonutChartProps) => {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  let currentAngle = 0;

  const createPieSlice = (value: number) => {
    const angle = (value / total) * Math.PI * 2;
    
    // Calculate start and end points
    const startX = center + radius * Math.sin(currentAngle);
    const startY = center - radius * Math.cos(currentAngle);
    
    currentAngle += angle;
    
    const endX = center + radius * Math.sin(currentAngle);
    const endY = center - radius * Math.cos(currentAngle);
    
    // Large arc flag
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    
    // Path string
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G>
          {data.map((item, index) => {
            // Handle edge case where value is 100% or 0%
            if (total === 0) return null;
            if (item.value === total) {
               return (
                 <Circle
                   key={index}
                   cx={center}
                   cy={center}
                   r={radius}
                   fill="transparent"
                   stroke={colors[index]}
                   strokeWidth={strokeWidth}
                 />
               );
            }
            
            const pathData = createPieSlice(item.value);
            return (
              <Path
                key={index}
                d={pathData}
                fill="transparent"
                stroke={colors[index]}
                strokeWidth={strokeWidth}
              />
            );
          })}
        </G>
      </Svg>
      
      {/* Legend */}
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors[index] }]} />
            <Text style={styles.legendText}>
              {item.name}: {item.value} ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#52525b',
  },
});
