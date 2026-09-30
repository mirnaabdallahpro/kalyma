import {
    CheckCircle2,
    Clock3,
    FileText,
    Lightbulb
} from "lucide-react";


export default function ContentStats({ stats }) {

    return (

        <div className="linkedin-content-stats">

            <div className="content-stat-card">

                <div className="content-stat-icon">
                    <FileText size={18} />
                </div>

                <div>
                    <span>Total</span>
                    <strong>{stats.total}</strong>
                </div>

            </div>


            <div className="content-stat-card">

                <div className="content-stat-icon">
                    <Lightbulb size={18} />
                </div>

                <div>
                    <span>Idées</span>
                    <strong>{stats.ideas}</strong>
                </div>

            </div>


            <div className="content-stat-card">

                <div className="content-stat-icon">
                    <Clock3 size={18} />
                </div>

                <div>
                    <span>Planifiés</span>
                    <strong>{stats.scheduled}</strong>
                </div>

            </div>


            <div className="content-stat-card">

                <div className="content-stat-icon success">
                    <CheckCircle2 size={18} />
                </div>

                <div>
                    <span>Publiés</span>
                    <strong>{stats.published}</strong>
                </div>

            </div>

        </div>
    );
}