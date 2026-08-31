import { supabase } from "./supabaseClient";

// Generador de código de seguimiento alfanumérico de alta entropía (8 caracteres anti-fuerza bruta)
const generateTrackingCode = () => {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  return "RT-" + Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

// Helper para obtener el usuario de sessionStorage
const getLocalUser = () => {
  return JSON.parse(sessionStorage.getItem("repairit_user") || "{}");
};

const mapClient = (client) => {
  if (!client) return null;
  if (typeof client === "string") return { name: "Cliente", _id: client };
  const c = Array.isArray(client) ? client[0] : client;
  if (!c) return null;
  return {
    ...c,
    _id: c.id,
  };
};

const mapVenue = (venue) => {
  if (!venue) return null;
  if (typeof venue === "string") return { name: "Taller Central", _id: venue };
  const v = Array.isArray(venue) ? venue[0] : venue;
  if (!v) return null;
  return {
    ...v,
    _id: v.id,
  };
};

const mapOrder = (order) => {
  if (!order) return null;
  return {
    ...order,
    _id: order.id,
    venueId: mapVenue(order.venueId || order.venue_id),
    clientId: mapClient(order.clientId || order.client_id),
    trackingCode: order.tracking_code,
    deviceType: order.device_type,
    deviceModel: order.device_model,
    diagnosis: order.diagnosis || "",
    budget: order.budget || null,
  };
};

export const api = {
  // Autenticación & Perfil
  auth: {
    login: async (email, password, rememberMe = false) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Guardar token en storage correspondiente
      if (data?.session?.access_token) {
        sessionStorage.setItem("repairit_token", data.session.access_token);
        if (rememberMe) {
          localStorage.setItem("repairit_token", data.session.access_token);
        } else {
          localStorage.removeItem("repairit_token");
        }
      }

      // Obtener perfil público asociado al usuario
      let profile = null;
      try {
        const { data: profData } = await supabase
          .from("profiles")
          .select("*, organization:organizations(*), venue:venues(*)")
          .eq("id", data.user.id)
          .maybeSingle();
        profile = profData;
      } catch (pErr) {
        console.error("No se pudo cargar el perfil detallado:", pErr);
      }

      const userData = {
        _id: profile?.id || data.user.id,
        name: profile?.name || data.user.email.split("@")[0],
        email: data.user.email,
        role: profile?.role || "admin",
        organizationId: profile?.organization_id || null,
        venueId: profile?.venue_id || null,
        subscriptionPlan: profile?.organization?.subscription_plan || "Multi-Taller Pro",
        subscriptionStatus: profile?.organization?.subscription_status || "activo",
        token: data.session.access_token,
      };

      sessionStorage.setItem("repairit_user", JSON.stringify(userData));
      if (rememberMe) {
        localStorage.setItem("repairit_user", JSON.stringify(userData));
      } else {
        localStorage.removeItem("repairit_user");
      }
      return userData;
    },

    register: async (registerData) => {
      // Registrar cuenta en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            name: registerData.name,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Crear Organización
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({ name: registerData.organizationName || "Organización RepairIT" })
        .select()
        .single();

      if (orgError) throw new Error(orgError.message);

      // Crear Sucursal por defecto
      const { data: venue, error: venueError } = await supabase
        .from("venues")
        .insert({
          organization_id: org.id,
          name: registerData.venueName || "Sucursal Central",
          email: registerData.venueEmail || registerData.email,
          phone: registerData.venuePhone || "+54 381 4223344",
          address: registerData.venueAddress || "Av. Sarmiento 1234, San Miguel de Tucumán",
        })
        .select()
        .single();

      if (venueError) throw new Error(venueError.message);

      // Crear Perfil Público
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          organization_id: org.id,
          venue_id: venue.id,
          name: registerData.name,
          role: "admin",
        });

      if (profileError) throw new Error(profileError.message);

      return { message: "Registro completado con éxito. Por favor inicia sesión." };
    },

    logout: async () => {
      await supabase.auth.signOut();
      localStorage.removeItem("repairit_token");
      localStorage.removeItem("repairit_user");
    },

    getProfile: async () => {
      let user = getLocalUser();

      if (!user.venueId || user.venueId === "undefined" || !user.organizationId) {
        try {
          const { data: authData } = await supabase.auth.getUser();
          if (authData?.user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*, organization:organizations(*), venue:venues(*)")
              .eq("id", authData.user.id)
              .maybeSingle();

            if (profile) {
              user = {
                _id: profile.id,
                name: profile.name,
                email: authData.user.email,
                role: profile.role,
                subscriptionPlan: profile.organization?.subscription_plan || "Multi-Taller Pro",
                subscriptionStatus: profile.organization?.subscription_status || "activo",
                organizationId: profile.organization_id,
                venueId: profile.venue_id,
              };
              localStorage.setItem("repairit_user", JSON.stringify(user));
            }
          }
        } catch (e) {
          console.error("Error al autorecuperar perfil:", e);
        }
      }

      if (!user.venueId || user.venueId === "undefined") {
        return { name: "Sucursal Central", address: "Av. Sarmiento 1234, San Miguel de Tucumán", phone: "+54 381 4223344", email: "central@repairit.cloud" };
      }

      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .eq("id", user.venueId)
        .maybeSingle();

      if (error || !data) {
        return { name: "Sucursal Central", address: "Av. Sarmiento 1234, San Miguel de Tucumán", phone: "+54 381 4223344", email: "central@repairit.cloud" };
      }
      return { ...data, _id: data.id };
    },

    updateProfile: async (profileData) => {
      const user = getLocalUser();
      if (!user.venueId || user.venueId === "undefined") {
        throw new Error("No hay sucursal activa en sesión.");
      }
      const { data, error } = await supabase
        .from("venues")
        .update(profileData)
        .eq("id", user.venueId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { ...data, _id: data.id };
    },

    getVenues: async () => {
      let user = getLocalUser();
      if (!user.organizationId || user.organizationId === "undefined") {
        try {
          const { data: authData } = await supabase.auth.getUser();
          if (authData?.user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("organization_id")
              .eq("id", authData.user.id)
              .maybeSingle();
            if (profile) {
              user.organizationId = profile.organization_id;
            }
          }
        } catch (e) {
          console.error("Error al autorecuperar sucursales:", e);
        }
      }

      if (!user.organizationId) return [];

      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .eq("organization_id", user.organizationId);

      if (error || !data) return [];
      return data.map((v) => ({ ...v, _id: v.id }));
    },

    createVenue: async (venueData) => {
      const user = getLocalUser();
      const { data, error } = await supabase
        .from("venues")
        .insert({
          organization_id: user.organizationId,
          ...venueData,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { ...data, _id: data.id };
    },

    updateVenue: async (id, venueData) => {
      const user = getLocalUser();
      const { data, error } = await supabase
        .from("venues")
        .update(venueData)
        .eq("id", id)
        .eq("organization_id", user.organizationId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { ...data, _id: data.id };
    },

    switchVenue: async (venueId) => {
      const user = getLocalUser();
      const { error } = await supabase
        .from("profiles")
        .update({ venue_id: venueId })
        .eq("id", user._id || user.id);

      if (error) throw new Error(error.message);

      return { venueId };
    },
  },

  // Clientes
  clients: {
    getAll: async () => {
      const user = getLocalUser();
      if (!user.organizationId || !user.venueId || user.organizationId === "undefined" || user.venueId === "undefined") {
        return [];
      }
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("organization_id", user.organizationId)
        .eq("venue_id", user.venueId);

      if (error) throw new Error(error.message);
      return data.map((c) => ({ ...c, _id: c.id }));
    },

    create: async (clientData) => {
      const user = getLocalUser();
      
      // Buscar si ya existe por DNI dentro de la sucursal
      const { data: existingClient } = await supabase
        .from("clients")
        .select("*")
        .eq("organization_id", user.organizationId)
        .eq("venue_id", user.venueId)
        .eq("dni", clientData.dni)
        .maybeSingle();

      if (existingClient) {
        // Actualizar datos
        const { data, error } = await supabase
          .from("clients")
          .update(clientData)
          .eq("id", existingClient.id)
          .select()
          .single();
        if (error) throw new Error(error.message);
        return { ...data, _id: data.id };
      }

      // Crear nuevo
      const { data, error } = await supabase
        .from("clients")
        .insert({
          organization_id: user.organizationId,
          venue_id: user.venueId,
          ...clientData,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { ...data, _id: data.id };
    },

    update: async (id, clientData) => {
      const user = getLocalUser();
      const { data, error } = await supabase
        .from("clients")
        .update(clientData)
        .eq("id", id)
        .eq("organization_id", user.organizationId)
        .eq("venue_id", user.venueId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { ...data, _id: data.id };
    },

    delete: async (id) => {
      const user = getLocalUser();
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id)
        .eq("organization_id", user.organizationId)
        .eq("venue_id", user.venueId);

      if (error) throw new Error(error.message);
      return { message: "Cliente eliminado correctamente." };
    },
  },

  // Órdenes
  orders: {
    getAll: async () => {
      const user = getLocalUser();
      if (!user.venueId || user.venueId === "undefined") return [];
      const { data, error } = await supabase
        .from("orders")
        .select("*, clientId:clients(*), venueId:venues(*)")
        .eq("venue_id", user.venueId);

      if (error) throw new Error(error.message);

      return data.map(mapOrder);
    },

    create: async (orderData) => {
      const user = getLocalUser();
      const trackingCode = generateTrackingCode();

      const { data, error } = await supabase
        .from("orders")
        .insert({
          venue_id: user.venueId,
          client_id: orderData.clientId,
          tracking_code: trackingCode,
          device_type: orderData.deviceType,
          device_model: orderData.deviceModel,
          accessories: orderData.accessories,
          cosmetic: orderData.cosmetic,
          issue: orderData.issue,
          date: orderData.date,
          time: orderData.time,
          status: orderData.status || "diagnostico",
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return mapOrder(data);
    },

    update: async (id, orderData) => {
      const payload = { ...orderData };
      if (payload.status === "reparacion") {
        payload.status = "en_reparacion";
      }

      const { data, error } = await supabase
        .from("orders")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return mapOrder(data);
    },

    updateStatus: async (id, status, text) => {
      const dbStatus = status === "reparacion" ? "en_reparacion" : status;

      // Obtener orden actual para leer su historial
      const { data: order } = await supabase
        .from("orders")
        .select("history")
        .eq("id", id)
        .single();

      const history = Array.isArray(order?.history) ? order.history : [];
      const dateStr = new Date().toLocaleDateString("es-AR") + " " + new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
      
      history.push({ date: dateStr, text });

      const { data, error } = await supabase
        .from("orders")
        .update({ status: dbStatus, history })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return mapOrder(data);
    },

    updateDiagnosisAndBudget: async (id, { diagnosis, budget, status }) => {
      const { data: order } = await supabase
        .from("orders")
        .select("history")
        .eq("id", id)
        .single();

      const history = Array.isArray(order?.history) ? order.history : [];
      const dateStr = new Date().toLocaleDateString("es-AR") + " " + new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
      
      const statusText = status ? status.toUpperCase() : "ACTUALIZADO";
      history.push({ date: dateStr, text: `Diagnóstico / Presupuesto cargado (${statusText})` });

      const updateData = { history };
      if (diagnosis !== undefined) updateData.diagnosis = diagnosis;
      if (budget !== undefined) updateData.budget = budget;
      if (status) updateData.status = status;

      const { data, error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return mapOrder(data);
    },

    track: async (code) => {
      const cleanCode = (code || "").trim();
      if (cleanCode.toLowerCase() === "demo-id" || cleanCode.toLowerCase() === "demo") {
        return {
          id: "demo-id-12345",
          _id: "demo-id-12345",
          trackingCode: "demo-id",
          deviceType: "Notebook",
          deviceModel: "Lenovo ThinkPad E14 Gen 2",
          issue: "El equipo no enciende tras descarga eléctrica. Parpadea LED de carga.",
          diagnosis: "Falla en circuito primario de alimentación 19V. Cortocircuito en mosfet de entrada y chip IC PMIC dañados.",
          status: "presupuestado",
          clientId: {
            name: "Juan Pérez (Cliente Demo)",
            dni: "38.450.123",
            phone: "+54 381 555-0192",
            email: "juan.demo@email.com"
          },
          venueId: {
            name: "Sucursal Central (Demo)",
            address: "Av. Sarmiento 1234, San Miguel de Tucumán"
          },
          budget: {
            items: [
              { desc: "Reemplazo de Mosfet e IC Regulador PMIC", price: 18500 },
              { desc: "Mantenimiento térmico y limpieza de placa madre", price: 6500 }
            ],
            approved: false,
            dateApproved: null
          },
          history: [
            { date: "24/07/2026 09:30", text: "Equipo ingresado en recepción." },
            { date: "24/07/2026 11:15", text: "Diagnóstico finalizado por el equipo técnico." },
            { date: "24/07/2026 11:30", text: "Presupuesto detallado generado y disponible online." }
          ]
        };
      }

      // Intentar primero función RPC segura de lectura pública
      try {
        const { data: rpcData, error: rpcErr } = await supabase.rpc("get_public_order_tracking", { p_code: cleanCode });
        if (!rpcErr && rpcData) {
          return mapOrder(rpcData);
        }
      } catch (e) {
        console.warn("RPC get_public_order_tracking no disponible, intentando consulta directa:", e);
      }

      // Consulta directa de respaldo
      const { data, error } = await supabase
        .from("orders")
        .select("*, venueId:venues(*), clientId:clients(*)")
        .ilike("tracking_code", cleanCode)
        .maybeSingle();

      if (error) throw new Error(error.message);
      if (!data) throw new Error("Orden de servicio no encontrada.");

      return mapOrder(data);
    },

    approveBudget: async (code) => {
      const cleanCode = (code || "").trim().toLowerCase();
      if (cleanCode === "demo-id" || cleanCode === "demo") {
        return {
          id: "demo-id-12345",
          _id: "demo-id-12345",
          trackingCode: "demo-id",
          deviceType: "Notebook",
          deviceModel: "Lenovo ThinkPad E14 Gen 2",
          issue: "El equipo no enciende tras descarga eléctrica. Parpadea LED de carga.",
          diagnosis: "Falla en circuito primario de alimentación 19V. Cortocircuito en mosfet de entrada y chip IC PMIC dañados.",
          status: "en_reparacion",
          clientId: {
            name: "Juan Pérez (Cliente Demo)",
            dni: "38.450.123",
            phone: "+54 381 555-0192",
            email: "juan.demo@email.com"
          },
          venueId: {
            name: "Sucursal Central (Demo)",
            address: "Av. Sarmiento 1234, San Miguel de Tucumán"
          },
          budget: {
            items: [
              { desc: "Reemplazo de Mosfet e IC Regulador PMIC", price: 18500 },
              { desc: "Mantenimiento térmico y limpieza de placa madre", price: 6500 }
            ],
            approved: true,
            dateApproved: new Date().toLocaleDateString("es-AR")
          },
          history: [
            { date: "24/07/2026 09:30", text: "Equipo ingresado en recepción." },
            { date: "24/07/2026 11:15", text: "Diagnóstico finalizado por el equipo técnico." },
            { date: "24/07/2026 11:30", text: "Presupuesto detallado generado y disponible online." },
            { date: new Date().toLocaleDateString("es-AR") + " " + new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }), text: "Presupuesto aprobado online por el cliente (Demo)." }
          ]
        };
      }

      // Intentar primero función RPC segura de aprobación pública
      try {
        const { data: rpcData, error: rpcErr } = await supabase.rpc("approve_order_budget", { p_code: cleanCode });
        if (!rpcErr && rpcData) {
          return mapOrder(rpcData);
        }
      } catch (e) {
        console.warn("RPC approve_order_budget no disponible, intentando update directo:", e);
      }

      // Update directo de respaldo
      const { data: order, error: readErr } = await supabase
        .from("orders")
        .select("id, budget, history")
        .ilike("tracking_code", cleanCode)
        .maybeSingle();

      if (readErr || !order) throw new Error("No se encontró la orden de servicio.");

      const budget = order.budget || {};
      budget.approved = true;
      budget.dateApproved = new Date().toLocaleDateString("es-AR");

      const history = Array.isArray(order?.history) ? order.history : [];
      const dateStr = new Date().toLocaleDateString("es-AR") + " " + new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
      
      history.push({ date: dateStr, text: "Presupuesto aprobado online por el cliente." });

      const { data, error } = await supabase
        .from("orders")
        .update({
          status: "en_reparacion",
          budget,
          history,
        })
        .eq("id", order.id)
        .select()
        .maybeSingle();

      if (error) throw new Error(error.message);
      return mapOrder(data);
    },
  },

  // Inventario
  inventory: {
    getAll: async () => {
      const user = getLocalUser();
      if (!user.venueId || user.venueId === "undefined") return [];
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .eq("venue_id", user.venueId);

      if (error) throw new Error(error.message);
      return data.map(item => ({ ...item, _id: item.id }));
    },

    create: async (itemData) => {
      const user = getLocalUser();
      const { data, error } = await supabase
        .from("inventory")
        .insert({
          organization_id: user.organizationId,
          venue_id: user.venueId,
          code: itemData.code,
          name: itemData.name,
          description: itemData.description,
          category: itemData.category,
          quantity: itemData.quantity,
          min_quantity: itemData.minQuantity,
          price: itemData.price,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { ...data, _id: data.id };
    },

    update: async (id, itemData) => {
      const user = getLocalUser();
      const { data, error } = await supabase
        .from("inventory")
        .update({
          code: itemData.code,
          name: itemData.name,
          description: itemData.description,
          category: itemData.category,
          quantity: itemData.quantity,
          min_quantity: itemData.minQuantity,
          price: itemData.price,
        })
        .eq("id", id)
        .eq("venue_id", user.venueId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { ...data, _id: data.id };
    },

    delete: async (id) => {
      const user = getLocalUser();
      const { error } = await supabase
        .from("inventory")
        .delete()
        .eq("id", id)
        .eq("venue_id", user.venueId);

      if (error) throw new Error(error.message);
      return { message: "Artículo eliminado." };
    },

    adjustStock: async (id, amount) => {
      const user = getLocalUser();
      const { data: item } = await supabase
        .from("inventory")
        .select("quantity")
        .eq("id", id)
        .eq("venue_id", user.venueId)
        .single();

      const newQty = Math.max(0, (item?.quantity || 0) + amount);

      const { data, error } = await supabase
        .from("inventory")
        .update({ quantity: newQty })
        .eq("id", id)
        .eq("venue_id", user.venueId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { ...data, _id: data.id };
    },

    bulkUpsert: async (itemsArray) => {
      const { data, error } = await supabase
        .from("inventory")
        .upsert(itemsArray, { onConflict: "venue_id, code" });

      if (error) throw new Error(error.message);
      return data;
    },
  },

  // Ventas de Caja (POS)
  sales: {
    getAll: async (venueId = null) => {
      const user = getLocalUser();
      let query = supabase
        .from("sales")
        .select("*, venue:venues(name), profile:profiles(name)");
      
      if (venueId && venueId !== "todas") {
        query = query.eq("venue_id", venueId);
      } else if (user.role !== "superadmin") {
        if (user.subscriptionPlan === "Multi-Taller Pro") {
          query = query.eq("organization_id", user.organizationId);
        } else {
          query = query.eq("venue_id", user.venueId);
        }
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data.map((s) => ({
        ...s,
        _id: s.id,
        venueName: s.venue?.name || "Desconocida",
        cajero: s.profile?.name || "Sistema",
      }));
    },

    create: async (saleData) => {
      const user = getLocalUser();
      
      const { data: sale, error: saleErr } = await supabase
        .from("sales")
        .insert({
          organization_id: user.organizationId,
          venue_id: user.venueId,
          total: saleData.total,
          payment_method: saleData.paymentMethod,
          items: saleData.items,
          created_by: user._id || user.id,
        })
        .select()
        .single();

      if (saleErr) throw new Error(saleErr.message);

      // Descontar stock para cada producto
      for (const item of saleData.items) {
        const { data: currentItem } = await supabase
          .from("inventory")
          .select("quantity")
          .eq("id", item.id)
          .single();

        const newQty = Math.max(0, (currentItem?.quantity || 0) - item.quantity);
        
        await supabase
          .from("inventory")
          .update({ quantity: newQty })
          .eq("id", item.id);
      }

      return { ...sale, _id: sale.id };
    },
  },

  // SuperAdmin
  super: {
    getOrganizations: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*, venues(id), profiles(id)");

      if (error) throw new Error(error.message);

      return data.map((org) => ({
        ...org,
        _id: org.id,
        subscriptionPlan: org.subscription_plan,
        subscriptionStatus: org.subscription_status,
        createdAt: org.created_at,
        venuesCount: Array.isArray(org.venues) ? org.venues.length : 0,
        usersCount: Array.isArray(org.profiles) ? org.profiles.length : 0,
      }));
    },

    updateSubscription: async (id, subscriptionPlan, subscriptionStatus) => {
      const updateData = {};
      if (subscriptionPlan) updateData.subscription_plan = subscriptionPlan;
      if (subscriptionStatus) updateData.subscription_status = subscriptionStatus;

      const { data, error } = await supabase
        .from("organizations")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return {
        ...data,
        _id: data.id,
        subscriptionPlan: data.subscription_plan,
        subscriptionStatus: data.subscription_status,
        createdAt: data.created_at,
      };
    },

    getUsers: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, organizationId:organizations(name), venueId:venues(name)");

      if (error) throw new Error(error.message);

      return data.map((profile) => ({
        ...profile,
        _id: profile.id,
        createdAt: profile.created_at,
        organizationId: profile.organizationId ? { ...profile.organizationId, _id: profile.organizationId.id } : null,
        venueId: profile.venueId ? { ...profile.venueId, _id: profile.venueId.id } : null,
      }));
    },

    updateUserRole: async (id, role) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return { ...data, _id: data.id };
    },

    manageUser: async (userId, name, email, role, password = null) => {
      const { error } = await supabase.rpc("super_admin_manage_user", {
        p_user_id: userId,
        p_new_name: name,
        p_new_email: email,
        p_new_role: role,
        p_new_password: password,
      });

      if (error) throw new Error(error.message);
      return { message: "Usuario actualizado correctamente." };
    },

    deleteUser: async (userId) => {
      const { error } = await supabase.rpc("super_admin_delete_user", {
        p_user_id: userId,
      });

      if (error) throw new Error(error.message);
      return { message: "Usuario eliminado correctamente." };
    },
  },

  // Cuentas de Acceso de Venue (Para Administradores)
  venueAccounts: {
    getAll: async () => {
      const user = getLocalUser();
      if (!user.organizationId || user.organizationId === "undefined") return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("*, venue:venues(*)")
        .eq("organization_id", user.organizationId)
        .eq("role", "tecnico");

      if (error) throw new Error(error.message);
      return data.map((p) => ({
        ...p,
        _id: p.id,
        venueId: p.venue ? { ...p.venue, _id: p.venue.id } : null,
      }));
    },

    create: async (accountData) => {
      const { data, error } = await supabase.rpc("create_venue_account", {
        p_email: accountData.email,
        p_password: accountData.password,
        p_name: accountData.name,
        p_venue_id: accountData.venueId,
      });

      if (error) throw new Error(error.message);
      return data;
    },

    delete: async (accountId) => {
      const { error } = await supabase.rpc("delete_venue_account", {
        p_user_id: accountId,
      });

      if (error) throw new Error(error.message);
      return { message: "Cuenta eliminada correctamente." };
    },
  },
};
