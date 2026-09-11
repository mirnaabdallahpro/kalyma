// src/services/clientContextService.js
//
// Regroupe les requêtes nécessaires au panneau de contexte de la messagerie :
// diagnostic courant, dimensions, et quelques compteurs d'activité.
// Séparé de messagingService.js car ce n'est pas du domaine "messagerie"
// à proprement parler, juste ce dont la page a besoin pour s'afficher.

import { supabase } from '../lib/supabase';

export async function getClientContext(userId, businessProfileId) {
  const [diagnostic, prospects, tasks, objectives] = await Promise.all([
    getCurrentDiagnostic(businessProfileId),
    countActiveProspects(userId),
    countOverdueTasks(userId),
    countActiveObjectives(userId),
  ]);

  return {
    diagnostic,
    stats: {
      activeProspects: prospects,
      overdueTasks: tasks,
      activeObjectives: objectives,
    },
  };
}

async function getCurrentDiagnostic(businessProfileId) {
  if (!businessProfileId) return null;

  const { data: diagnostic, error } = await supabase
    .from('business_diagnostics')
    .select('id, business_score, generated_at')
    .eq('business_profile_id', businessProfileId)
    .eq('is_current', true)
    .maybeSingle();

  if (error || !diagnostic) return null;

  const { data: dimensions } = await supabase
    .from('business_diagnostic_dimensions')
    .select('dimension_key, name, status, score')
    .eq('diagnostic_id', diagnostic.id)
    .order('position', { ascending: true });

  return { ...diagnostic, dimensions: dimensions || [] };
}

async function countActiveProspects(userId) {
  const { count } = await supabase
    .from('prospects')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .not('stage', 'in', '(gagne,perdu)');
  return count || 0;
}

async function countOverdueTasks(userId) {
  const today = new Date().toISOString().slice(0, 10);
  const { count } = await supabase
    .from('tasks')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .neq('status', 'done')
    .lt('due_date', today)
    .is('archived_at', null);
  return count || 0;
}

async function countActiveObjectives(userId) {
  const { count } = await supabase
    .from('objectives')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'in_progress');
  return count || 0;
}

/** Traduit un statut de dimension en classe CSS (voir .tag-* dans global.css) */
export function dimensionTagClass(status) {
  const map = {
    solide: 'tag-solide',
    a_optimiser: 'tag-optimiser',
    prioritaire: 'tag-prioritaire',
    critique: 'tag-critique',
  };
  return map[status] || 'tag-optimiser';
}

export function dimensionLabel(status) {
  const map = {
    solide: 'Solide',
    a_optimiser: 'À optimiser',
    prioritaire: 'Prioritaire',
    critique: 'Critique',
  };
  return map[status] || status;
}