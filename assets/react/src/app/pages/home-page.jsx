import logoBrain from "../../assets/images/brainLogo.png";
import logoUpArrow from "../../assets/images/purple-up-arrow.png";
import logoLeL from "../../assets/images/Logolettresenlumiere.png";
import medalIcon from "../../assets/images/gamification/medals/medal-icon.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import RedirectButton from "../../shared/components/UI/RedirectButton";
import { useProfile } from "../../features/profile/profile-provider";


export const HomePage = () => {
  const { profile } = useProfile();

  return (
    <div className="index">
      {profile && (
        <div className={"top-negative"}>
          <motion.div
            className="part"
            initial={{ y: -500, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <RedirectButton
              link="/etapes"
              className="homeButtonHaut h-32"
              label="Progression"
              image={logoUpArrow}
            />
          </motion.div>
          <div className="contenuPrincipal">
            <motion.div
              className="part"
              initial={{ x: -500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <RedirectButton
                link="/sequence/alphabet"
                text=" A B C - a b c"
                className="homeButtonGauche"
                label="Alphabet"
              />
            </motion.div>

            <motion.div
              className="index__logoBrain"
              initial={{ y: 100 }}
              animate={{
                y: [-10, 0, -10],
                transition: { duration: 1.5, repeat: Infinity },
              }}
            >
            <img src={logoBrain} alt="Logo Brain"/>
              
            </motion.div>

            <motion.div
              className="part"
              initial={{ x: 500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <RedirectButton
                link="/sequence/graphemes"
                text="an on in"
                className="homeButtonDroite"
                label="Graphèmes"
              />
            </motion.div>
          </div>

          <div className="home__bottom-links">
            {/* todo : cacher si mode libre */}  
            <Link to="/progression" className="home_links">
              <img src={medalIcon} alt="" className="home__link-icon" />
              <span>Mes résultats</span>
            </Link>
          </div>

          <div className="home__credits">
            <Link to="/credits" className="home__credits-link">Crédits</Link>
          </div>

        </div>
      )}
    </div>
  );
};
