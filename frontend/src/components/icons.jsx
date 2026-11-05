/**
 * Catálogo centralizado de íconos de RepairIT basado en Tabler Icons.
 * Proporciona un estilo vectorial geométrico, nítido (trazo 1.5px) y profesional
 * específico para software de gestión técnica y dashboards.
 */
import { forwardRef } from "react";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
  IconBan,
  IconBuilding,
  IconCalendar,
  IconCamera,
  IconCircleCheck,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconClipboardList,
  IconClock,
  IconCreditCard,
  IconCurrencyDollar,
  IconDownload,
  IconEdit,
  IconExternalLink,
  IconEye,
  IconEyeOff,
  IconFileSpreadsheet,
  IconFileText,
  IconHelpCircle,
  IconHistory,
  IconInfoCircle,
  IconKey,
  IconDeviceLaptop,
  IconLayoutDashboard,
  IconLoader2,
  IconLock,
  IconLogout,
  IconMail,
  IconMapPin,
  IconBrandWhatsapp,
  IconMessage,
  IconMinus,
  IconDots,
  IconCircleX,
  IconPackage,
  IconLayoutSidebar,
  IconPencil,
  IconPhone,
  IconPlus,
  IconCirclePlus,
  IconPrinter,
  IconQrcode,
  IconRefresh,
  IconDeviceFloppy,
  IconSearch,
  IconSettings,
  IconShield,
  IconShieldCheck,
  IconShoppingCart,
  IconDeviceMobile,
  IconSparkles,
  IconStethoscope,
  IconBuildingStore,
  IconTrash,
  IconTrendingUp,
  IconUpload,
  IconUser,
  IconUserCheck,
  IconUserCog,
  IconUserPlus,
  IconUsers,
  IconWallet,
  IconTool,
  IconX,
} from "@tabler/icons-react";

/**
 * Adaptador para Tabler Icons:
 * Soporta strokeWidth de shadcn / Tailwind, defaults a 1.5px para máxima nitidez técnica.
 */
const make = (Comp) => {
  const Icon = forwardRef(({ size, strokeWidth, stroke, className, ...props }, ref) => (
    <Comp
      ref={ref}
      size={size}
      stroke={stroke || strokeWidth || 1.5}
      className={className}
      {...props}
    />
  ));
  Icon.displayName = Comp.displayName || "TablerIcon";
  return Icon;
};

// ============================================================================
// Exportaciones de compatibilidad para toda la aplicación
// ============================================================================
export const AlertCircle = make(IconAlertCircle);
export const AlertTriangle = make(IconAlertTriangle);
export const TriangleAlertIcon = make(IconAlertTriangle);
export const ArrowLeft = make(IconArrowLeft);
export const ArrowRight = make(IconArrowRight);
export const ArrowUpRight = make(IconArrowUpRight);
export const Ban = make(IconBan);
export const Building2 = make(IconBuilding);
export const Calendar = make(IconCalendar);
export const Camera = make(IconCamera);
export const CheckCircle = make(IconCircleCheck);
export const CheckCircle2 = make(IconCircleCheck);
export const CircleCheckIcon = make(IconCircleCheck);
export const CheckIcon = make(IconCheck);
export const ChevronDown = make(IconChevronDown);
export const ChevronRightIcon = make(IconChevronRight);
export const ClipboardList = make(IconClipboardList);
export const Clock = make(IconClock);
export const CreditCard = make(IconCreditCard);
export const DollarSign = make(IconCurrencyDollar);
export const Download = make(IconDownload);
export const Edit = make(IconEdit);
export const ExternalLink = make(IconExternalLink);
export const Eye = make(IconEye);
export const EyeOff = make(IconEyeOff);
export const FileSpreadsheet = make(IconFileSpreadsheet);
export const FileText = make(IconFileText);
export const HelpCircle = make(IconHelpCircle);
export const History = make(IconHistory);
export const Info = make(IconInfoCircle);
export const InfoIcon = make(IconInfoCircle);
export const KeyRound = make(IconKey);
export const Laptop = make(IconDeviceLaptop);
export const LayoutDashboard = make(IconLayoutDashboard);
export const Loader2Icon = make(IconLoader2);
export const Lock = make(IconLock);
export const LogOut = make(IconLogout);
export const Mail = make(IconMail);
export const MapPin = make(IconMapPin);
export const MessageCircle = make(IconBrandWhatsapp);
export const MessageSquare = make(IconMessage);
export const Minus = make(IconMinus);
export const MoreHorizontalIcon = make(IconDots);
export const OctagonXIcon = make(IconCircleX);
export const XCircle = make(IconCircleX);
export const Package = make(IconPackage);
export const PackageCheck = make(IconPackage);
export const PanelLeftIcon = make(IconLayoutSidebar);
export const Pencil = make(IconPencil);
export const Phone = make(IconPhone);
export const Plus = make(IconPlus);
export const PlusCircle = make(IconCirclePlus);
export const Printer = make(IconPrinter);
export const QrCode = make(IconQrcode);
export const RefreshCw = make(IconRefresh);
export const Save = make(IconDeviceFloppy);
export const Search = make(IconSearch);
export const Settings = make(IconSettings);
export const Shield = make(IconShield);
export const ShieldCheck = make(IconShieldCheck);
export const ShoppingCart = make(IconShoppingCart);
export const Smartphone = make(IconDeviceMobile);
export const Sparkles = make(IconSparkles);
export const Stethoscope = make(IconStethoscope);
export const Store = make(IconBuildingStore);
export const Trash2 = make(IconTrash);
export const TrendingUp = make(IconTrendingUp);
export const Upload = make(IconUpload);
export const User = make(IconUser);
export const UserCheck = make(IconUserCheck);
export const UserCog = make(IconUserCog);
export const UserPlus = make(IconUserPlus);
export const Users = make(IconUsers);
export const Wallet = make(IconWallet);
export const Wrench = make(IconTool);
export const X = make(IconX);
export const XIcon = make(IconX);
