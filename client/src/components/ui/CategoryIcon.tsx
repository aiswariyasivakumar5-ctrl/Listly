import React from 'react';
import {
  Briefcase,
  Home,
  ShoppingBag,
  Car,
  Wrench,
  Users,
  Zap,
  FileText,
  Tag,
  Laptop,
  Heart,
  Calendar,
  Layers,
  MessageSquare,
} from 'lucide-react';

interface CategoryIconProps {
  name?: string | null;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  const iconName = (name || '').toLowerCase();

  if (iconName.includes('job') || iconName.includes('briefcase')) return <Briefcase className={className} />;
  if (iconName.includes('hous') || iconName.includes('home') || iconName.includes('apart'))
    return <Home className={className} />;
  if (iconName.includes('sale') || iconName.includes('shop') || iconName.includes('bag'))
    return <ShoppingBag className={className} />;
  if (iconName.includes('veh') || iconName.includes('car') || iconName.includes('truck'))
    return <Car className={className} />;
  if (iconName.includes('serv') || iconName.includes('wrench')) return <Wrench className={className} />;
  if (iconName.includes('comm') || iconName.includes('user') || iconName.includes('group'))
    return <Users className={className} />;
  if (iconName.includes('gig') || iconName.includes('zap')) return <Zap className={className} />;
  if (iconName.includes('resum') || iconName.includes('file')) return <FileText className={className} />;
  if (iconName.includes('tech') || iconName.includes('comp')) return <Laptop className={className} />;
  if (iconName.includes('forum') || iconName.includes('discuss') || iconName.includes('board') || iconName.includes('message'))
    return <MessageSquare className={className} />;
  if (iconName.includes('event')) return <Calendar className={className} />;
  if (iconName.includes('fav')) return <Heart className={className} />;

  return <Layers className={className} />;
};
