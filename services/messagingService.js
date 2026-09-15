// src/services/messagingService.js
//
// Service de la messagerie coach/client, sur le modèle des autres
// services Kalyma (un fichier par domaine, fonctions pures qui
// wrappent le client Supabase).
//
// Hypothèse : le client Supabase est exporté depuis src/lib/supabaseClient.js
// Adapte l'import si ton chemin réel est différent.

import { supabase } from '../lib/supabase';

const ATTACHMENTS_BUCKET = 'message-attachments';

// -----------------------------------------------------------
// CONVERSATIONS
// -----------------------------------------------------------

/**
 * Récupère (ou crée) la conversation d'un client.
 * Coté client, userId = son propre id. Coté coach, userId = l'id du client consulté.
 */
export async function getOrCreateConversation(userId, businessProfileId = null) {
  const { data: existing, error: findError } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (findError) throw findError;
  if (existing) return existing;

  const { data: created, error: createError } = await supabase
    .from('conversations')
    .insert({ user_id: userId, business_profile_id: businessProfileId })
    .select('*')
    .single();

  if (createError) throw createError;
  return created;
}

/**
 * Vue admin : liste toutes les conversations, triées par activité récente.
 * Jointe avec le nom de l'entreprise du client pour l'affichage sidebar.
 */
export async function listConversations() {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      business_profiles ( company_name, sector )
    `)
    .order('last_message_at', { ascending: false, nullsFirst: false });

  if (error) throw error;
  return data;
}

// -----------------------------------------------------------
// MESSAGES
// -----------------------------------------------------------

export async function listMessages(conversationId, { limit = 50 } = {}) {
  // tri décroissant + limit = on récupère bien les N DERNIERS messages
  // (un tri croissant + limit couperait la conversation à ses N
  // PREMIERS messages, et ferait disparaître tout ce qui vient après
  // dès que la conversation dépasse `limit`)
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      message_attachments ( * ),
      message_reactions ( * )
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  // on remet en ordre chronologique (ancien → récent) pour l'affichage du fil
  return (data || []).reverse();
}

/**
 * Modifie le contenu d'un message qu'on a soi-même envoyé.
 * Passe par la fonction RPC edit_message (voir migration
 * 20260911_message_actions.sql) plutôt qu'un .update() direct :
 * la vérification "c'est bien mon message" est faite côté base,
 * pas fait confiance au client.
 */
export async function editMessage(messageId, content) {
  const { data, error } = await supabase.rpc('edit_message', {
    p_message_id: messageId,
    p_content: content,
  });
  if (error) throw error;
  return data;
}

/**
 * Supprime (soft delete) un message. Le contenu et les pièces jointes
 * sont effacés côté base ; la ligne reste avec deleted_at renseigné
 * pour afficher "Message supprimé" dans le fil, comme WhatsApp.
 */
export async function deleteMessage(messageId) {
  const { data, error } = await supabase.rpc('delete_message', {
    p_message_id: messageId,
  });
  if (error) throw error;
  return data;
}

/**
 * Ajoute ou retire (toggle) une réaction emoji de l'utilisateur courant
 * sur un message. Retourne true si la réaction a été ajoutée, false
 * si elle a été retirée.
 */
export async function toggleReaction(messageId, emoji) {
  const { data, error } = await supabase.rpc('toggle_reaction', {
    p_message_id: messageId,
    p_emoji: emoji,
  });
  if (error) throw error;
  return data;
}

/**
 * Envoie un message texte, avec pièces jointes optionnelles déjà préparées :
 * attachments = [{ type: 'screenshot', url }, { type: 'link', internal_path, label }]
 */
export async function sendMessage({ conversationId, senderId, senderRole, content, attachments = [] }) {
  const { data: message, error: msgError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      sender_role: senderRole,
      content,
    })
    .select('*')
    .single();

  if (msgError) throw msgError;

  if (attachments.length > 0) {
    const rows = attachments.map((a) => ({ ...a, message_id: message.id }));
    const { error: attachError } = await supabase.from('message_attachments').insert(rows);
    if (attachError) throw attachError;
  }

  return message;
}

/**
 * Marque comme lus tous les messages non lus envoyés par "l'autre partie",
 * et remet à zéro le compteur non-lu correspondant sur la conversation.
 */
export async function markConversationRead(conversationId, readerRole) {
  const otherRole = readerRole === 'coach' ? 'client' : 'coach';

  const { error: msgError } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .eq('sender_role', otherRole)
    .is('read_at', null);

  if (msgError) throw msgError;

  const counterField = readerRole === 'coach' ? 'unread_by_coach' : 'unread_by_client';
  const { error: convError } = await supabase
    .from('conversations')
    .update({ [counterField]: 0 })
    .eq('id', conversationId);

  if (convError) throw convError;
}

// -----------------------------------------------------------
// PIÈCES JOINTES
// -----------------------------------------------------------

/**
 * Upload une capture d'écran dans le bucket privé, sous le dossier du client
 * (obligatoire pour que les policies Storage fonctionnent : {user_id}/xxx.png).
 * Retourne un objet attachment prêt à passer à sendMessage().
 */
export async function uploadScreenshot(file, clientUserId) {
  const ext = file.name.split('.').pop();
  const path = `${clientUserId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (uploadError) throw uploadError;

  return { type: 'screenshot', url: path, label: file.name };
}

/** Résout une URL Storage signée pour affichage (bucket privé). */
export async function getScreenshotUrl(path, expiresIn = 3600) {
  const { data, error } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error) throw error;
  return data.signedUrl;
}

/**
 * Construit un attachment "lien interne" à partir d'une entité de l'app.
 * entityType: 'prospect' | 'task' | 'objective' | 'project' | 'diagnostic'
 */
export function buildInternalLinkAttachment(entityType, entityId, label) {
  const routes = {
    prospect: `/crm/prospects/${entityId}`,
    task: `/tasks/${entityId}`,
    objective: `/objectives/${entityId}`,
    project: `/projects/${entityId}`,
    diagnostic: `/business/diagnostic/${entityId}`,
  };

  return {
    type: 'link',
    internal_path: routes[entityType] ?? '/',
    url: '',
    label,
  };
}

// -----------------------------------------------------------
// REALTIME
// -----------------------------------------------------------

/**
 * S'abonne aux nouveaux messages ET aux modifications (édition,
 * suppression) d'une conversation. onUpdate est optionnel — si non
 * fourni, seuls les nouveaux messages sont écoutés (compat. ascendante).
 * Retourne une fonction unsubscribe() à appeler au démontage.
 */
export function subscribeToMessages(conversationId, onInsert, onUpdate) {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
      (payload) => onInsert(payload.new)
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
      (payload) => onUpdate?.(payload.new)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

/**
 * S'abonne aux ajouts/retraits de réactions emoji sur les messages
 * d'une conversation. onChange reçoit { type: 'INSERT' | 'DELETE', reaction }.
 */
export function subscribeToReactions(conversationId, onChange) {
  const channel = supabase
    .channel(`reactions:${conversationId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'message_reactions' },
      (payload) => onChange({ type: 'INSERT', reaction: payload.new })
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'message_reactions' },
      (payload) => onChange({ type: 'DELETE', reaction: payload.old })
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

/**
 * S'abonne aux mises à jour de compteur non-lu, pour le badge sidebar admin.
 * Utile sur la vue globale (liste de conversations), pas sur un fil précis.
 */
export function subscribeToConversationUpdates(onUpdate) {
  const channel = supabase
    .channel('conversations:all')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'conversations' },
      (payload) => onUpdate(payload.new)
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}