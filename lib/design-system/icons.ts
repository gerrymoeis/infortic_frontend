/**
 * Icon Mappings
 * Central registry for all icons used in the app
 * Using Lucide React icon library
 */

import {
  // Category Icons
  Trophy,
  GraduationCap,
  Briefcase,
  Building,
  Laptop,
  PartyPopper,
  BookOpen,
  Wrench,
  Zap,
  PenTool,
  
  // UI Icons
  Search,
  X,
  Menu,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  MapPin,
  Users,
  Mail,
  Phone,
  ExternalLink,
  Filter,
  SlidersHorizontal,
  ArrowLeft,
  ArrowRight,
  Home,
  Grid3x3,
  List,
  Check,
  AlertCircle,
  Info,
  XCircle,
  CheckCircle,
  Loader2,
  
  type LucideIcon,
} from 'lucide-react'

// ============================================================================
// CATEGORY ICONS
// ============================================================================

export const categoryIcons: Record<string, LucideIcon> = {
  competition: Trophy,
  scholarship: GraduationCap,
  internship: Briefcase,
  job: Building,
  freelance: Laptop,
  festival: PartyPopper,
  training: BookOpen,
  workshop: Wrench,
  hackathon: Zap,
  tryout: PenTool,
} as const

// ============================================================================
// UI ICONS
// ============================================================================

export const uiIcons = {
  // Navigation
  search: Search,
  close: X,
  menu: Menu,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  home: Home,
  grid: Grid3x3,
  list: List,
  
  // Information
  calendar: Calendar,
  clock: Clock,
  location: MapPin,
  users: Users,
  mail: Mail,
  phone: Phone,
  externalLink: ExternalLink,
  
  // Actions
  filter: Filter,
  settings: SlidersHorizontal,
  
  // Status
  check: Check,
  alert: AlertCircle,
  info: Info,
  error: XCircle,
  success: CheckCircle,
  loading: Loader2,
} as const

// ============================================================================
// ICON SIZES
// ============================================================================

export const iconSizes = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const

// ============================================================================
// HELPER FUNCTION
// ============================================================================

/**
 * Get category icon by code
 * Returns Trophy as fallback if code not found
 */
export function getCategoryIcon(code: string): LucideIcon {
  return categoryIcons[code] || Trophy
}

/**
 * Get icon size value
 */
export function getIconSize(size: keyof typeof iconSizes = 'md'): number {
  return iconSizes[size]
}
