import {
    ArrowUpRight,
    CalendarDays
} from "lucide-react";


export default function ContentCard({
    content,
    onClick
}) {

    return (

        <article
            className="linkedin-content-card"
            onClick={onClick}
        >

            <div className="linkedin-card-meta">

                {content.content_type && (

                    <span
                        className="linkedin-pill"
                        style={{
                            background:
                                `${content.content_type.color}22`,
                            color:
                                content.content_type.color
                        }}
                    >
                        {content.content_type.name}
                    </span>

                )}

                {content.objective && (

                    <span className="linkedin-objective-pill">

                        {content.objective.name}

                    </span>

                )}

            </div>


            <h3>
                {content.title ||
                    content.hook ||
                    "Nouvelle idée"}
            </h3>


            {content.idea && (

                <p>
                    {content.idea}
                </p>

            )}


            <div className="linkedin-card-footer">

                {content.pillar && (

                    <span>
                        {content.pillar.name}
                    </span>

                )}


                {content.scheduled_at && (

                    <span className="linkedin-card-date">

                        <CalendarDays size={13} />

                        {new Date(
                            content.scheduled_at
                        ).toLocaleDateString(
                            "fr-FR",
                            {
                                day: "numeric",
                                month: "short"
                            }
                        )}

                    </span>

                )}


                <ArrowUpRight
                    size={15}
                    className="linkedin-card-arrow"
                />

            </div>

        </article>
    );
}