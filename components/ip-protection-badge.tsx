import { Shield, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface IPProtectionBadgeProps {
  status: 'protected' | 'pending' | 'draft';
  className?: string;
  showIcon?: boolean;
}

export function IPProtectionBadge({
  status,
  className,
  showIcon = true,
}: IPProtectionBadgeProps) {
  const variants = {
    protected: {
      variant: 'success' as const,
      text: 'Protected IP',
      icon: CheckCircle,
    },
    pending: {
      variant: 'warning' as const,
      text: 'IP Pending',
      icon: Shield,
    },
    draft: {
      variant: 'secondary' as const,
      text: 'Draft',
      icon: Shield,
    },
  };

  const config = variants[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={cn('gap-1', className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.text}
    </Badge>
  );
}
