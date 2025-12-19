class AuthService {
  createLoggedUser = (data) => {
    return {
      id: data.data.id,
      username: data.data.username,
      roles: data.data.roles,
      accountId: data.data.accountId,
    };
  };

  createGuestUser = () => {
    return {
      id: "guest",
      roles: [],
    };
  };
}

export const authService = new AuthService();
