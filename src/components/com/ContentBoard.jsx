import {
    CheckCircle2,
    Clock3,
    FileEdit,
    Lightbulb
} from "lucide-react";

import ContentCard from "./ContentCard";


const columns = [

    {
        id: "idea",
        label: "Idées",
        icon: Lightbulb
    },

    {
        id: "draft",
        label: "Brouillons",
        icon: FileEdit
    },

    {
        id: "ready",
        label: "Prêts",
        icon: CheckCircle2
    },

    {
        id: "scheduled",
        label: "Planifiés",
        icon: Clock3
    },

    {
        id: "published",
        label: "Publiés",
        icon: CheckCircle2
    }

];


export default function ContentBoard({
    contents,
    loading,
    onEdit
}) {

    if (loading) {

        return (
            <div className="linkedin-loading">
                Chargement de votre contenu...
            </div>
        );

    }


    return (

        <div className="linkedin-board">

            {columns.map(column => {

                const Icon = column.icon;

                const columnContents =
                    contents.filter(
                        content =>
                            content.status === column.id
                    );


                return (

                    <div
                        className="linkedin-column"
                        key={column.id}
                    >

                        <div className="linkedin-column-head">

                            <div>

                                <Icon size={16} />

                                <strong>
                                    {column.label}
                                </strong>

                            </div>

                            <span>
                                {columnContents.length}
                            </span>

                        </div>


                        <div className="linkedin-column-body">

                            {columnContents.map(content => (

                                <ContentCard
                                    key={content.id}
                                    content={content}
                                    onClick={() =>
                                        onEdit(content)
                                    }
                                />

                            ))}


                            {columnContents.length === 0 && (

                                <div className="linkedin-empty-column">

                                    Aucun contenu

                                </div>

                            )}

                        </div>

                    </div>

                );

            })}

        </div>
    );
}