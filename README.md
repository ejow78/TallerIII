# RepairIT

> **Sistema de Gestión y Trazabilidad para Talleres de Servicio Técnico de Hardware**

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%2015-3FCF8E?logo=supabase)
![License](https://img.shields.io/badge/Licencia-Propietaria-red)

---

## Descripción

**RepairIT** es una plataforma web integral diseñada para la automatización del ciclo de vida de reparaciones de hardware. El sistema permite registrar equipos, gestionar estados de reparación mediante un flujo de trabajo dinámico y mantener un historial técnico trazable.

Facilita la comunicación transparente entre el técnico y el cliente mediante enlaces de seguimiento únicos con presupuesto online, y optimiza la gestión del taller a través de un control de inventario de insumos, caja rápida (POS) y soporte multi-sucursal con aislamiento de datos.

---

## Stack Tecnológico

El proyecto utiliza una arquitectura **Serverless BaaS (Backend-as-a-Service)** moderna para garantizar máxima escalabilidad, rendimiento y seguridad:

* **Frontend:** React 18 + Vite 8 + Tailwind CSS v4 + Shadcn UI / Radix Primitives + Lucide Icons + React Router DOM 6.
* **Backend & Base de Datos:** Supabase (PostgreSQL), Supabase Auth con tokens **JWT**, Row Level Security (RLS) y Procedimientos Almacenados (RPC).
* **Periféricos & Hardware:** Soporte para Lectores de Código de Barras (búfer de `100ms`) e Impresoras Térmicas de Tickets (58mm / 80mm).
* **Localización:** Moneda e idioma configurados para Argentina (`es-AR`).

---

## Características Principales

* ** Caja Rápida (POS):** Cobro multimedio (Efectivo, Transf., Débito, Crédito), calculadora de vuelto con *"Pago Justo"*, atajos por teclas de función (`F2`, `F3`, `F4`, `F8`, `F9`), re-impresión de recibos e impresión térmica directa.
* ** Control de Inventario:** Detección automática por escáner de código de barras, alertas de bajo stock, ajuste rápido (`+1`/`-1`) e importación/exportación masiva vía CSV.
* ** Diagnóstico Técnico y Presupuesto:** Modal interactivo para redactar diagnósticos de laboratorio, cargar presupuestos desglosados (mano de obra y repuestos) y permitir la **Aprobación Online por el Cliente**.
* ** Seguimiento en Tiempo Real:** Enlaces públicos por reparación sin requerir contraseñas, consulta interactiva por código NanoID y simulación `demo-id`.
* ** Gestión Multi-Sucursal y RLS:** Control de sedes para empresas con licencias *Multi-Taller Pro*, gestión de cuentas de personal (`create_venue_account`) y políticas RLS para aislamiento absoluto de datos.
* ** Panel de SuperAdmin:** Supervisión global de inquilinos, asignación de planes y control centralizado de usuarios.

---

##  Instalación y Configuración

### Requisitos Previos
* Node.js v18+ y npm v9+
* Cuenta en Supabase (o proyecto de PostgreSQL habilitado)

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/ejow78/TallerIII.git
   cd TallerIII
   ```

2. **Instalar dependencias del frontend:**
   ```bash
   cd frontend
   npm install
   ```

3. **Configurar variables de entorno (`.env`):**
   Crear un archivo `.env` en la carpeta `frontend/`:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Construir para Producción:**
   ```bash
   npm run build
   ```

---

## Autor

**Ortiz Edgar Javier**.
