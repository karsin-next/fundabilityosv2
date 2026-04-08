import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { ScoringResult } from "@/lib/scoring";

// Optionally register a font, but we'll stick to standard Helvetica for max compatibility 
// unless custom fonts are pre-registered via CDN.

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#F8F9FA",
    color: "#022F42",
    padding: 40,
    fontFamily: "Helvetica",
  },
  coverPage: {
    backgroundColor: "#022F42",
    color: "#FFFFFF",
    padding: 60,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD800",
    marginBottom: 60,
  },
  coverTitle: {
    fontSize: 42,
    fontWeight: "heavy",
    marginBottom: 15,
  },
  badge: {
    backgroundColor: "#FFD800",
    color: "#022F42",
    padding: "6 12",
    borderRadius: 4,
    fontSize: 12,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#022F42",
    marginBottom: 10,
    textTransform: "uppercase",
    borderBottomWidth: 2,
    borderBottomColor: "#FFD800",
    paddingBottom: 4,
  },
  subTitle: {
    fontSize: 12,
    color: "#022F42",
    opacity: 0.6,
    marginBottom: 20,
    textTransform: "uppercase",
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 15,
    color: "#333333",
  },
  // Gap Cards
  gapCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
  },
  gapCardHighPriority: { borderLeftColor: "#EF4444" },
  gapCardMedPriority: { borderLeftColor: "#F59E0B" },
  gapCardLowPriority: { borderLeftColor: "#10B981" },
  gapTitleRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  gapTitle: { fontSize: 11, fontWeight: "bold", textTransform: "uppercase" },
  gapTitleHigh: { color: "#EF4444" },
  gapTitleMed: { color: "#F59E0B" },
  gapTitleLow: { color: "#10B981" },
  gapText: { fontSize: 10, lineHeight: 1.4, color: "#444444", marginBottom: 6 },
  gapFix: { fontSize: 10, color: "#000000", fontWeight: "bold" },
  
  // Grid / Layouts
  gridRow: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },
  gridCol: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 4,
  },
  colLabel: { fontSize: 9, opacity: 0.6, textTransform: "uppercase", marginBottom: 5 },
  colValue: { fontSize: 13, fontWeight: "bold", color: "#022F42" },
  
  // Action Plan
  actionPlanRow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 12,
  },
  actionWeek: {
    width: 24,
    height: 24,
    backgroundColor: "#FFD800",
    color: "#022F42",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 6,
    borderRadius: 12,
    marginRight: 12,
  },
  actionTextBlock: { flex: 1 },
  actionMain: { fontSize: 11, fontWeight: "bold", marginBottom: 3 },
  actionSub: { fontSize: 10, color: "#666666" },
});

export default function FundabilityReportPDF({ report }: { report: ScoringResult }) {
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View>
          <Text style={styles.logo}>FundabilityOS</Text>
          <Text style={styles.badge}>{report.band} · Score {report.score}/100</Text>
          <Text style={styles.coverTitle}>Investor-Ready Report</Text>
          <Text style={{ fontSize: 14, opacity: 0.7 }}>Full Gap Analysis & Action Plan</Text>
        </View>
        <View>
          <Text style={{ fontSize: 10, opacity: 0.5, marginBottom: 5 }}>GENERATED ON</Text>
          <Text style={{ fontSize: 12 }}>{dateStr}</Text>
        </View>
      </Page>

      {/* Page 2: Executive Summary & Financials */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <Text style={styles.paragraph}>{report.summary_paragraph}</Text>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Financial Snapshot</Text>
        <View style={styles.gridRow}>
          <View style={styles.gridCol}>
            <Text style={styles.colLabel}>Monthly Revenue</Text>
            <Text style={styles.colValue}>${Number(report.financial_snapshot.monthly_revenue_usd).toLocaleString()}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.colLabel}>Monthly Burn</Text>
            <Text style={styles.colValue}>${Number(report.financial_snapshot.burn_rate_usd).toLocaleString()}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.colLabel}>Runway</Text>
            <Text style={styles.colValue}>{report.financial_snapshot.runway_months} months</Text>
          </View>
        </View>
        <View style={styles.gridRow}>
          <View style={styles.gridCol}>
            <Text style={styles.colLabel}>Team Composition</Text>
            <Text style={[styles.colValue, { fontSize: 11 }]}>{report.team_overview.composition}</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.colLabel}>Domain Fit</Text>
            <Text style={[styles.colValue, { fontSize: 11 }]}>{report.team_overview.domain_fit}</Text>
          </View>
        </View>
      </Page>

      {/* Page 3: Gap Analysis */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Top 3 Gaps to Fix Before Raising</Text>
        <Text style={styles.subTitle}>Investors will push back on these areas</Text>
        
        {report.top_3_gaps.map((gap, i) => {
          const isHigh = gap.priority === "high";
          const isMed = gap.priority === "medium";
          
          return (
            <View key={i} style={[
              styles.gapCard, 
              isHigh ? styles.gapCardHighPriority : isMed ? styles.gapCardMedPriority : styles.gapCardLowPriority
            ]}>
              <View style={styles.gapTitleRow}>
                <Text style={[
                  styles.gapTitle,
                  isHigh ? styles.gapTitleHigh : isMed ? styles.gapTitleMed : styles.gapTitleLow
                ]}>
                  {gap.dimension}
                </Text>
                <Text style={{ fontSize: 10, color: "#666" }}>{gap.score} / {gap.max} pts</Text>
              </View>
              <Text style={styles.gapText}>{gap.explanation}</Text>
              <Text style={styles.gapFix}>→ Fix: {gap.fix}</Text>
            </View>
          );
        })}

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>30-Day Action Plan</Text>
        <View>
          {report.action_items.map((item, i) => (
            <View key={i} style={styles.actionPlanRow}>
              <Text style={styles.actionWeek}>W{item.week}</Text>
              <View style={styles.actionTextBlock}>
                <Text style={styles.actionMain}>{item.action}</Text>
                <Text style={styles.actionSub}>{item.impact}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
