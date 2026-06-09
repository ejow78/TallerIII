# PROPUESTA DE PROYECTO FINAL - TALLER III
## Sistema de Gestión y Trazabilidad para Servicios Técnicos: "RepairIT"

**Alumno:** Edgar Javier Ortiz  
**Carrera:** Tecnicatura Superior en Desarrollo de Software  
**Institución:** IES La Cocha  
**Año:** 2026  

---

## 1. ESPECIFICACIONES DEL SISTEMA (ALCANCE)

### 1.1. Descripción General
**RepairIT** es una plataforma web SaaS desacoplada, diseñada específicamente para optimizar la gestión operativa, el control de inventario y la comunicación con el cliente dentro de talleres de reparación tecnológica. El sistema automatiza el flujo de trabajo desde el ingreso del dispositivo hasta su entrega final, ofreciendo un canal público de consulta en tiempo real para los usuarios del servicio.

### 1.2. Objetivos del Proyecto
* **Objetivo General:** Desarrollar e implementar una aplicación web reactiva y escalable que centralice la administración de órdenes de reparación y audite el stock de insumos técnicos, mejorando la transparencia hacia el cliente final mediante identificadores únicos de seguimiento.
* **Objetivos Específicos:**
  * Segmentar la plataforma mediante subdominios funcionales independientes para aislar el panel administrativo de la consulta pública.
  * Implementar un algoritmo de generación de identificadores únicos no secuenciales (NanoID) para prescindir del uso de contraseñas por parte del cliente.
  * Automatizar el descuento dinámico de stock de componentes asociados a cada reparación realizada.
  * Proveer módulos de exportación de datos en formatos PDF y Excel del lado del cliente.

### 1.3. Alcance del Proyecto (MVP)
* **Dentro del Alcance:**
  * Panel de autenticación (Login) para el personal técnico y administradores mediante tokens JWT.
  * Módulo de gestión de órdenes de servicio (Creación, asignación de técnico, diagnóstico, presupuesto, estados y cierre).
  * Módulo de inventario y control de stock de repuestos con alertas de bajo suministro.
  * Interfaz de consulta pública para clientes basada en parámetros de URL dinámicos.
  * Motor de exportación de presupuestos a PDF y auditorías de stock a planillas Excel.
* **Fuera del Alcance:**
  * Pasarela de pagos online dentro de la plataforma (las transacciones monetarias se gestionan de forma física o externa al sistema).
  * Aplicación móvil nativa en esta primera fase del ciclo de vida del software.

### 1.4. Requisitos Funcionales (RF)
* **RF01 - Autenticación de Usuarios Internos:** El sistema debe permitir el inicio de sesión exclusivo a técnicos y administradores registrados mediante credenciales encriptadas.
* **RF02 - Registro de Órdenes de Servicio:** El sistema debe permitir la carga de un nuevo equipo ingresado, asociando los datos del cliente, marca, modelo, fallas reportadas y un técnico responsable.
* **RF03 - Generación de Enlace Único:** Al registrar un equipo, el sistema debe generar automáticamente un código NanoID seguro y asociarlo a una URL de consulta pública.
* **RF04 - Gestión de Estados de Reparación:** El técnico debe poder actualizar el estado del equipo siguiendo un flujo lógico (*Ingresado*, *En Diagnóstico*, *Presupuestado*, *En Reparación*, *Listo para Entregar*, *Entregado*).
* **RF05 - Carga de Presupuestos:** El sistema debe permitir asignar un costo de mano de obra y desglosar los componentes utilizados en la reparación para conformar el presupuesto total.
* **RF06 - Control de Inventario Automatizado:** Al finalizar una orden de servicio o confirmar el uso de un repuesto, el sistema debe descontar automáticamente las unidades correspondientes de la colección de stock en la base de datos.
* **RF07 - Consulta de Estado Pública:** El cliente debe poder visualizar la barra de progreso de su equipo ingresando directamente al enlace único generado, sin requerir la creación de una cuenta o inicio de sesión tradicional.
* **RF08 - Exportación Documental:** El administrador debe poder descargar presupuestos estructurados en formato PDF y reportes analíticos de stock de insumos en archivos Excel (.xlsx).

### 1.5. Requisitos No Funcionales (RNF)
* **RNF01 - Rendimiento:** El tiempo de respuesta de las consultas de estado en la interfaz pública no debe superar los 200 milisegundos, optimizado mediante ejecución perimetral.
* **RNF02 - Seguridad (Persistencia):** Las contraseñas de los usuarios internos deben almacenarse utilizando algoritmos de hash seguros (bcrypt) en el servidor.
* **RNF03 - Seguridad (API):** Todos los endpoints privados de la API RESTful deben estar protegidos mediante middlewares que validen la vigencia y firma de tokens JWT.
* **RNF04 - Disponibilidad:** La infraestructura de alojamiento debe garantizar una disponibilidad del servicio del 99.9% utilizando redes de distribución global.
* **RNF05 - Integridad de Datos:** La base de datos debe validar que el stock de insumos técnicos nunca adopte valores cuantitativos negativos.
* **RNF06 - Interfaz Adaptativa (Responsive):** La interfaz visual debe ser 100% responsive, adaptándose de manera fluida a dispositivos móviles, tablets y computadoras de escritorio.
* **RNF07 - Arquitectura Desacoplada (Subdominios):** El sistema debe segmentar sus entornos de producción mediante subdominios independientes: `dashboard.repairit.cloud` para la administración del taller y `seguimiento.repairit.cloud` para el uso exclusivo del cliente.

---

## 2. ARQUITECTURA Y TECNOLOGÍAS A UTILIZAR

Para el desarrollo del ecosistema web de **RepairIT**, se ha seleccionado un stack tecnológico moderno, robusto y completamente desacoplado (basado en el patrón Cliente-Servidor), optimizando tanto el rendimiento en producción como la agilidad en solitario del desarrollador:

### 2.1. Capa de Presentación (Frontend)
* **JavaScript / React.js (Vite):** Biblioteca orientada a componentes para el desarrollo de la interfaz de usuario como una *Single Page Application* (SPA). Facilita el renderizado dinámico, la reutilización de código y evita la recarga completa del navegador, brindando una experiencia de usuario fluida e instantánea.
* **Tailwind CSS (v4):** Framework de diseño basado en clases utilitarias de última generación. Permite construir una interfaz adaptativa, limpia y minimalista de forma ágil, reduciendo drásticamente el peso de las hojas de estilo CSS globales.
* **shadcn/ui:** Colección de componentes de interfaz reutilizables, accesibles y altamente estéticos que se copian de manera nativa en el proyecto. Utilizado para maquetar modales de confirmación avanzadas, tablas de datos y layouts del Dashboard operativo.
* **React Router:** Motor de enrutamiento dinámico encargado de gestionar la navegación interna del lado del cliente. Permite capturar los parámetros variables de las URLs (como el código de seguimiento) y procesar las vistas específicas sin interferencia del servidor.

### 2.2. Capa de Lógica de Negocio y Servidor (Backend)
* **Node.js y Express.js:** Entorno de ejecución en tiempo de reloj de JavaScript y framework minimalista para la construcción de la API RESTful. Express se encarga de la exposición de endpoints lógicos, el control de rutas del servidor, la gestión de middlewares de seguridad (validación de sesiones JWT) y el procesamiento de la lógica de negocio.
* **NanoID:** Librería de generación de identificadores únicos por software. Desarrolla strings alfanuméricos compactos, seguros y no secuenciales, ideales para generar los tokens de consulta pública de los clientes sin exponer los IDs internos secuenciales de la base de datos.
* **jsPDF y SheetJS:** Módulos especializados para la exportación de información del lado del cliente (*Client-side data exporting*). **jsPDF** procesa presupuestos estructurados y órdenes de servicio en formato PDF cerrado, mientras que **SheetJS** convierte las colecciones de datos del inventario a matrices nativas de Excel (.xlsx), ahorrando recursos de cómputo en el servidor.

### 2.3. Capa de Persistencia (Base de Datos)
* **MongoDB:** Base de datos No Relacional (NoSQL) orientada a documentos JSON/BSON. Su esquema flexible y dinámico permite almacenar el histórico de las reparaciones técnicas con campos variables (debido a las diferencias físicas entre dispositivos) sin la necesidad de ejecutar migraciones complejas de datos.

### 2.4. Capa de Red e Infraestructura
* **Cloudflare:** Plataforma de red global utilizada para la delegación DNS, gestión de certificados SSL automáticos y seguridad perimetral. Permite configurar y aislar las reglas de enrutamiento para los subdominios operativos (`dashboard.` y `seguimiento.`).
* **Cloudflare Workers:** Infraestructura *serverless* orientada a la computación en el borde (*Edge Computing*). Hospeda y ejecuta el código del backend en los nodos perimetrales más cercanos a la ubicación geográfica del usuario, disminuyendo drásticamente la latencia de las conexiones HTTP y asegurando costos operativos iniciales nulos ($0 USD).

---

## 3. METODOLOGÍA DE DESARROLLO

Para la gestión y ejecución del proyecto **RepairIT**, se ha seleccionado una **metodología híbrida adaptada para desarrollo individual**. Este enfoque estratégico combina el rigor predictivo de los modelos tradicionales para la fase de planificación, con la flexibilidad y velocidad de los marcos ágiles para la fase de construcción del software. 

Dado que el proyecto es llevado a cabo por un único desarrollador, esta hibridación optimiza los tiempos de entrega al eliminar la sobrecarga administrativa de las ceremonias grupales (como en Scrum puro), sin perder el control de la calidad ni la trazabilidad del proceso.

La metodología se estructura en dos componentes operativos fundamentales:

### 3.1. Planificación Predictiva (Roadmap Estratégico)
Se establece un *Roadmap* lineal dividido en seis fases macro secuenciales. Bajo un enfoque *Frontend-First*, se prioriza la construcción de la interfaz visual de forma local, postergando la configuración de la infraestructura de red perimetral para las etapas finales de integración y despliegue:

* **Fase I: Desarrollo de Interfaces (Frontend-First):** Maquetación y diseño de la aplicación web utilizando React y componentes de shadcn/ui. Se implementa el enrutamiento dinámico para simular la navegación y se usan datos simulados (*mock data*) para validar de forma local las interfaces del Dashboard y el Seguimiento.
* **Fase II: Diseño y Modelado de Datos:** Definición de esquemas no relacionales en la base de datos (MongoDB) y estructuración de las colecciones necesarias para soportar la información y los estados que ya fueron planteados en la interfaz visual.
* **Fase III: Lógica de Negocio y Servidor (Backend):** Construcción local de la API RESTful bajo Node.js y Express. Desarrollo de los endpoints, controladores de rutas, lógica de autenticación y algoritmos esenciales (como la generación de tokens NanoID).
* **Fase IV: Infraestructura y Entorno de Red:** Configuración avanzada de la capa perimetral en la nube (Cloudflare), creación de reglas de enrutamiento para los subdominios (`dashboard.` y `seguimiento.`), asignación de certificados SSL y preparación de los entornos para producción.
* **Fase V: Integración y Consumo de la API:** Conexión de ambas capas mediante peticiones asincrónicas HTTP. Se reemplazan los datos simulados de la Fase I por el consumo real de los servicios del backend a través de la infraestructura de red configurada.
* **Fase VI: Extensibilidad y Módulos de Reportes:** Implementación de las herramientas de auditoría para el taller, desarrollando los componentes de exportación de archivos dinámicos (documentación en PDF con jsPDF y planillas de stock en Excel con SheetJS).

### 3.2. Ejecución Ágil (Marco Kanban)
Una vez delimitado el Roadmap, la fase de codificación diaria se gestiona bajo un enfoque puramente ágil e iterativo para absorber cambios técnicos de manera fluida:

* **Gestión Visual del Flujo (Kanban):** Se utiliza un tablero de tareas continuo (subdividido en *Backlog, To-Do, In Progress, Testing y Done*) en el repositorio local para controlar el inventario de funciones. Esto permite concentrar el esfuerzo en un único requerimiento por ciclo, optimizando la tasa de entrega y evitando la dispersión cognitiva.
* **Desarrollo Incremental y Refactorización (XP):** Se prioriza la entrega de un Producto Mínimo Viable (MVP) funcional en cada fase. El software se somete a ciclos constantes de refactorización para mantener la cohesión del código, asegurar el desacoplamiento de componentes en React y garantizar un despliegue limpio y escalable en la infraestructura del servidor.

---

## 4. VIABILIDAD DEL PROYECTO

### 4.1. Viabilidad Técnica
La factibilidad técnica de **RepairIT** está plenamente respaldada por la madurez, documentación y compatibilidad del ecosistema seleccionado. El uso de React en su versión moderna junto con Express permite un desacoplamiento perfecto entre la interfaz de usuario y la lógica del servidor, facilitando el mantenimiento independiente de cada capa. 

Asimismo, la persistencia en MongoDB ofrece la flexibilidad necesaria para modificar los esquemas de los históricos de reparación sin necesidad de realizar migraciones complejas de bases de datos relacionales. La infraestructura perimetral provista por Cloudflare mitiga los riesgos de caídas del servicio y simplifica la administración de los subdominios funcionales de forma centralizada.

### 4.2. Viabilidad Económica y Operativa
El modelo de costos operativos para la puesta en marcha del proyecto se ha diseñado bajo una premisa de optimización de recursos, reduciendo la inversión inicial a cero:

* **Capa de Infraestructura y Servidor:** El despliegue inicial de la plataforma se estructurará sobre una arquitectura serverless aprovechando la capa gratuita de Cloudflare Workers. Esto permite anular los costos operativos de hosting durante las fases de desarrollo, pruebas y validación académica, garantizando un presupuesto de $0 USD para la puesta en marcha del MVP. El modelo contempla una escalabilidad elástica: en caso de una adopción comercial masiva que supere las 100.000 peticiones diarias, el sistema migrará al plan premium de Workers ($5 USD/mes), manteniendo la viabilidad económica.
* **Persistencia de Datos:** Se utiliza el nivel gratuito de clústeres en la nube (MongoDB Atlas), el cual proporciona hasta 512 MB de almacenamiento. Esta capacidad es suficiente para la persistencia de miles de tickets de servicio técnico activos y registros de inventario sin generar facturación.

---

## 5. CRONOGRAMA DE EJECUCIÓN (PLAN DE TRABAJO)

Para asegurar la entrega oportuna del proyecto final y mantener una tasa de avance constante, las seis fases definidas en el Roadmap estratégico se distribuyen temporalmente en bloques secuenciales a lo largo de un período estimado de 9 semanas:

* **Semanas 1 - 3 (Fase I - Frontend-First):** Diseño y desarrollo de componentes visuales en React (Dashboard, Login y Seguimiento) utilizando las clases utilitarias de Tailwind CSS y validación de flujos de navegación con datos locales simulados (*mock data*).
* **Semana 4 (Fase II - Modelado de Datos):** Configuración del entorno de persistencia en MongoDB, diseño de los esquemas de colecciones y establecimiento de las relaciones lógicas entre clientes, equipos y componentes técnicos.
* **Semanas 5 - 6 (Fase III - Lógica de Servidor):** Construcción del servidor local con Express, codificación de controladores, ruteadores de la API RESTful y middlewares de autenticación por tokens JWT.
* **Semana 7 (Fase IV - Infraestructura de Red):** Configuración de la capa perimetral en Cloudflare, aprovisionamiento de certificados SSL automatizados y declaración de las reglas de ruteo para el aislamiento de los subdominios público y privado.
* **Semana 8 (Fase V - Integración):** Enlace de las capas cliente-servidor mediante peticiones asincrónicas HTTP (`fetch`), depuración de respuestas JSON y validación del comportamiento del sistema de extremo a extremo (*End-to-End*).
* **Semana 9 (Fase VI - Extensibilidad):** Programación de los módulos de salida y exportación de archivos dinámicos, generación automatizada de presupuestos impresos con jsPDF y hojas de cálculo de inventario con SheetJS.

---

## 6. RESULTADOS ESPERADOS Y CONCLUSIONES

Con la implementación de **RepairIT**, se proyecta alcanzar un sistema integral de gestión de servicios técnicos que resuelva las problemáticas de comunicación y desorganización administrativa comunes en los talleres de reparación tecnológicos. 

### Indicadores de Éxito del Software:
1. **Trazabilidad Absoluta:** Centralización del 100% de los históricos de los equipos ingresados, accesibles mediante un identificador único alfanumérico seguro (NanoID).
2. **Optimización del Rendimiento:** Reducción de los tiempos de carga en la consulta de estados de reparación gracias a la ejecución de código en servidores perimetrales de baja latencia (Edge Computing).
3. **Reducción de Costos Operativos:** Demostración práctica de la factibilidad de montar una arquitectura de software de nivel empresarial y alta disponibilidad con un costo de mantenimiento mensual nulo ($0 USD) en su etapa de lanzamiento.