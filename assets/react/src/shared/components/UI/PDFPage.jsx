import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../../../assets/images/logo.png";

const PDFPage = (props) => {
  const { content, sequence, etapeid, score, progress } = props;

  // Calcul du score total à partir des exercices (en priorisant `progress` si présent)
  const allScores =
    content && content.length > 0
      ? content
          .map((exercise, index) => {
            if (
              progress &&
              progress[index] &&
              progress[index].score !== undefined &&
              progress[index].score !== null
            ) {
              return progress[index].score;
            }

            if (exercise.score !== undefined && exercise.score !== null) {
              return exercise.score;
            }

            return null;
          })
          .filter((val) => val !== null)
      : [];

  const totalScore =
    allScores.length > 0
      ? Math.round(
          allScores.reduce((acc, val) => acc + val, 0) / allScores.length,
        )
      : score || 0;

  const styles = StyleSheet.create({
    page: {
      padding: 30,
      backgroundColor: "#fff",
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    logo: {
      width: 100,
      height: 76,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
      borderRadius: 8,
      backgroundColor: "rgba(78, 137, 143, 0.28)",
      paddingBottom: 20,
    },
    header: {
      fontSize: 15,
      fontFamily: "Helvetica-Bold",
      fontWeight: "bold",
    },
    exerciseHeader: {
      marginBottom: 10,
      marginTop: 15,
      fontSize: 16,
    },
    text: {
      fontSize: 12,
      marginBottom: 5,
    },
    score: {
      fontSize: 12,
      marginBottom: 5,
      color: "blue",
    },
    dateContainer: {
      alignSelf: "flex-start",
      marginBottom: 10,
    },
    sequenceContainer: {
      paddingBottom: 10,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <Image src={logo} style={styles.logo} />
        </View>
        <View style={styles.section}>
          <View style={styles.dateContainer}>
            <Text style={styles.text}>{new Date().toLocaleDateString()}</Text>
          </View>
          <View style={styles.sequenceContainer}>
            <Text style={styles.header}>Étape {etapeid}</Text>

            <Text style={styles.header}>Séquence : {sequence}</Text>

            <Text style={styles.header}>Score total : {totalScore} %</Text>
          </View>
          {content && content.length > 0 ? (
            content.map((exercise, index) => {
              // Prioriser le score depuis progress, sinon depuis exercise.score
              const exerciseScore =
                progress && progress[index]?.score !== undefined
                  ? progress[index].score
                  : exercise.score !== undefined
                    ? exercise.score
                    : undefined;

              return (
                <View key={index} style={{ marginBottom: 5 }}>
                  <Text style={styles.text}>
                    {index + 1}. {exercise.consigne || "Exercice inconnu"}
                  </Text>

                  <Text style={styles.score}>
                    Score:{" "}
                    {exerciseScore !== undefined && exerciseScore !== null
                      ? exerciseScore + " %"
                      : "Non disponible"}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.text}>
              Aucun exercice enregistré pour le moment.
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default PDFPage;
