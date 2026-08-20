import { supabase } from "../../lib/supabase";

/**
 * Vérifie que l'utilisateur courant est administrateur.
 *
 * Source du rôle :
 * auth.users.id → user_roles.user_id
 */
async function getAuthenticatedAdmin() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!session?.user) {
    throw new Error("Utilisateur non authentifié.");
  }

  const { data: adminCheck, error: adminCheckError } =
  await supabase.rpc("is_admin");

console.log("========== TEST IS_ADMIN ==========");
console.log("adminCheck :", adminCheck);
console.log("adminCheckError :", adminCheckError);
console.log("===================================");

  const {
    data: userRole,
    error: roleError,
  } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (roleError) {
    throw roleError;
  }


  if (!userRole || userRole.role !== "admin") {
    throw new Error("Accès administrateur refusé.");
  }

  return session.user;
}



/**
 * Récupère tous les clients avec leurs données business.
 *
 * Les informations utilisateur proviennent de auth.users
 * via une fonction RPC sécurisée.
 */
export async function getAdminBusinessClients() {
  await getAuthenticatedAdmin();

  const {
    data,
    error,
  } = await supabase.rpc("get_admin_business_clients");

  if (error) {
    throw error;
  }

  return data ?? [];
}

/**
 * Récupère toutes les données d'un client.
 *
 * Données retournées :
 * - utilisateur
 * - rôle
 * - business profile
 * - offres
 * - objectifs
 * - priorités
 * - diagnostics
 */
export async function getAdminBusinessClient(businessId) {

  if (!businessId) {
    throw new Error("Identifiant business manquant.");
  }

  await getAuthenticatedAdmin();

  const {
    data,
    error,
  } = await supabase.rpc(
    "get_admin_business_client",
    {
      p_business_id: businessId,
    }
  );

  if (error) {
    throw error;
  }

  return data?.[0] ?? null;
}

/**
 * Alias pour récupérer le détail complet d'un client.
 *
 * Conservé pour éviter de casser les composants existants
 * qui utilisent déjà getAdminBusinessClientDetail().
 */
export async function getAdminBusinessClientDetail(clientId) {
  if (!clientId) {
    throw new Error("Identifiant client manquant.");
  }

  return getAdminBusinessClient(clientId);
}