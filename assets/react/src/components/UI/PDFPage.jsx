import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import logo from '../../assets/images/logo.png';

const PDFPage = (props) => {
  const { content, sequence, etapeid, score } = props;
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      backgroundColor: '#fff',
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
      backgroundColor: 'rgba(78, 137, 143, 0.28)',
      paddingBottom: 20,
    },
    header: {
      fontSize: 15,
      fontFamily: 'Helvetica-Bold',
      fontWeight: 'bold',
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
      color: 'blue',
    },
    dateContainer: {
      alignSelf: 'flex-start',
      marginBottom: 10,
    },
    sequenceContainer: {
      paddingBottom: 10,
    },
  });

  return (
    <Document>
      <Page size='A4' style={styles.page}>
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

            <Text style={styles.header}>Score total : {score} %</Text>
          </View>
          {content && content.length > 0 ? (
            content.map((exercise, index) => (
              <View key={index} style={{ marginBottom: 5 }}>
                <Text style={styles.text}>
                  {index + 1}. {exercise.consigne || 'Exercice inconnu'}
                </Text>

                <Text style={styles.score}>
                  Score:{' '}
                  {exercise.score !== undefined
                    ? exercise.score + ' %'
                    : 'Non disponible'}
                </Text>
              </View>
            ))
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
