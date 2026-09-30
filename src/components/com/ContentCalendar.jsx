import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    FileText,
    MessageCircle,
    Quote,
    Sparkles,
    Target,
    TrendingUp,
    Users
} from "lucide-react";

import { useMemo, useState } from "react";

import "./ContentCalendar.css";

const TYPE_VISUALS = {
    sensibiliser: {
        icon: Users,
        className: "type-awareness",
        label: "Sensibiliser"
    },
    eduquer: {
        icon: Sparkles,
        className: "type-education",
        label: "Éduquer"
    },
    convertir: {
        icon: Target,
        className: "type-conversion",
        label: "Convertir"
    },
    opinion: {
        icon: MessageCircle,
        className: "type-opinion",
        label: "Opinion"
    },
    storytelling: {
        icon: Quote,
        className: "type-storytelling",
        label: "Storytelling"
    },
    miroir: {
        icon: FileText,
        className: "type-mirror",
        label: "Miroir"
    },
    preuve: {
        icon: TrendingUp,
        className: "type-proof",
        label: "Preuve"
    }
};

function ContentCalendar({
    contents = [],
    onEdit
}) {
    const [currentDate, setCurrentDate] =
        useState(new Date());

    const [selectedDate, setSelectedDate] =
        useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthLabel = new Intl.DateTimeFormat(
        "fr-FR",
        {
            month: "long",
            year: "numeric"
        }
    ).format(currentDate);

    const days = useMemo(() => {
        const firstDay = new Date(
            year,
            month,
            1
        );

        const lastDay = new Date(
            year,
            month + 1,
            0
        );

        /*
         * JS :
         * dimanche = 0
         *
         * On veut :
         * lundi = 0
         * dimanche = 6
         */
        let startDay =
            firstDay.getDay() - 1;

        if (startDay < 0) {
            startDay = 6;
        }

        const totalDays =
            lastDay.getDate();

        const previousMonthLastDay =
            new Date(
                year,
                month,
                0
            ).getDate();

        const result = [];

        // jours du mois précédent
        for (
            let i = startDay - 1;
            i >= 0;
            i--
        ) {
            result.push({
                date: new Date(
                    year,
                    month - 1,
                    previousMonthLastDay - i
                ),
                currentMonth: false
            });
        }

        // jours du mois actuel
        for (
            let day = 1;
            day <= totalDays;
            day++
        ) {
            result.push({
                date: new Date(
                    year,
                    month,
                    day
                ),
                currentMonth: true
            });
        }

        // compléter la grille
        while (result.length < 42) {
            const last =
                result[result.length - 1];

            const nextDate =
                new Date(last.date);

            nextDate.setDate(
                nextDate.getDate() + 1
            );

            result.push({
                date: nextDate,
                currentMonth: false
            });
        }

        return result;
    }, [year, month]);

    function previousMonth() {
        setCurrentDate(
            new Date(
                year,
                month - 1,
                1
            )
        );
    }

    function nextMonth() {
        setCurrentDate(
            new Date(
                year,
                month + 1,
                1
            )
        );
    }

    function goToday() {
        setCurrentDate(
            new Date()
        );
    }

    function getPostsForDate(date) {
        return contents.filter(
            content => {
                if (!content.scheduled_at) {
                    return false;
                }

                const contentDate =
                    new Date(
                        content.scheduled_at
                    );

                return (
                    contentDate.getFullYear() ===
                        date.getFullYear() &&
                    contentDate.getMonth() ===
                        date.getMonth() &&
                    contentDate.getDate() ===
                        date.getDate()
                );
            }
        );
    }

    function isToday(date) {
        const today = new Date();

        return (
            date.getDate() ===
                today.getDate() &&
            date.getMonth() ===
                today.getMonth() &&
            date.getFullYear() ===
                today.getFullYear()
        );
    }

    function formatTime(date) {
        return new Intl.DateTimeFormat(
            "fr-FR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        ).format(date);
    }

    return (
        <div className="content-calendar">

            <div className="content-calendar-header">

                <div>
                    <div className="content-calendar-eyebrow">
                        PLANNING ÉDITORIAL
                    </div>

                    <h2>
                        {capitalize(
                            monthLabel
                        )}
                    </h2>

                    <p>
                        Visualisez vos publications
                        et identifiez les espaces
                        encore disponibles.
                    </p>
                </div>

                <div className="content-calendar-actions">

                    <button
                        type="button"
                        className="calendar-today"
                        onClick={goToday}
                    >
                        Aujourd'hui
                    </button>

                    <div className="calendar-navigation">

                        <button
                            type="button"
                            onClick={
                                previousMonth
                            }
                        >
                            <ArrowLeft
                                size={16}
                            />
                        </button>

                        <button
                            type="button"
                            onClick={
                                nextMonth
                            }
                        >
                            <ArrowRight
                                size={16}
                            />
                        </button>

                    </div>

                </div>

            </div>

            <div className="content-calendar-layout">

                <div className="content-calendar-main">

                    <div className="calendar-weekdays">
                        {[
                            "Lun",
                            "Mar",
                            "Mer",
                            "Jeu",
                            "Ven",
                            "Sam",
                            "Dim"
                        ].map(day => (
                            <div key={day}>
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="calendar-grid">

                        {days.map(
                            ({
                                date,
                                currentMonth
                            }) => {

                                const posts =
                                    getPostsForDate(
                                        date
                                    );

                                const dateKey =
                                    date.toISOString();

                                return (
                                    <div
                                        key={
                                            dateKey
                                        }
                                        className={`
                                            calendar-day
                                            ${
                                                !currentMonth
                                                    ? "is-other-month"
                                                    : ""
                                            }
                                            ${
                                                isToday(
                                                    date
                                                )
                                                    ? "is-today"
                                                    : ""
                                            }
                                            ${
                                                selectedDate ===
                                                dateKey
                                                    ? "is-selected"
                                                    : ""
                                            }
                                        `}
                                        onClick={() =>
                                            setSelectedDate(
                                                dateKey
                                            )
                                        }
                                    >

                                        <div className="calendar-day-header">

                                            <span>
                                                {
                                                    date.getDate()
                                                }
                                            </span>

                                            {posts.length >
                                                0 && (
                                                <small>
                                                    {
                                                        posts.length
                                                    }
                                                </small>
                                            )}

                                        </div>

                                        <div className="calendar-day-posts">

                                            {posts
                                                .slice(
                                                    0,
                                                    3
                                                )
                                                .map(
                                                    post => (
                                                        <CalendarPost
                                                            key={
                                                                post.id
                                                            }
                                                            post={
                                                                post
                                                            }
                                                            onEdit={
                                                                onEdit
                                                            }
                                                            formatTime={
                                                                formatTime
                                                            }
                                                        />
                                                    )
                                                )}

                                            {posts.length >
                                                3 && (
                                                <button
                                                    type="button"
                                                    className="calendar-more"
                                                >
                                                    +
                                                    {posts.length -
                                                        3}{" "}
                                                    autres
                                                </button>
                                            )}

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                </div>

                <CalendarSidebar
                    contents={contents}
                    selectedDate={
                        selectedDate
                    }
                    onEdit={onEdit}
                />

            </div>

        </div>
    );
}

function CalendarPost({
    post,
    onEdit,
    formatTime
}) {
    const visual =
        getTypeVisual(post);

    const Icon =
        visual.icon;

    const date =
        post.scheduled_at
            ? new Date(
                  post.scheduled_at
              )
            : null;

    return (
        <button
            type="button"
            className={`calendar-post ${visual.className}`}
            onClick={event => {
                event.stopPropagation();
                onEdit(post);
            }}
        >

            <div className="calendar-post-visual">

                <Icon size={12} />

            </div>

            <div className="calendar-post-content">

                <strong>
                    {post.title ||
                        "Sans titre"}
                </strong>

                <span>
                    {date
                        ? formatTime(date)
                        : ""}
                </span>

            </div>

        </button>
    );
}

function CalendarSidebar({
    contents,
    selectedDate,
    onEdit
}) {
    const posts = selectedDate
        ? contents.filter(
              content => {
                  if (
                      !content.scheduled_at
                  ) {
                      return false;
                  }

                  const date =
                      new Date(
                          content.scheduled_at
                      );

                  const selected =
                      new Date(
                          selectedDate
                      );

                  return (
                      date.getFullYear() ===
                          selected.getFullYear() &&
                      date.getMonth() ===
                          selected.getMonth() &&
                      date.getDate() ===
                          selected.getDate()
                  );
              }
          )
        : [];

    return (
        <aside className="calendar-sidebar">

            <div className="calendar-sidebar-header">

                <CalendarDays
                    size={18}
                />

                <div>
                    <strong>
                        Journée
                    </strong>

                    <span>
                        {selectedDate
                            ? new Intl.DateTimeFormat(
                                  "fr-FR",
                                  {
                                      day: "numeric",
                                      month: "long"
                                  }
                              ).format(
                                  new Date(
                                      selectedDate
                                  )
                              )
                            : "Sélectionnez un jour"}
                    </span>
                </div>

            </div>

            {!selectedDate ? (
                <div className="calendar-sidebar-empty">
                    Cliquez sur une journée
                    pour voir les contenus
                    planifiés.
                </div>
            ) : posts.length === 0 ? (
                <div className="calendar-sidebar-empty">
                    Aucun contenu prévu
                    pour cette journée.
                </div>
            ) : (
                <div className="calendar-sidebar-posts">

                    {posts.map(post => (
                        <button
                            key={post.id}
                            type="button"
                            onClick={() =>
                                onEdit(post)
                            }
                            className="calendar-sidebar-post"
                        >

                            <div
                                className={`sidebar-post-type ${getTypeVisual(
                                    post
                                ).className}`}
                            >
                                {(() => {
                                    const Icon =
                                        getTypeVisual(
                                            post
                                        ).icon;

                                    return (
                                        <Icon
                                            size={16}
                                        />
                                    );
                                })()}
                            </div>

                            <div>
                                <strong>
                                    {post.title ||
                                        "Sans titre"}
                                </strong>

                                <span>
                                    {post.hook ||
                                        "Aucun hook"}
                                </span>
                            </div>

                        </button>
                    ))}

                </div>
            )}

        </aside>
    );
}

function getTypeVisual(post) {
    const slug =
        post.content_type?.slug ||
        post.type_slug ||
        post.content_type
            ?.name
            ?.toLowerCase()
            ?.normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .replace(
                /\s+/g,
                "_"
            );

    return (
        TYPE_VISUALS[slug] || {
            icon: FileText,
            className:
                "type-default",
            label:
                post.content_type
                    ?.name ||
                "Contenu"
        }
    );
}

function capitalize(value) {
    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );
}

export default ContentCalendar;