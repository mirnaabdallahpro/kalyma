import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const AI_FIELD_CONFIG: Record<
    string,
    {
        label: string;
        instruction: string;
    }
> = {
    description: {
        label: "Description",
        instruction:
            "Améliore la description de l'entreprise afin qu'elle soit claire, professionnelle, précise et attractive.",
    },

    vision: {
        label: "Vision",
        instruction:
            "Formule une vision stratégique claire, ambitieuse et inspirante pour l'entreprise.",
    },

    mission: {
        label: "Mission",
        instruction:
            "Formule une mission claire expliquant ce que fait l'entreprise, pour qui et dans quel but.",
    },

    ambition: {
        label: "Ambition",
        instruction:
            "Formule une ambition business concrète, ambitieuse et cohérente avec le profil de l'entreprise.",
    },

    positioning: {
        label: "Positionnement",
        instruction:
            "Améliore le positionnement afin qu'il soit clair, différenciant et pertinent pour le marché cible.",
    },

    problemSolved: {
        label: "Problème résolu",
        instruction:
            "Formule clairement le problème principal que l'entreprise résout pour ses clients.",
    },

    differentiation: {
        label: "Différenciation",
        instruction:
            "Formule une différenciation claire, crédible et pertinente par rapport aux alternatives existantes.",
    },

    valueProposition: {
        label: "Proposition de valeur",
        instruction:
            "Formule une proposition de valeur forte centrée sur les bénéfices concrets apportés au client.",
    },

    targetMarket: {
        label: "Marché cible",
        instruction:
            "Définis précisément le marché cible en tenant compte de l'offre, du secteur, du problème résolu et du modèle économique.",
    },
};

function buildPrompt({
    field,
    value,
    profile,
}: {
    field: string;
    value: string;
    profile: Record<string, unknown>;
}) {
    const config = AI_FIELD_CONFIG[field];

    return `
Tu es un consultant expert en stratégie business,
positionnement, marketing et développement d'entreprise.

Tu travailles pour Kalyma, une plateforme qui aide les entrepreneurs
à clarifier, structurer et développer leur activité.

Voici les informations disponibles sur l'entreprise :

Nom :
${profile.companyName || "Non renseigné"}

Secteur :
${profile.sector || "Non renseigné"}

Localisation :
${profile.location || "Non renseigné"}

Stade :
${profile.stage || "Non renseigné"}

Description :
${profile.description || "Non renseigné"}

Vision :
${profile.vision || "Non renseigné"}

Mission :
${profile.mission || "Non renseigné"}

Ambition :
${profile.ambition || "Non renseigné"}

Positionnement :
${profile.positioning || "Non renseigné"}

Catégorie :
${profile.category || "Non renseigné"}

Problème résolu :
${profile.problemSolved || "Non renseigné"}

Différenciation :
${profile.differentiation || "Non renseigné"}

Proposition de valeur :
${profile.valueProposition || "Non renseigné"}

Modèle économique :
${profile.businessModel || "Non renseigné"}

Marché cible :
${profile.targetMarket || "Non renseigné"}


CHAMP À AMÉLIORER :

${config.label}


VALEUR ACTUELLE :

${value || "Aucune valeur renseignée"}


OBJECTIF :

${config.instruction}


RÈGLES IMPORTANTES :

1. Améliore uniquement le champ demandé.
2. Utilise toutes les informations pertinentes du profil.
3. Ne crée pas de faits qui ne sont pas présents dans le profil.
4. Évite les formulations génériques et les clichés marketing.
5. Sois concret et professionnel.
6. La réponse doit être directement utilisable dans le profil.
7. Réponds en français.
8. Ne mets pas de Markdown.
9. Ne commence pas par "Voici une suggestion".
10. Donne uniquement le contenu final proposé.

Réponds uniquement avec la suggestion finale.
`;
}

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: corsHeaders,
        });
    }

    try {
        const body = await req.json();

        const {
            field,
            value,
            profile,
        } = body;

        if (!field) {
            return new Response(
                JSON.stringify({
                    error: "Le champ est obligatoire.",
                }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const config = AI_FIELD_CONFIG[field];

        if (!config) {
            return new Response(
                JSON.stringify({
                    error: `Le champ "${field}" n'est pas pris en charge par l'IA.`,
                }),
                {
                    status: 400,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const prompt = buildPrompt({
            field,
            value: value || "",
            profile: profile || {},
        });

        const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

        if (!GEMINI_API_KEY) {
            throw new Error(
                "GEMINI_API_KEY n'est pas configurée dans Supabase."
            );
        }

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": GEMINI_API_KEY,
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: prompt,
                                },
                            ],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1000,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();

            console.error("Erreur Gemini :", errorText);

            throw new Error(
                "Erreur lors de la communication avec Gemini."
            );
        }

        const result = await response.json();

        const suggestion =
            result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!suggestion) {
            throw new Error(
                "Gemini n'a retourné aucune suggestion."
            );
        }

        return new Response(
            JSON.stringify({
                field,
                suggestion,
                model: "gemini-2.5-flash",
            }),
            {
                status: 200,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error("Business AI error:", error);

        return new Response(
            JSON.stringify({
                error:
                    error instanceof Error
                        ? error.message
                        : "Une erreur inconnue est survenue.",
            }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );
    }
});