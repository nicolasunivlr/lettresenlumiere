import { motion } from 'framer-motion';

function Loader() {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -15, 0],
      transition: {
        repeat: Infinity,
        duration: 1,
      },
    },
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
  };

  return (
    <div style={containerStyle}>
      <motion.div
        style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}
        variants={containerVariants}
        initial='initial'
        animate='animate'
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#09f',
            }}
            variants={dotVariants}
          />
        ))}
      </motion.div>
      <p>Chargement des données...</p>
    </div>
  );
}

export default Loader;
