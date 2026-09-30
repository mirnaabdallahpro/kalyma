import { supabase } from "../lib/supabase";

export async function getLinkedinContent() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Utilisateur non connecté");
    }

    const { data, error } = await supabase
        .from("linkedin_content_items")
        .select(`
            *,
            content_type:linkedin_content_types(
                id,
                name,
                slug,
                color
            ),
            pillar:linkedin_content_pillars(
                id,
                name,
                slug,
                color
            ),
            objective:linkedin_content_objectives(
                id,
                name,
                slug,
                color
            )
        `)
        .eq("user_id", user.id)
        .is("archived_at", null)
        .order("position", { ascending: true })
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
}


export async function getLinkedinContentConfig() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Utilisateur non connecté");
    }

    const [
        typesResult,
        pillarsResult,
        objectivesResult
    ] = await Promise.all([
        supabase
            .from("linkedin_content_types")
            .select("*")
            .eq("user_id", user.id)
            .eq("is_active", true)
            .order("position"),

        supabase
            .from("linkedin_content_pillars")
            .select("*")
            .eq("user_id", user.id)
            .eq("is_active", true)
            .order("position"),

        supabase
            .from("linkedin_content_objectives")
            .select("*")
            .eq("user_id", user.id)
            .eq("is_active", true)
            .order("position")
    ]);

    if (typesResult.error) throw typesResult.error;
    if (pillarsResult.error) throw pillarsResult.error;
    if (objectivesResult.error) throw objectivesResult.error;

    return {
        types: typesResult.data || [],
        pillars: pillarsResult.data || [],
        objectives: objectivesResult.data || []
    };
}


export async function createLinkedinContent(payload) {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Utilisateur non connecté");
    }

    const { data, error } = await supabase
        .from("linkedin_content_items")
        .insert({
            ...payload,
            user_id: user.id
        })
        .select()
        .single();

    if (error) throw error;

    return data;
}


export async function updateLinkedinContent(id, payload) {
    const { data, error } = await supabase
        .from("linkedin_content_items")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data;
}


export async function deleteLinkedinContent(id) {
    const { error } = await supabase
        .from("linkedin_content_items")
        .delete()
        .eq("id", id);

    if (error) throw error;
}


export async function updateContentStatus(id, status) {
    return updateLinkedinContent(id, {
        status
    });
}


export async function scheduleLinkedinContent(id, scheduledAt) {
    return updateLinkedinContent(id, {
        status: "scheduled",
        scheduled_at: scheduledAt
    });
}