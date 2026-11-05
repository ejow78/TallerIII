/**
 * Set de íconos propio de RepairIT.
 * Basado en Phosphor (peso "duotone") para tener un estilo coherente y distinto
 * al set por defecto de shadcn. Mantiene los mismos nombres que usaba la app
 * para no tocar la lógica de cada vista.
 */
import { forwardRef } from "react";
import {
  WarningCircle,
  Warning,
  ArrowLeft as PArrowLeft,
  ArrowRight as PArrowRight,
  ArrowUpRight as PArrowUpRight,
  Prohibit,
  Buildings,
  CalendarBlank,
  Camera as PCamera,
  CheckCircle as PCheckCircle,
  Check as PCheck,
  CaretDown,
  CaretRight,
  ClipboardText,
  Clock as PClock,
  CreditCard as PCreditCard,
  CurrencyDollar,
  DownloadSimple,
  PencilSimpleLine,
  ArrowSquareOut,
  Eye as PEye,
  EyeSlash,
  FileXls,
  FileText as PFileText,
  Question,
  ClockCounterClockwise,
  Info as PInfo,
  Key,
  Laptop as PLaptop,
  SquaresFour,
  SpinnerGap,
  Lock as PLock,
  SignOut,
  EnvelopeSimple,
  MapPin as PMapPin,
  WhatsappLogo,
  ChatsCircle,
  Minus as PMinus,
  DotsThree,
  XCircle as PXCircle,
  Package as PPackage,
  SidebarSimple,
  PencilSimple,
  Phone as PPhone,
  Plus as PPlus,
  PlusCircle as PPlusCircle,
  Printer as PPrinter,
  QrCode as PQrCode,
  ArrowsClockwise,
  FloppyDisk,
  MagnifyingGlass,
  GearSix,
  Shield as PShield,
  ShieldCheck as PShieldCheck,
  ShoppingCartSimple,
  DeviceMobile,
  Sparkle,
  Stethoscope as PStethoscope,
  Storefront,
  Trash,
  TrendUp,
  UploadSimple,
  User as PUser,
  UserCheck as PUserCheck,
  UserGear,
  UserPlus as PUserPlus,
  Users as PUsers,
  Wallet as PWallet,
  Wrench as PWrench,
  X as PX,
} from "@phosphor-icons/react";

const make = (Comp, defaultWeight = "duotone") => {
  const Icon = forwardRef(({ strokeWidth: _sw, ...props }, ref) => (
    <Comp ref={ref} weight={defaultWeight} {...props} />
  ));
  Icon.displayName = Comp.displayName || "Icon";
  return Icon;
};

// Íconos de interfaz (chevrons, cerrar, check): trazo simple, sin relleno
const ui = (Comp) => make(Comp, "bold");

export const AlertCircle = make(WarningCircle);
export const AlertTriangle = make(Warning);
export const TriangleAlertIcon = make(Warning);
export const ArrowLeft = ui(PArrowLeft);
export const ArrowRight = ui(PArrowRight);
export const ArrowUpRight = ui(PArrowUpRight);
export const Ban = make(Prohibit);
export const Building2 = make(Buildings);
export const Calendar = make(CalendarBlank);
export const Camera = make(PCamera);
export const CheckCircle = make(PCheckCircle);
export const CheckCircle2 = make(PCheckCircle);
export const CircleCheckIcon = make(PCheckCircle);
export const CheckIcon = ui(PCheck);
export const ChevronDown = ui(CaretDown);
export const ChevronRightIcon = ui(CaretRight);
export const ClipboardList = make(ClipboardText);
export const Clock = make(PClock);
export const CreditCard = make(PCreditCard);
export const DollarSign = make(CurrencyDollar);
export const Download = make(DownloadSimple);
export const Edit = make(PencilSimpleLine);
export const ExternalLink = ui(ArrowSquareOut);
export const Eye = make(PEye);
export const EyeOff = make(EyeSlash);
export const FileSpreadsheet = make(FileXls);
export const FileText = make(PFileText);
export const HelpCircle = make(Question);
export const History = make(ClockCounterClockwise);
export const Info = make(PInfo);
export const InfoIcon = make(PInfo);
export const KeyRound = make(Key);
export const Laptop = make(PLaptop);
export const LayoutDashboard = make(SquaresFour);
export const Loader2Icon = ui(SpinnerGap);
export const Lock = make(PLock);
export const LogOut = make(SignOut);
export const Mail = make(EnvelopeSimple);
export const MapPin = make(PMapPin);
export const MessageCircle = make(WhatsappLogo);
export const MessageSquare = make(ChatsCircle);
export const Minus = ui(PMinus);
export const MoreHorizontalIcon = ui(DotsThree);
export const OctagonXIcon = make(PXCircle);
export const XCircle = make(PXCircle);
export const Package = make(PPackage);
export const PackageCheck = make(PPackage);
export const PanelLeftIcon = make(SidebarSimple);
export const Pencil = make(PencilSimple);
export const Phone = make(PPhone);
export const Plus = ui(PPlus);
export const PlusCircle = make(PPlusCircle);
export const Printer = make(PPrinter);
export const QrCode = make(PQrCode);
export const RefreshCw = ui(ArrowsClockwise);
export const Save = make(FloppyDisk);
export const Search = ui(MagnifyingGlass);
export const Settings = make(GearSix);
export const Shield = make(PShield);
export const ShieldCheck = make(PShieldCheck);
export const ShoppingCart = make(ShoppingCartSimple);
export const Smartphone = make(DeviceMobile);
export const Sparkles = make(Sparkle);
export const Stethoscope = make(PStethoscope);
export const Store = make(Storefront);
export const Trash2 = make(Trash);
export const TrendingUp = ui(TrendUp);
export const Upload = make(UploadSimple);
export const User = make(PUser);
export const UserCheck = make(PUserCheck);
export const UserCog = make(UserGear);
export const UserPlus = make(PUserPlus);
export const Users = make(PUsers);
export const Wallet = make(PWallet);
export const Wrench = make(PWrench);
export const X = ui(PX);
export const XIcon = ui(PX);
