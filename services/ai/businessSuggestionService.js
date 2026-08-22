import { supabase } from "../../lib/supabase";

export async function getBusinessAiSuggestion({
  field,
  value,
  profile,
}) {
  const { data, error } = await supabase.functions.invoke(
    "business-ai-suggest",
    {
      body: {
        field,
        value: value || "",
        profile: profile || {},
      },
    }
  );

  if (error) {
    console.error("Erreur Edge Function :", error);

    // Essayer de récupérer le vrai message retourné par Supabase
    if (error.context) {
      try {
        const responseText = await error.context.text();

        console.error(
          "Réponse brute de l'Edge Function :",
          responseText
        );

        try {
          const responseJson = JSON.parse(responseText);

          console.error(
            "Erreur détaillée :",
            responseJson
          );

          throw new Error(
            responseJson.error ||
              "Erreur inconnue de l'Edge Function."
          );
        } catch (jsonError) {
          if (jsonError instanceof Error) {
            throw jsonError;
          }

          throw new Error(responseText);
        }
      } catch (readError) {
        console.error(
          "Impossible de lire la réponse :",
          readError
        );
      }
    }

    throw error;
  }

  if (!data?.suggestion) {
    throw new Error(
      "Aucune suggestion reçue de Gemini."
    );
  }

  return data;
}