import { useEffect, useState } from "react";

import {
    Save,
    Sparkles,
    X
} from "lucide-react";


export default function ContentEditor({
    content,
    config,
    onClose,
    onCreate,
    onUpdate
}) {

    const [form, setForm] = useState({

        title: "",
        hook: "",
        angle: "",
        idea: "",
        body: "",
        cta: "",
        notes: "",

        status: "idea",
        format: "text",
        language: "fr",
        priority: "medium",

        content_type_id: "",
        pillar_id: "",
        objective_id: "",

        scheduled_at: ""
    });


    useEffect(() => {

        if (!content) return;

        setForm({

            title: content.title || "",
            hook: content.hook || "",
            angle: content.angle || "",
            idea: content.idea || "",
            body: content.body || "",
            cta: content.cta || "",
            notes: content.notes || "",

            status: content.status || "idea",
            format: content.format || "text",
            language: content.language || "fr",
            priority: content.priority || "medium",

            content_type_id:
                content.content_type_id || "",

            pillar_id:
                content.pillar_id || "",

            objective_id:
                content.objective_id || "",

            scheduled_at:
                content.scheduled_at
                    ? content.scheduled_at.slice(0, 16)
                    : ""
        });

    }, [content]);


    function update(field, value) {

        setForm(current => ({
            ...current,
            [field]: value
        }));

    }


    async function submit(e) {

        e.preventDefault();

        const payload = {
            ...form,
            scheduled_at:
                form.scheduled_at || null
        };

        if (content) {

            await onUpdate(
                content.id,
                payload
            );

        } else {

            await onCreate(payload);

        }

    }


    return (

        <div className="linkedin-editor-overlay">

            <div className="linkedin-editor">

                <div className="linkedin-editor-header">

                    <div>

                        <span>
                            {content
                                ? "MODIFIER LE CONTENU"
                                : "NOUVEAU CONTENU"}
                        </span>

                        <h2>
                            {content?.title ||
                                "Construire une nouvelle idée"}
                        </h2>

                    </div>


                    <button
                        className="linkedin-close"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </button>

                </div>


                <form onSubmit={submit}>

                    <div className="linkedin-editor-grid">

                        <div className="linkedin-editor-main">

                            <label>
                                Titre interne

                                <input
                                    value={form.title}
                                    onChange={e =>
                                        update(
                                            "title",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Ex : Pourquoi la clarté ne suffit pas"
                                />

                            </label>


                            <label>
                                Hook

                                <textarea
                                    rows="3"
                                    value={form.hook}
                                    onChange={e =>
                                        update(
                                            "hook",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Quelle phrase va arrêter le scroll ?"
                                />

                            </label>


                            <label>
                                Idée / angle

                                <textarea
                                    rows="5"
                                    value={form.idea}
                                    onChange={e =>
                                        update(
                                            "idea",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Quelle idée veux-tu faire passer ?"
                                />

                            </label>


                            <label>
                                Contenu

                                <textarea
                                    className="linkedin-body-editor"
                                    rows="14"
                                    value={form.body}
                                    onChange={e =>
                                        update(
                                            "body",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Rédige ton post LinkedIn..."
                                />

                            </label>


                            <label>
                                CTA

                                <input
                                    value={form.cta}
                                    onChange={e =>
                                        update(
                                            "cta",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Ex : Qu'en pensez-vous ?"
                                />

                            </label>

                        </div>


                        <aside className="linkedin-editor-sidebar">

                            <div className="linkedin-editor-section">

                                <strong>
                                    Stratégie
                                </strong>


                                <label>
                                    Type

                                    <select
                                        value={
                                            form.content_type_id
                                        }
                                        onChange={e =>
                                            update(
                                                "content_type_id",
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            Sélectionner
                                        </option>

                                        {config.types.map(type => (

                                            <option
                                                key={type.id}
                                                value={type.id}
                                            >
                                                {type.name}
                                            </option>

                                        ))}

                                    </select>

                                </label>


                                <label>
                                    Pilier

                                    <select
                                        value={form.pillar_id}
                                        onChange={e =>
                                            update(
                                                "pillar_id",
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            Sélectionner
                                        </option>

                                        {config.pillars.map(pillar => (

                                            <option
                                                key={pillar.id}
                                                value={pillar.id}
                                            >
                                                {pillar.name}
                                            </option>

                                        ))}

                                    </select>

                                </label>


                                <label>
                                    Objectif

                                    <select
                                        value={
                                            form.objective_id
                                        }
                                        onChange={e =>
                                            update(
                                                "objective_id",
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            Sélectionner
                                        </option>

                                        {config.objectives.map(
                                            objective => (

                                                <option
                                                    key={
                                                        objective.id
                                                    }
                                                    value={
                                                        objective.id
                                                    }
                                                >
                                                    {objective.name}
                                                </option>

                                            )
                                        )}

                                    </select>

                                </label>

                            </div>


                            <div className="linkedin-editor-section">

                                <strong>
                                    Publication
                                </strong>


                                <label>
                                    Statut

                                    <select
                                        value={form.status}
                                        onChange={e =>
                                            update(
                                                "status",
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="idea">
                                            Idée
                                        </option>

                                        <option value="draft">
                                            Brouillon
                                        </option>

                                        <option value="ready">
                                            Prêt
                                        </option>

                                        <option value="scheduled">
                                            Planifié
                                        </option>

                                        <option value="published">
                                            Publié
                                        </option>

                                    </select>

                                </label>


                                <label>
                                    Date de publication

                                    <input
                                        type="datetime-local"
                                        value={
                                            form.scheduled_at
                                        }
                                        onChange={e =>
                                            update(
                                                "scheduled_at",
                                                e.target.value
                                            )
                                        }
                                    />

                                </label>

                            </div>


                            <div className="linkedin-ai-box">

                                <Sparkles size={18} />

                                <div>

                                    <strong>
                                        Assistant IA
                                    </strong>

                                    <p>
                                        Générer des angles,
                                        hooks ou variations
                                        à partir de ta stratégie.
                                    </p>

                                </div>

                            </div>

                        </aside>

                    </div>


                    <div className="linkedin-editor-footer">

                        <button
                            type="button"
                            className="btn btn-secondary-light"
                            onClick={onClose}
                        >
                            Annuler
                        </button>


                        <button
                            type="submit"
                            className="btn btn-primary"
                        >

                            <Save size={17} />

                            {content
                                ? "Enregistrer"
                                : "Créer le contenu"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}