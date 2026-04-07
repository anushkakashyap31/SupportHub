/**
 * Urgency Badge Component
 * Displays urgency level with appropriate styling
 */

import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import Badge from '../common/Badge';
import { formatUrgency } from '../../utils/helpers';

const UrgencyBadge = ({ urgency, showIcon = true, size = 'md' }) => {
  const icons = {
    critical: AlertCircle,
    high: AlertTriangle,
    normal: Info,
    low: CheckCircle,
  };
  
  const Icon = icons[urgency] || Info;
  
  return (
    <Badge urgency={urgency} size={size}>
      <div className="flex items-center gap-1.5">
        {showIcon && <Icon className="w-3.5 h-3.5" />}
        <span>{formatUrgency(urgency)}</span>
      </div>
    </Badge>
  );
};

export default UrgencyBadge;