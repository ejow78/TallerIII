import { useState, useRef, useEffect, useMemo } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { getArgentinaDateString } from "@/lib/utils";

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const WEEKDAY_NAMES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

export function PosCalendarPicker({
  selectedDate = null,
  onSelectDate,
  onClearDate,
  salesDaysMap = {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  // Fecha de referencia actual en zona de Argentina
  const todayStr = useMemo(() => getArgentinaDateString(new Date()), []);

  // Mes y año mostrados en el calendario interactivo
  const [currentYear, setCurrentYear] = useState(() => {
    if (selectedDate) return parseInt(selectedDate.split("-")[0], 10);
    return new Date().getFullYear();
  });
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (selectedDate) return parseInt(selectedDate.split("-")[1], 10) - 1;
    return new Date().getMonth();
  });

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Matriz de días del mes
  const { leadingBlanks, daysInMonth } = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    // getDay(): 0 = Domingo, 1 = Lunes, etc.
    // Lunes = 0, Domingo = 6
    const startingDayIndex = (firstDay.getDay() + 6) % 7;
    const daysCount = new Date(currentYear, currentMonth + 1, 0).getDate();
    return {
      leadingBlanks: startingDayIndex,
      daysInMonth: daysCount,
    };
  }, [currentYear, currentMonth]);

  // Formatear fecha para el botón cuando hay una seleccionada
  const formattedButtonLabel = useMemo(() => {
    if (!selectedDate) return null;
    const parts = selectedDate.split("-");
    if (parts.length === 3) {
      const day = parts[2];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const monthShort = MONTH_NAMES[monthIndex]?.slice(0, 3) || "";
      return `${day} ${monthShort}`;
    }
    return selectedDate;
  }, [selectedDate]);

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      {/* Botón Disparador del Calendario */}
      <div className="inline-flex items-center">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`h-7 px-2.5 text-[11px] font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 border ${
            selectedDate
              ? "bg-primary text-primary-foreground border-primary font-bold shadow-sm"
              : isOpen
              ? "bg-muted text-foreground border-border"
              : "border-border/80 text-muted-foreground hover:text-foreground bg-background/60"
          }`}
          title="Filtrar ventas por día específico"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{selectedDate ? formattedButtonLabel : "Por Día"}</span>
        </button>

        {selectedDate && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClearDate();
            }}
            className="ml-1 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
            title="Quitar filtro de día"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Popover del Calendario */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 p-3.5 rounded-xl bg-card border border-border/90 shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Cabecera con navegación de Mes y Año */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
              title="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-foreground">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
              title="Mes siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {WEEKDAY_NAMES.map((d) => (
              <span
                key={d}
                className="text-[10px] font-bold text-muted-foreground/70 uppercase"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Grilla de Días */}
          <div className="grid grid-cols-7 gap-1">
            {/* Espacios vacíos antes del día 1 */}
            {Array.from({ length: leadingBlanks }).map((_, i) => (
              <div key={`blank-${i}`} className="h-8 w-8" />
            ))}

            {/* Celdas de días del mes */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const salesInfo = salesDaysMap[dayStr];
              const hasSales = Boolean(salesInfo && salesInfo.count > 0);
              const isSelected = selectedDate === dayStr;
              const isToday = todayStr === dayStr;

              return (
                <button
                  key={dayStr}
                  type="button"
                  onClick={() => {
                    onSelectDate(dayStr);
                  }}
                  title={
                    hasSales
                      ? `${dayNum} de ${MONTH_NAMES[currentMonth]}: ${salesInfo.count} cobro(s) registrado(s) ($${salesInfo.total.toLocaleString("es-AR")})`
                      : `${dayNum} de ${MONTH_NAMES[currentMonth]}: Sin ventas registradas`
                  }
                  className={`h-8 w-8 rounded-lg text-xs flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-primary text-primary-foreground font-black shadow-sm ring-2 ring-primary ring-offset-1 ring-offset-background"
                      : hasSales
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/35 font-bold hover:bg-emerald-500/25 hover:border-emerald-500/50"
                      : "text-muted-foreground/35 hover:bg-muted/40 hover:text-muted-foreground/80 font-normal"
                  } ${isToday && !isSelected ? "ring-1 ring-primary/40 font-semibold" : ""}`}
                >
                  <span>{dayNum}</span>
                  {hasSales && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Leyenda y Acciones Rápidas */}
          <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-2.5 text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Con ventas
              </span>
              <span className="flex items-center gap-1 text-muted-foreground/50">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/30 inline-block" />
                Sin ventas
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  onSelectDate(todayStr);
                  const now = new Date();
                  setCurrentYear(now.getFullYear());
                  setCurrentMonth(now.getMonth());
                }}
                className="px-2 py-0.5 rounded text-[10px] font-semibold text-primary hover:bg-primary/10 cursor-pointer transition-colors"
              >
                Hoy
              </button>
              {selectedDate && (
                <button
                  type="button"
                  onClick={() => {
                    onClearDate();
                    setIsOpen(false);
                  }}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
