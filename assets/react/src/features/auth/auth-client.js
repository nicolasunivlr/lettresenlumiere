import { config } from "../../shared/config";

class AuthClient {
  login = async (credentials) => {
    const response = await fetch(config.login, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(
        data.error ||
          data.message ||
          data.detail ||
          "Erreur lors de la connexion."
      );
    }

    return response.json();
  };

  logout = async () => {
    await fetch(config.logout, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  check = async () => {
    const response = await fetch(config.check, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(
        data.error ||
          data.message ||
          data.detail ||
          "Erreur lors de la vérification de l'authentification."
      );
    }
    return response.json();
  };
}

export const authClient = new AuthClient();
