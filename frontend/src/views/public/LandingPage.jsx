import { useState, useEffect, useRef } from "react";
import { useLandingContact } from "@/components/landing/useLandingContact";
import { LandingDashboardModal } from "@/components/landing/LandingDashboardModal";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingWorkflowSteps } from "@/components/landing/LandingWorkflowSteps";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingComparison } from "@/components/landing/LandingComparison";
import { LandingPricing } from "@/components/landing/LandingPricing";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { LandingContactSection } from "@/components/landing/LandingContactSection";

export default function LandingPage() {
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const pricingCarouselRef = useRef(null);
  const [activePlanIndex, setActivePlanIndex] = useState(1); // 0: Inicial, 1: Pro, 2: Multi-Sucursal

  const {
    contactName,
    setContactName,
    contactEmail,
    setContactEmail,
    contactMessage,
    setContactMessage,
    acceptTerms,
    setAcceptTerms,
    isSendingContact,
    honeypot,
    setHoneypot,
    handleContactSubmit,
  } = useLandingContact();

  useEffect(() => {
    document.title =
      "RepairIT | Software de Servicio Técnico y Gestión para Talleres";

    const centerProCard = () => {
      if (pricingCarouselRef.current && window.innerWidth < 768) {
        const el = pricingCarouselRef.current;
        const cards = el.querySelectorAll(".pricing-card");
        if (cards[1]) {
          const cardLeft = cards[1].offsetLeft;
          const cardWidth = cards[1].offsetWidth;
          const containerWidth = el.offsetWidth;
          el.scrollLeft = cardLeft - (containerWidth - cardWidth) / 2;
          setActivePlanIndex(1);
        }
      }
      window.scrollTo(0, 0);
    };
    const timer = setTimeout(centerProCard, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const scrollToPlan = (index) => {
    if (pricingCarouselRef.current) {
      const el = pricingCarouselRef.current;
      const cards = el.querySelectorAll(".pricing-card");
      if (cards[index]) {
        const cardLeft = cards[index].offsetLeft;
        const cardWidth = cards[index].offsetWidth;
        const containerWidth = el.offsetWidth;
        el.scrollTo({
          left: cardLeft - (containerWidth - cardWidth) / 2,
          behavior: "smooth",
        });
        setActivePlanIndex(index);
      }
    }
  };

  const handlePricingScroll = () => {
    if (pricingCarouselRef.current && window.innerWidth < 768) {
      const el = pricingCarouselRef.current;
      const cards = el.querySelectorAll(".pricing-card");
      const center = el.scrollLeft + el.clientWidth / 2;
      let closestIdx = 1;
      let minDiff = Infinity;
      cards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const diff = Math.abs(center - cardCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      setActivePlanIndex(closestIdx);
    }
  };

  const registerUrl = window.location.hostname.includes("repairit.cloud")
    ? "https://app.repairit.cloud/register"
    : "/register";

  const trackingUrl = window.location.hostname.includes("repairit.cloud")
    ? "https://tracking.repairit.cloud/consulta"
    : "/consulta";

  return (
    <div className="flex-grow flex flex-col">
      {/* SECCIÓN 1: HERO PRINCIPAL */}
      <LandingHero
        registerUrl={registerUrl}
        trackingUrl={trackingUrl}
        onOpenModal={() => setIsDashboardModalOpen(true)}
      />

      {/* SECCIÓN 2: FLUJO DE TRABAJO EN 3 PASOS */}
      <LandingWorkflowSteps />

      {/* SECCIÓN 3: BENTO GRID Y FUNCIONALIDADES */}
      <LandingFeatures />

      {/* SECCIÓN 4: COMPARATIVA REAL */}
      <LandingComparison registerUrl={registerUrl} />

      {/* SECCIÓN 5: PLANES DE PRECIOS */}
      <LandingPricing
        registerUrl={registerUrl}
        pricingCarouselRef={pricingCarouselRef}
        handlePricingScroll={handlePricingScroll}
        activePlanIndex={activePlanIndex}
        scrollToPlan={scrollToPlan}
      />

      {/* SECCIÓN 6: PREGUNTAS FRECUENTES (FAQ) */}
      <LandingFaq />

      {/* SECCIÓN 7: CONTACTO DIRECTO */}
      <LandingContactSection
        contactName={contactName}
        setContactName={setContactName}
        contactEmail={contactEmail}
        setContactEmail={setContactEmail}
        contactMessage={contactMessage}
        setContactMessage={setContactMessage}
        acceptTerms={acceptTerms}
        setAcceptTerms={setAcceptTerms}
        isSendingContact={isSendingContact}
        honeypot={honeypot}
        setHoneypot={setHoneypot}
        onSubmit={handleContactSubmit}
      />

      {/* MODAL: ZOOM DEL PANEL DE CONTROL */}
      <LandingDashboardModal
        isOpen={isDashboardModalOpen}
        onClose={() => setIsDashboardModalOpen(false)}
      />
    </div>
  );
}
