import React from "react";
import iconeSettings from "../../../assets/images/icones/settings.png";
import { useAuth } from "../providers/auth-provider";

export const AdminButton = ({ label }) => {

  const handleClick = async () => {
    // Rediriger vers la page d'administration
    try {
      window.location.href = '/admin';
      console.log("Redirection vers la page d'administration !");

    } catch (error) {
      console.error("Erreur lors de la navigation vers la page d'administration :", error);
    }

  };  

  const { user } = useAuth();

  // Ne pas afficher le bouton si l'utilisateur n'est pas admin
  if (!user || !user.isAdmin()) {
    return null;
  }

  return (
    <button
      className="admin-button"
      type="button"
      onClick={handleClick}
    >

      <span className="admin-button__label">{label}</span>

      <img 
        src={iconeSettings} 
        className="admin-button__icon"
        aria-hidden="true"
        alt="" 
      />

    </button>
  );
};
