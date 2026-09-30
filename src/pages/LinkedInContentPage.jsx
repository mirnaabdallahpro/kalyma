import { useEffect, useMemo, useState } from "react";

import {
    CalendarDays,
    FileText,
    Plus,
    Settings2
} from "lucide-react";

import ContentBoard from "../components/com/ContentBoard";
import ContentCalendar from "../components/com/ContentCalendar";
import ContentEditor from "../components/com/ContentEditor";
import ContentFilters from "../components/com/ContentFilters";
import ContentStats from "../components/com/ContentStats";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import {
    createLinkedinContent,
    getLinkedinContent,
    getLinkedinContentConfig,
    updateLinkedinContent
} from "../../services/linkedinContentService";



function LinkedInContentPage() {

    const [contents, setContents] = useState([]);

    const [config, setConfig] = useState({
        types: [],
        pillars: [],
        objectives: []
    });

    const [loading, setLoading] = useState(true);

    const [view, setView] = useState("board");

    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        type: "all",
        pillar: "all",
        objective: "all"
    });

    const [editorOpen, setEditorOpen] = useState(false);
    const [editingContent, setEditingContent] = useState(null);


    async function loadData() {

        try {

            setLoading(true);

            const [contentData, configData] =
                await Promise.all([
                    getLinkedinContent(),
                    getLinkedinContentConfig()
                ]);

            setContents(contentData);
            setConfig(configData);

        } catch (error) {

            console.error(
                "Erreur chargement contenu LinkedIn:",
                error
            );

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {
        loadData();
    }, []);


    const filteredContents = useMemo(() => {

        return contents.filter(content => {

            const search = filters.search.toLowerCase();

            const matchesSearch =
                !search ||
                content.title?.toLowerCase().includes(search) ||
                content.hook?.toLowerCase().includes(search) ||
                content.idea?.toLowerCase().includes(search);

            const matchesStatus =
                filters.status === "all" ||
                content.status === filters.status;

            const matchesType =
                filters.type === "all" ||
                content.content_type_id === filters.type;

            const matchesPillar =
                filters.pillar === "all" ||
                content.pillar_id === filters.pillar;

            const matchesObjective =
                filters.objective === "all" ||
                content.objective_id === filters.objective;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesType &&
                matchesPillar &&
                matchesObjective
            );
        });

    }, [contents, filters]);


    async function handleCreate(payload) {

        const created =
            await createLinkedinContent(payload);

        setContents(current => [
            created,
            ...current
        ]);

        setEditorOpen(false);
    }


    async function handleUpdate(id, payload) {

        const updated =
            await updateLinkedinContent(
                id,
                payload
            );

        setContents(current =>
            current.map(item =>
                item.id === id
                    ? {
                        ...item,
                        ...updated
                    }
                    : item
            )
        );

        setEditorOpen(false);
        setEditingContent(null);
    }


    function openCreate() {

        setEditingContent(null);
        setEditorOpen(true);
    }


    function openEdit(content) {

        setEditingContent(content);
        setEditorOpen(true);
    }


    const stats = {

        total: contents.length,

        ideas: contents.filter(
            item => item.status === "idea"
        ).length,

        drafts: contents.filter(
            item => item.status === "draft"
        ).length,

        scheduled: contents.filter(
            item => item.status === "scheduled"
        ).length,

        published: contents.filter(
            item => item.status === "published"
        ).length
    };


    return (
         <div className="dashboard-body">
      <div className="app">
        <Sidebar />

        <main className="main">
          <Topbar />
        <div className="content">

            <div className="linkedin-page-header">

                <div>

                    <div className="linkedin-eyebrow">
                        CONTENT OS
                    </div>

                    <h1>
                        Contenu LinkedIn
                    </h1>

                    <p>
                        Organisez vos idées, votre stratégie
                        éditoriale et vos publications au même endroit.
                    </p>

                </div>


                <div className="linkedin-header-actions">

                    <button
                        className="btn btn-secondary-light"
                        onClick={() => setView(
                            view === "board"
                                ? "calendar"
                                : "board"
                        )}
                    >

                        {view === "board" ? (
                            <>
                                <CalendarDays size={17} />
                                Calendrier
                            </>
                        ) : (
                            <>
                                <FileText size={17} />
                                Contenus
                            </>
                        )}

                    </button>


                    <button
                        className="btn btn-yellow"
                        onClick={openCreate}
                    >

                        <Plus size={18} />

                        Nouvelle idée

                    </button>

                </div>

            </div>


            <ContentStats stats={stats} />


            <div className="linkedin-content-toolbar">

                <ContentFilters
                    filters={filters}
                    setFilters={setFilters}
                    config={config}
                />

                <button className="linkedin-settings-button">

                    <Settings2 size={16} />

                    Stratégie

                </button>

            </div>


            {view === "board" ? (

                <ContentBoard
                    contents={filteredContents}
                    loading={loading}
                    onEdit={openEdit}
                />

            ) : (

                 <ContentCalendar
                    contents={filteredContents}
                    onEdit={openEdit}
                />

            )}


            {editorOpen && (

                <ContentEditor
                    content={editingContent}
                    config={config}
                    onClose={() => {
                        setEditorOpen(false);
                        setEditingContent(null);
                    }}
                    onCreate={handleCreate}
                    onUpdate={handleUpdate}
                />

            )}

        </div>
        </main>
        </div>
        </div>
    );
}


export default LinkedInContentPage;