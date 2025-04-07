"use client";
import { AuthStore, createAuthStore } from "@/stores/auth.store";
import { createSelectors } from "@/utils/common";
import { usePathname } from "next/navigation";
import React, { createContext } from "react";
import { StoreApi } from "zustand";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { toast } from "sonner";
import { useQueryMeVerify } from "@/services/me/verify";
import { notification } from "antd";
import { UserRole } from "@/enums/model";

export interface IAuthContext extends StoreApi<AuthStore> { }
export const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider = (props: AuthContextProviderProps) => {
  const { children } = props;

  const storeRef = React.useRef<StoreApi<AuthStore>>(createAuthStore());

  const storeSelectors = createSelectors(storeRef.current);
  const token = storeSelectors.use.token();

  const pathname = usePathname();

  useQueryMeVerify({
    params: { token: token },
    config: {
      enabled: token !== undefined && token !== null,
      onSuccess(data) {
        // const isAdmin = [UserRole.ADMIN, UserRole.SUPERADMIN].some((role) =>
        //   data.data.role === role,
        // );

        const isAdmin = true;
        if (isAdmin) {
          storeSelectors.setState({ user: data.data });
        } else {
          storeSelectors.setState({ user: null, token: null, authenticated: false });
          notification.error({
            message: "Unauthorization",
          });
        }
      },
      onError(err) {
        storeSelectors.setState({ user: null, token: null, authenticated: false });
        notification.error({
          message: "Unauthorization",
        });
      },
    },
  });

  const handleValidateToken = (token: string) => {
    try {
      const decodedToken = (jwtDecode as any)(token);
      const isExpired = moment.unix(+decodedToken.exp).isBefore(moment.utc());

      if (isExpired) {
        console.error(`Token expired: ${moment.unix(+decodedToken.exp).toDate()}`);
      } else {
        // console.log(`Token exp: ${moment.unix(+decodedToken.exp).toDate()}`);
      }
    } catch (err) {
      notification.error({
        message: "Token expired",
      });
      storeSelectors.setState({
        user: null,
        token: null,
        authenticated: false,
      });
      window.location.reload();
    }
  };

  React.useEffect(() => {
    let timeoutRef: NodeJS.Timeout;

    if (token) {
      handleValidateToken(token);
    } else {
      timeoutRef = setTimeout(() => {
        storeSelectors.setState({
          user: null,
          token: null,
          authenticated: false,
        });
      }, 1000);
    }

    return () => {
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
    };
  }, [token, pathname]);

  return <AuthContext.Provider value={storeRef.current}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext must be used within a AuthContextProvider");
  }

  return createSelectors(context);
};
