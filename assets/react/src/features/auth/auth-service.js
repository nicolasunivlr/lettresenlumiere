
class AuthService {
  createLoggedUser = (data) => {
    return {
      id: data.data.id,
      username: data.data.username,
      roles: data.data.roles,
      accountId: data.data.accountId,
      isAdmin: () => data.data.roles.includes("ROLE_ADMIN"),
    };
  };

  createGuestUser = () => {
    return {
      id: "guest",
      roles: [],
      isAdmin: () => false,
    };
  };
}

export const authService = new AuthService();
