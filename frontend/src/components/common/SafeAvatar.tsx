import React from 'react';
import { Avatar } from '@mui/material';
import { safeInitial } from '../../utils/stringHelpers';

interface SafeAvatarProps {
  name?: string;
  size?: number;
  className?: string;
}

export const SafeAvatar: React.FC<SafeAvatarProps> = ({ name, size = 32, className }) => {
  return (
    <Avatar className={className} sx={{ width: size, height: size }}>
      {safeInitial(name)}
    </Avatar>
  );
};

export default SafeAvatar;