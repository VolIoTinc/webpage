"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

let userPool = null;

function getUserPool() {
  if (!userPool && typeof window !== "undefined") {
    const poolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    if (poolId && clientId) {
      userPool = new CognitoUserPool({ UserPoolId: poolId, ClientId: clientId });
    }
  }
  return userPool;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pool = getUserPool();
    if (!pool) { setLoading(false); return; }
    const cognitoUser = pool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.getSession((err, session) => {
        if (err || !session?.isValid()) {
          setUser(null);
        } else {
          setUser({
            username: cognitoUser.getUsername(),
            token: session.getIdToken().getJwtToken(),
          });
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = (username, password) => {
    return new Promise((resolve, reject) => {
      const pool = getUserPool();
      if (!pool) { reject(new Error("Auth not configured")); return; }
      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: pool,
      });

      const authDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (session) => {
          const userData = {
            username: cognitoUser.getUsername(),
            token: session.getIdToken().getJwtToken(),
          };
          setUser(userData);
          resolve(userData);
        },
        onFailure: (err) => {
          reject(err);
        },
        newPasswordRequired: (userAttributes) => {
          resolve({ challengeName: "NEW_PASSWORD_REQUIRED", cognitoUser, userAttributes });
        },
        totpRequired: () => {
          resolve({ challengeName: "SOFTWARE_TOKEN_MFA", cognitoUser });
        },
        mfaSetup: () => {
          cognitoUser.associateSoftwareToken({
            associateSecretCode: (secretCode) => {
              resolve({ challengeName: "MFA_SETUP", cognitoUser, secretCode });
            },
            onFailure: (err) => reject(err),
          });
        },
      });
    });
  };

  const completeNewPassword = (cognitoUser, newPassword) => {
    return new Promise((resolve, reject) => {
      cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
        onSuccess: (session) => {
          const userData = {
            username: cognitoUser.getUsername(),
            token: session.getIdToken().getJwtToken(),
          };
          setUser(userData);
          resolve(userData);
        },
        onFailure: (err) => reject(err),
        totpRequired: () => {
          resolve({ challengeName: "SOFTWARE_TOKEN_MFA", cognitoUser });
        },
        mfaSetup: () => {
          cognitoUser.associateSoftwareToken({
            associateSecretCode: (secretCode) => {
              resolve({ challengeName: "MFA_SETUP", cognitoUser, secretCode });
            },
            onFailure: (err) => reject(err),
          });
        },
      });
    });
  };

  const confirmMFA = (cognitoUser, code) => {
    return new Promise((resolve, reject) => {
      cognitoUser.sendMFACode(code, {
        onSuccess: (session) => {
          const userData = {
            username: cognitoUser.getUsername(),
            token: session.getIdToken().getJwtToken(),
          };
          setUser(userData);
          resolve(userData);
        },
        onFailure: (err) => reject(err),
      }, "SOFTWARE_TOKEN_MFA");
    });
  };

  const verifyMFASetup = (cognitoUser, code) => {
    return new Promise((resolve, reject) => {
      cognitoUser.verifySoftwareToken(code, "TOTP", {
        onSuccess: (session) => {
          if (session && session.getIdToken) {
            const userData = {
              username: cognitoUser.getUsername(),
              token: session.getIdToken().getJwtToken(),
            };
            setUser(userData);
            resolve(userData);
          } else {
            resolve({ challengeName: "SOFTWARE_TOKEN_MFA", cognitoUser });
          }
        },
        onFailure: (err) => reject(err),
      });
    });
  };

  const signOut = () => {
    const pool = getUserPool();
    const cognitoUser = pool?.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    setUser(null);
  };

  const getToken = () => {
    return new Promise((resolve, reject) => {
      const pool = getUserPool();
      if (!pool) { reject(new Error("Auth not configured")); return; }
      const cognitoUser = pool.getCurrentUser();
      if (!cognitoUser) {
        reject(new Error("No user"));
        return;
      }
      cognitoUser.getSession((err, session) => {
        if (err || !session?.isValid()) {
          setUser(null);
          reject(new Error("Session expired"));
        } else {
          resolve(session.getIdToken().getJwtToken());
        }
      });
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, completeNewPassword, confirmMFA, verifyMFASetup, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
