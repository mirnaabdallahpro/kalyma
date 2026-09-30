import { Search } from "lucide-react";


export default function ContentFilters({
    filters,
    setFilters,
    config
}) {

    function update(key, value) {

        setFilters(current => ({
            ...current,
            [key]: value
        }));

    }


    return (

        <div className="linkedin-filters">

            <div className="linkedin-search">

                <Search size={16} />

                <input
                    value={filters.search}
                    onChange={e =>
                        update("search", e.target.value)
                    }
                    placeholder="Rechercher une idée..."
                />

            </div>


            <select
                value={filters.status}
                onChange={e =>
                    update("status", e.target.value)
                }
            >
                <option value="all">
                    Tous les statuts
                </option>

                <option value="idea">
                    Idées
                </option>

                <option value="draft">
                    Brouillons
                </option>

                <option value="ready">
                    Prêts
                </option>

                <option value="scheduled">
                    Planifiés
                </option>

                <option value="published">
                    Publiés
                </option>
            </select>


            <select
                value={filters.type}
                onChange={e =>
                    update("type", e.target.value)
                }
            >

                <option value="all">
                    Tous les types
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


            <select
                value={filters.pillar}
                onChange={e =>
                    update("pillar", e.target.value)
                }
            >

                <option value="all">
                    Tous les piliers
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


            <select
                value={filters.objective}
                onChange={e =>
                    update("objective", e.target.value)
                }
            >

                <option value="all">
                    Tous les objectifs
                </option>

                {config.objectives.map(objective => (

                    <option
                        key={objective.id}
                        value={objective.id}
                    >
                        {objective.name}
                    </option>

                ))}

            </select>

        </div>
    );
}