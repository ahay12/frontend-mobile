import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacityProps,
  ViewStyle,
  TextStyle
} from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = ({ 
  variant = 'default', 
  size = 'default', 
  isLoading = false, 
  children, 
  disabled, 
  style,
  textStyle,
  ...props 
}: ButtonProps) => {
  
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'outline':
        return styles.variantOutline;
      case 'ghost':
        return styles.variantGhost;
      default:
        return styles.variantDefault;
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return styles.sizeSm;
      case 'lg':
        return styles.sizeLg;
      case 'icon':
        return styles.sizeIcon;
      default:
        return styles.sizeDefault;
    }
  };

  const getTextStyles = (): TextStyle => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return styles.textOutlineGhost;
      default:
        return styles.textDefault;
    }
  };

  const getTextSizeStyles = (): TextStyle => {
    switch (size) {
      case 'sm':
        return styles.textSizeSm;
      case 'lg':
        return styles.textSizeLg;
      default:
        return styles.textSizeDefault;
    }
  };

  const isActuallyDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        getVariantStyles(),
        getSizeStyles(),
        isActuallyDisabled && styles.disabled,
        style
      ]}
      disabled={isActuallyDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'default' ? '#ffffff' : '#4f46e5'} 
          style={styles.loader} 
        />
      )}
      <Text style={[
        styles.textBase,
        getTextStyles(),
        getTextSizeStyles(),
        textStyle
      ]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  loader: {
    marginRight: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  
  /* Variants */
  variantDefault: {
    backgroundColor: '#4f46e5', // indigo-600
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  variantOutline: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  variantGhost: {
    backgroundColor: 'transparent',
  },

  /* Sizes */
  sizeDefault: {
    height: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sizeSm: {
    height: 36,
    paddingHorizontal: 12,
  },
  sizeLg: {
    height: 44,
    paddingHorizontal: 32,
  },
  sizeIcon: {
    height: 40,
    width: 40,
    paddingHorizontal: 0,
  },

  /* Text Styles */
  textBase: {
    fontWeight: '500',
    textAlign: 'center',
  },
  textDefault: {
    color: '#ffffff',
  },
  textOutlineGhost: {
    color: '#171717',
  },
  
  /* Text Sizes */
  textSizeDefault: {
    fontSize: 14,
  },
  textSizeSm: {
    fontSize: 14,
  },
  textSizeLg: {
    fontSize: 16,
  },
});
