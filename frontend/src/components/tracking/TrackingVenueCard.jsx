import { Card } from "@/components/ui/card";
import { Store, MapPin, Clock, Phone, ExternalLink } from "lucide-react";

export function TrackingVenueCard({ venueName, parsedVenue, venuePhone }) {
  return (
    <Card className="order-3 md:order-4 md:col-span-1 bg-card/50 backdrop-blur-md border-border/70 p-5 rounded-2xl shadow-sm space-y-3.5 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2.5 border-b border-border/50 pb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Taller Responsable
            </span>
            <h3 className="font-outfit text-sm font-bold text-foreground leading-tight">
              {venueName}
            </h3>
          </div>
        </div>

        <div className="space-y-3 pt-2 text-xs">
          {parsedVenue?.address && (
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-foreground/90 font-medium leading-snug">
                  {parsedVenue.address}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    parsedVenue.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-semibold mt-1 cursor-pointer"
                >
                  <span>Ver en Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {parsedVenue?.hours && (
            <div className="flex items-start gap-2.5 pt-2 border-t border-border/30">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-foreground/80 font-medium leading-relaxed flex-1">
                {parsedVenue.hours}
              </p>
            </div>
          )}

          {venuePhone && (
            <div className="flex items-center gap-2.5 pt-2 border-t border-border/30">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <a
                href={`tel:${venuePhone.replace(/\s+/g, "")}`}
                className="text-foreground/90 font-semibold hover:text-primary transition-colors text-xs"
              >
                {venuePhone}
              </a>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
