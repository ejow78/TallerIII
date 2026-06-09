import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  return (
    <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-16 space-y-8 animate-fade-in">
      <div className="space-y-3">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold uppercase tracking-wider">
          &larr; Volver al Inicio
        </Link>
        <h1 className="font-outfit text-4xl font-black text-foreground tracking-tight leading-none pt-2">
          Términos de Servicio
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Última actualización: 9 de Junio de 2026
        </p>
      </div>

      <Separator />

      <article className="prose prose-slate dark:prose-invert text-sm text-muted-foreground leading-relaxed space-y-6">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            Lorem Ipsum Dolor
          </h2>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ut enim ad minim veniam, quis nostrud.</li>
            <li>Ullamco laboris nisi ut aliquip ex ea commodo.</li>
            <li>Duis aute irure dolor in reprehenderit in voluptate.</li>
            <li>Velit esse cillum dolore eu fugiat nulla pariatur.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            Consectetur Adipiscing
          </h2>
          <p>
            Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec porta diam eu massa. Quisque diam lorem, interdum vitae, dapibus ac, scelerisque vitae, pede.
          </p>
        </div>
      </article>
    </div>
  );
}
