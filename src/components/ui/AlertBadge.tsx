interface AlertBadgeProps {
  status: string;
  type?: 'default' | 'success' | 'warning' | 'error';
}

export default function AlertBadge({ status, type = 'default' }: AlertBadgeProps) {
  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case 'service':
      case 'actif':
      case 'fermée':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
      case 'en_cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'réparation':
      case 'ouverte':
        return 'bg-red-100 text-red-800';
      case 'attente':
      case 'inactif':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeClasses = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const classes = type === 'default' 
    ? getStatusClasses(status)
    : getTypeClasses(type);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {status}
    </span>
  );
}
