import {
    Document,
    Page,
    PDFDownloadLink,
    StyleSheet,
    Text,
    View,
} from "@react-pdf/renderer";


// ============================================================
// KALYMA — CHARTE
// ============================================================

const COLORS = {
  primary: "#0e2a47",
  secondary: "#e4a02b",
  background: "#f4efe6",
  white: "#ffffff",
  text: "#172b3a",
  muted: "#667788",
  border: "#dce3e8",

  excellent: "#238b5a",
  good: "#3678a8",
  attention: "#c88a18",
  critical: "#c94c4c",
};


// ============================================================
// HELPERS
// ============================================================

function getStatusLabel(status) {
  switch (status) {
    case "excellent":
      return "Excellent";

    case "good":
      return "Solide";

    case "attention":
      return "À renforcer";

    case "critical":
      return "Critique";

    default:
      return "À analyser";
  }
}


function getStatusColor(status) {
  switch (status) {
    case "excellent":
      return COLORS.excellent;

    case "good":
      return COLORS.good;

    case "attention":
      return COLORS.attention;

    case "critical":
      return COLORS.critical;

    default:
      return COLORS.muted;
  }
}


function getPriorityLabel(priority) {
  switch (priority) {
    case "high":
      return "Priorité élevée";

    case "medium":
      return "Priorité moyenne";

    case "low":
      return "Priorité faible";

    default:
      return "Priorité";
  }
}


function getImpactLabel(impact) {
  switch (impact) {
    case "high":
      return "Impact élevé";

    case "medium":
      return "Impact moyen";

    case "low":
      return "Impact faible";

    default:
      return "Impact";
  }
}


function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}


// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({

  page: {
    paddingTop: 42,
    paddingBottom: 50,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },


  coverPage: {
    backgroundColor: COLORS.primary,
    padding: 48,
    position: "relative",
  },


  coverTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },


  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
    letterSpacing: 1,
  },


  logoAccent: {
    color: COLORS.secondary,
  },


  coverLabel: {
    fontSize: 9,
    color: "#b8c7d4",
    textTransform: "uppercase",
    letterSpacing: 2,
  },


  coverContent: {
    marginTop: 170,
  },


  coverEyebrow: {
    fontSize: 11,
    color: COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 18,
  },


  coverTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: COLORS.white,
    lineHeight: 1.15,
    marginBottom: 16,
  },


  coverCompany: {
    fontSize: 18,
    color: "#dce6ed",
    marginBottom: 10,
  },


  coverDate: {
    fontSize: 10,
    color: "#9fb1c0",
  },


  coverScoreContainer: {
    position: "absolute",
    bottom: 55,
    right: 48,
    width: 125,
    height: 125,
    borderRadius: 62.5,
    borderWidth: 3,
    borderColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
  },


  coverScore: {
    fontSize: 36,
    fontWeight: "bold",
    color: COLORS.white,
  },


  coverScoreSmall: {
    fontSize: 11,
    color: "#b8c7d4",
  },


  coverFooter: {
    position: "absolute",
    bottom: 30,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
  },


  coverFooterText: {
    fontSize: 8,
    color: "#8297a8",
  },


  sectionHeader: {
    marginBottom: 22,
  },


  eyebrow: {
    fontSize: 8,
    color: COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 7,
  },


  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
  },


  subtitle: {
    fontSize: 9,
    color: COLORS.muted,
    marginTop: 6,
    lineHeight: 1.5,
  },


  scoreCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },


  scoreCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },


  scoreNumber: {
    fontSize: 27,
    fontWeight: "bold",
    color: COLORS.white,
  },


  scoreOutOf: {
    fontSize: 8,
    color: "#b8c7d4",
  },


  scoreTextContainer: {
    flex: 1,
  },


  scoreTitle: {
    fontSize: 11,
    color: COLORS.secondary,
    fontWeight: "bold",
    marginBottom: 7,
  },


  scoreSummary: {
    fontSize: 10,
    color: COLORS.white,
    lineHeight: 1.5,
  },


  infoCard: {
    backgroundColor: "#f8fafb",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 14,
  },


  infoCardTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },


  bodyText: {
    fontSize: 9,
    lineHeight: 1.55,
    color: COLORS.text,
  },


  strengthsGrid: {
    marginTop: 6,
  },


  strength: {
    flexDirection: "row",
    marginBottom: 8,
  },


  strengthBullet: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: COLORS.excellent,
    color: COLORS.white,
    fontSize: 8,
    textAlign: "center",
    paddingTop: 3,
    marginRight: 8,
  },


  strengthText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
  },


  dimension: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 14,
    padding: 15,
    backgroundColor: COLORS.white,
  },


  dimensionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 9,
  },


  dimensionTitleContainer: {
    flex: 1,
    paddingRight: 10,
  },


  dimensionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },


  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },


  statusText: {
    color: COLORS.white,
    fontSize: 7,
    fontWeight: "bold",
  },


  dimensionScore: {
    fontSize: 17,
    fontWeight: "bold",
    color: COLORS.primary,
  },


  findingLabel: {
    fontSize: 8,
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },


  finding: {
    fontSize: 9,
    lineHeight: 1.5,
    marginBottom: 12,
  },


  recommendationBox: {
    backgroundColor: "#f8f4eb",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.secondary,
    padding: 11,
    marginBottom: 10,
  },


  recommendationLabel: {
    fontSize: 8,
    color: COLORS.secondary,
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 5,
  },


  recommendation: {
    fontSize: 9,
    lineHeight: 1.5,
  },


  whyBox: {
    backgroundColor: "#f5f8fa",
    borderRadius: 5,
    padding: 9,
    marginBottom: 9,
  },


  whyTitle: {
    fontSize: 8,
    color: COLORS.primary,
    fontWeight: "bold",
    marginBottom: 4,
  },


  whyText: {
    fontSize: 8.5,
    lineHeight: 1.45,
    color: COLORS.text,
  },


  evidenceBox: {
    marginTop: 4,
  },


  evidenceTitle: {
    fontSize: 8,
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },


  evidenceItem: {
    flexDirection: "row",
    marginBottom: 5,
  },


  evidenceSource: {
    width: 110,
    fontSize: 7.5,
    fontWeight: "bold",
    color: COLORS.primary,
  },


  evidenceObservation: {
    flex: 1,
    fontSize: 7.5,
    color: COLORS.muted,
    lineHeight: 1.4,
  },


  priority: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
  },


  priorityNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    textAlign: "center",
    paddingTop: 8,
    fontSize: 10,
    fontWeight: "bold",
    marginRight: 12,
  },


  priorityContent: {
    flex: 1,
  },


  priorityTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 6,
  },


  priorityDescription: {
    fontSize: 9,
    lineHeight: 1.5,
    marginBottom: 8,
  },


  priorityReason: {
    backgroundColor: "#f8fafb",
    padding: 9,
    borderRadius: 5,
    marginBottom: 8,
  },


  priorityReasonText: {
    fontSize: 8,
    lineHeight: 1.45,
  },


  priorityMeta: {
    flexDirection: "row",
    gap: 7,
  },


  metaBadge: {
    backgroundColor: "#edf2f5",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },


  metaText: {
    fontSize: 7,
    color: COLORS.primary,
    fontWeight: "bold",
  },


  actionTable: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    overflow: "hidden",
  },


  actionHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    padding: 9,
  },


  actionHeaderText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: "bold",
  },


  actionRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },


  actionNumber: {
    width: 28,
    fontSize: 8,
    fontWeight: "bold",
    color: COLORS.primary,
  },


  actionTitle: {
    flex: 1,
    fontSize: 8,
    color: COLORS.text,
    lineHeight: 1.4,
  },


  actionImpact: {
    width: 65,
    fontSize: 8,
    color: COLORS.secondary,
    fontWeight: "bold",
  },


  footer: {
    position: "absolute",
    bottom: 22,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 7,
  },


  footerText: {
    fontSize: 7,
    color: COLORS.muted,
  },


  pageNumber: {
    fontSize: 7,
    color: COLORS.muted,
  },


  closing: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 22,
    marginTop: 20,
  },


  closingTitle: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 7,
  },


  closingText: {
    color: COLORS.white,
    fontSize: 9,
    lineHeight: 1.5,
  },

});


// ============================================================
// FOOTER
// ============================================================

function PDFHeaderFooter() {
  return (
    <View style={styles.footer} fixed>

      <Text style={styles.footerText}>
        Kalyma — Diagnostic stratégique
      </Text>

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} / ${totalPages}`
        }
      />

    </View>
  );
}


// ============================================================
// COVER
// ============================================================

function CoverPage({
  profile,
  diagnostic,
}) {

  return (
    <Page
      size="A4"
      style={styles.coverPage}
    >

      <View style={styles.coverTop}>

        <Text style={styles.logo}>
          Kalyma
          <Text style={styles.logoAccent}>
            .
          </Text>
        </Text>

        <Text style={styles.coverLabel}>
          Diagnostic stratégique
        </Text>

      </View>


      <View style={styles.coverContent}>

        <Text style={styles.coverEyebrow}>
          Analyse business
        </Text>

        <Text style={styles.coverTitle}>
          Diagnostic{"\n"}
          stratégique
        </Text>

        <Text style={styles.coverCompany}>
          {profile?.companyName ||
            profile?.company_name ||
            "Votre entreprise"}
        </Text>

        <Text style={styles.coverDate}>
          Généré le {formatDate()}
        </Text>

      </View>


      <View style={styles.coverScoreContainer}>

        <Text style={styles.coverScore}>
          {diagnostic?.overallScore ?? 0}
        </Text>

        <Text style={styles.coverScoreSmall}>
          / 100
        </Text>

      </View>


      <View style={styles.coverFooter}>

        <Text style={styles.coverFooterText}>
          Analyse personnalisée par Kalyma
        </Text>

        <Text style={styles.coverFooterText}>
          Confidentiel
        </Text>

      </View>

    </Page>
  );
}


// ============================================================
// SUMMARY
// ============================================================

function SummaryPage({
  diagnostic,
}) {

  return (
    <Page
      size="A4"
      style={styles.page}
    >

      <PDFHeaderFooter />

      <View style={styles.sectionHeader}>

        <Text style={styles.eyebrow}>
          01 — Synthèse
        </Text>

        <Text style={styles.title}>
          Vue d'ensemble
        </Text>

        <Text style={styles.subtitle}>
          Les principaux enseignements du diagnostic
          stratégique.
        </Text>

      </View>


      <View style={styles.scoreCard}>

        <View style={styles.scoreCircle}>

          <Text style={styles.scoreNumber}>
            {diagnostic?.overallScore ?? 0}
          </Text>

          <Text style={styles.scoreOutOf}>
            / 100
          </Text>

        </View>


        <View style={styles.scoreTextContainer}>

          <Text style={styles.scoreTitle}>
            SCORE GLOBAL
          </Text>

          <Text style={styles.scoreSummary}>
            {diagnostic?.summary ||
              "Aucune synthèse disponible."}
          </Text>

        </View>

      </View>


      {diagnostic?.strengths?.length > 0 && (

        <View style={styles.infoCard}>

          <Text style={styles.infoCardTitle}>
            Vos points forts
          </Text>

          <View style={styles.strengthsGrid}>

            {diagnostic.strengths.map(
              (strength, index) => (

                <View
                  style={styles.strength}
                  key={index}
                >

                  <Text style={styles.strengthBullet}>
                    ✓
                  </Text>

                  <Text style={styles.strengthText}>
                    {strength}
                  </Text>

                </View>

              )
            )}

          </View>

        </View>

      )}


      <View style={styles.infoCard}>

        <Text style={styles.infoCardTitle}>
          Ce que ce diagnostic cherche à identifier
        </Text>

        <Text style={styles.bodyText}>
          Le diagnostic analyse neuf dimensions
          fondamentales de votre business afin
          d'identifier les forces, les fragilités,
          les incohérences et les leviers prioritaires
          à travailler maintenant.
        </Text>

      </View>

    </Page>
  );
}


// ============================================================
// DIMENSION
// ============================================================

function Dimension({
  point,
}) {

  return (
    <View
      style={styles.dimension}
      wrap={false}
    >

      <View style={styles.dimensionHeader}>

        <View style={styles.dimensionTitleContainer}>

          <Text style={styles.dimensionTitle}>
            {point.label}
          </Text>

          <View
            style={{
              ...styles.statusBadge,
              backgroundColor:
                getStatusColor(point.status),
            }}
          >

            <Text style={styles.statusText}>
              {getStatusLabel(point.status)}
            </Text>

          </View>

        </View>


        <Text style={styles.dimensionScore}>
          {point.score}/100
        </Text>

      </View>


      <Text style={styles.findingLabel}>
        Constat
      </Text>

      <Text style={styles.finding}>
        {point.finding}
      </Text>


      {point.recommendation && (

        <View style={styles.recommendationBox}>

          <Text style={styles.recommendationLabel}>
            Recommandation
          </Text>

          <Text style={styles.recommendation}>
            {point.recommendation}
          </Text>

        </View>

      )}


      {point.recommendationReason && (

        <View style={styles.whyBox}>

          <Text style={styles.whyTitle}>
            Pourquoi cette recommandation ?
          </Text>

          <Text style={styles.whyText}>
            {point.recommendationReason}
          </Text>

        </View>

      )}


      {point.evidence?.length > 0 && (

        <View style={styles.evidenceBox}>

          <Text style={styles.evidenceTitle}>
            Éléments de preuve
          </Text>

          {point.evidence.map(
            (evidence, index) => (

              <View
                style={styles.evidenceItem}
                key={index}
              >

                <Text style={styles.evidenceSource}>
                  {evidence.source}
                </Text>

                <Text style={styles.evidenceObservation}>
                  {evidence.observation}
                </Text>

              </View>

            )
          )}

        </View>

      )}

    </View>
  );
}


// ============================================================
// DIMENSIONS PAGE
// ============================================================

function DimensionsPage({
  diagnostic,
}) {

  return (
    <Page
      size="A4"
      style={styles.page}
    >

      <PDFHeaderFooter />

      <View style={styles.sectionHeader}>

        <Text style={styles.eyebrow}>
          02 — Analyse
        </Text>

        <Text style={styles.title}>
          Les fondations du business
        </Text>

        <Text style={styles.subtitle}>
          Analyse détaillée des neuf dimensions
          stratégiques.
        </Text>

      </View>


      {diagnostic?.points?.map(
        (point) => (
          <Dimension
            key={point.key}
            point={point}
          />
        )
      )}

    </Page>
  );
}


// ============================================================
// PRIORITIES
// ============================================================

function PrioritiesPage({
  diagnostic,
}) {

  return (
    <Page
      size="A4"
      style={styles.page}
    >

      <PDFHeaderFooter />

      <View style={styles.sectionHeader}>

        <Text style={styles.eyebrow}>
          03 — Action
        </Text>

        <Text style={styles.title}>
          Vos priorités stratégiques
        </Text>

        <Text style={styles.subtitle}>
          Les actions qui doivent concentrer votre
          attention maintenant.
        </Text>

      </View>


      {diagnostic?.priorities?.map(
        (priority, index) => (

          <View
            style={styles.priority}
            key={index}
            wrap={false}
          >

            <Text style={styles.priorityNumber}>
              {index + 1}
            </Text>


            <View style={styles.priorityContent}>

              <Text style={styles.priorityTitle}>
                {priority.title}
              </Text>


              <Text style={styles.priorityDescription}>
                {priority.description}
              </Text>


              {priority.reason && (

                <View style={styles.priorityReason}>

                  <Text style={styles.priorityReasonText}>
                    <Text style={{ fontWeight: "bold" }}>
                      Pourquoi maintenant :
                    </Text>{" "}
                    {priority.reason}
                  </Text>

                </View>

              )}


              <View style={styles.priorityMeta}>

                <View style={styles.metaBadge}>

                  <Text style={styles.metaText}>
                    {getPriorityLabel(
                      priority.priority
                    )}
                  </Text>

                </View>


                <View style={styles.metaBadge}>

                  <Text style={styles.metaText}>
                    {getImpactLabel(
                      priority.impact
                    )}
                  </Text>

                </View>

              </View>

            </View>

          </View>

        )
      )}

    </Page>
  );
}


// ============================================================
// ACTION PLAN
// ============================================================

function ActionPlanPage({
  diagnostic,
}) {

  return (
    <Page
      size="A4"
      style={styles.page}
    >

      <PDFHeaderFooter />

      <View style={styles.sectionHeader}>

        <Text style={styles.eyebrow}>
          04 — Plan d'action
        </Text>

        <Text style={styles.title}>
          Passer du diagnostic à l'action
        </Text>

        <Text style={styles.subtitle}>
          Les priorités peuvent être transformées
          directement en actions opérationnelles.
        </Text>

      </View>


      <View style={styles.actionTable}>

        <View style={styles.actionHeader}>

          <Text
            style={[
              styles.actionHeaderText,
              { width: 28 },
            ]}
          >
            #
          </Text>

          <Text
            style={[
              styles.actionHeaderText,
              { flex: 1 },
            ]}
          >
            Action prioritaire
          </Text>

          <Text
            style={[
              styles.actionHeaderText,
              { width: 65 },
            ]}
          >
            Impact
          </Text>

        </View>


        {diagnostic?.priorities?.map(
          (priority, index) => (

            <View
              style={styles.actionRow}
              key={index}
            >

              <Text style={styles.actionNumber}>
                {index + 1}
              </Text>

              <Text style={styles.actionTitle}>
                {priority.title}
              </Text>

              <Text style={styles.actionImpact}>
                {getImpactLabel(
                  priority.impact
                )}
              </Text>

            </View>

          )
        )}

      </View>


      <View style={styles.closing}>

        <Text style={styles.closingTitle}>
          Le prochain mouvement
        </Text>

        <Text style={styles.closingText}>
          Le diagnostic n'a de valeur que s'il permet
          de prendre de meilleures décisions. Concentrez
          votre énergie sur les priorités identifiées
          avant de chercher à résoudre tous les sujets
          simultanément.
        </Text>

      </View>

    </Page>
  );
}


// ============================================================
// DOCUMENT
// ============================================================

export function DiagnosticPDF({
  diagnostic,
  profile,
}) {

  return (
    <Document
      title="Diagnostic stratégique Kalyma"
      author="Kalyma"
      subject="Diagnostic stratégique business"
      language="fr-FR"
    >

      <CoverPage
        profile={profile}
        diagnostic={diagnostic}
      />


      <SummaryPage
        diagnostic={diagnostic}
      />


      <DimensionsPage
        diagnostic={diagnostic}
      />


      <PrioritiesPage
        diagnostic={diagnostic}
      />


      <ActionPlanPage
        diagnostic={diagnostic}
      />

    </Document>
  );
}


// ============================================================
// DOWNLOAD BUTTON
// ============================================================

export default function DiagnosticPDFButton({
  diagnostic,
  profile,
}) {

  if (!diagnostic) {
    return null;
  }


  const companyName =
    profile?.companyName ||
    profile?.company_name ||
    "business";


  const fileName =
    `Kalyma-Diagnostic-${companyName
      .replace(/[^a-zA-Z0-9À-ÿ]/g, "-")
      .replace(/-+/g, "-")}.pdf`;


  return (

    <PDFDownloadLink
      document={
        <DiagnosticPDF
          diagnostic={diagnostic}
          profile={profile}
        />
      }
      fileName={fileName}
      style={{
        textDecoration: "none",
      }}
    >

      {({
        loading,
      }) => (

        <button
          type="button"
          className="diagnostic-pdf-button"
          disabled={loading}
        >

          {loading
            ? "Préparation du PDF..."
            : "Télécharger le diagnostic PDF"}

        </button>

      )}

    </PDFDownloadLink>

  );
}
