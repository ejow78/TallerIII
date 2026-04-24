import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ClipboardCheck, Package, MessageSquare } from 'lucide-react'

export function Features() {
    return (
        <section id="caracteristicas" className="bg-zinc-50 min-h-screen flex flex-col justify-center py-16 dark:bg-transparent relative z-10 w-full">
            <div className="w-full mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-bold tracking-tight lg:text-5xl text-foreground">
                        Todo lo que tu taller necesita
                    </h2>
                    <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                        Herramientas diseñadas específicamente para agilizar la reparación de hardware y mejorar la experiencia de tus clientes.
                    </p>
                </div>
                <div
                    className="mx-auto mt-8 grid w-full max-w-sm grid-cols-1 gap-6 *:text-center md:max-w-full md:grid-cols-3 md:mt-16">
                    <Card className="group shadow-black-950/5 bg-surface/40 border-border/50 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <ClipboardCheck className="size-6 text-brand" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-semibold text-lg text-foreground">Trazabilidad Total</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">Hacé un seguimiento detallado del estado de cada equipo, desde su ingreso hasta la entrega final al cliente.</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-black-950/5 bg-surface/40 border-border/50 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Package className="size-6 text-brand" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-semibold text-lg text-foreground">Control de Inventario</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">Gestiona tus repuestos y componentes de forma eficiente para que nunca te falte lo esencial en una reparación.</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-black-950/5 bg-surface/40 border-border/50 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <MessageSquare className="size-6 text-brand" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-semibold text-lg text-foreground">Comunicación Profesional</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">Mantené a tus clientes informados con reportes claros y presupuestos detallados directamente desde la plataforma.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}

const CardDecorator = ({
    children
}) => (
    <div
        aria-hidden
        className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
        <div
            className="absolute inset-0 [--border:black] dark:[--border:white] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />
        <div
            className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l">{children}</div>
    </div>
)