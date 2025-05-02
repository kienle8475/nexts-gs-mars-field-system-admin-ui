"use client";
import { useRipple } from "@/hooks/use-ripple";
import Image from "next/image";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { authLoginSchema, AuthLoginSchema } from "../schemas/auth-login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutationAuthLogin } from "@/services/auth/login";
import { Input } from "@/components/elements/input";
import { ErrorMessage } from "@hookform/error-message";
import { toast } from "sonner";
import { Spinner } from "@/components/elements/spinner";
import { cn } from "@/utils/common";
import { useAuthContext } from "@/contexts/auth.context";
import { notification } from "antd";
import { useRouter } from "nextjs-toploader/app";

const LoginSection = () => {
  const authContext = useAuthContext();
  const authenticated = authContext.use.authenticated();

  const router = useRouter();

  const { rippleContainer, createRipple } = useRipple({ center: true, duration: 800 });

  const authLoginFormMethods = useForm<AuthLoginSchema>({
    resolver: zodResolver(authLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const authLoginMutation = useMutationAuthLogin({
    config: {
      onSuccess(data, variables, context) {
        authContext.setState({
          authenticated: true,
          user: data.data.user,
          token: data.data.token,
        });
        console.log(data);
        router.push("/attendances");
        notification.success({
          message: "Đăng nhập thành công!",
        });
      },
      onError(error, variables, context) {
        authContext.setState({
          authenticated: false,
          user: null,
          token: null,
        });
        notification.error({
          message: "Đăng nhập thất bại!",
          description: (error.response?.data as any)?.message || "Network error",
        });
      },
    },
  });

  const handleFormSubmit = (formData: AuthLoginSchema) => {
    (async () => {
      try {
        await authLoginMutation?.mutateAsync({ ...formData });
      } catch (error) {}
    })();
  };

  React.useEffect(() => {
    if (authenticated) {
      router.push("/attendances");
    }
  }, [authenticated]);

  return (
    <section className="fixed inset-0 mx-auto flex max-w-[1920px] items-center justify-center">
      <div className="mx-4 max-h-[calc(100vh-32px)] w-full overflow-auto rounded-lg border border-border-low-emp bg-white p-8 sm:w-fit sm:min-w-[500px]">
        <div className="mx-auto mb-4 mt-2 max-w-[250px] p-4">
          <Image
            src={"/admin/images/vinamilk-logo.jpg"}
            alt="vinamilk-logo"
            width={500}
            height={150}
            className="object-contain"
          />
        </div>

        <form
          onSubmit={authLoginFormMethods.handleSubmit(handleFormSubmit)}
          className="relative z-[1] flex grow flex-col items-stretch justify-between gap-12"
        >
          <div className="space-y-5">
            <div className="mb-6">
              <p className="text-center text-[20px] font-bold text-text-high-emp">Đăng nhập</p>
            </div>

            <div>
              <Controller
                name="username"
                control={authLoginFormMethods.control}
                render={({ field: { ref, ...fieldProps } }) => (
                  <Input
                    ref={ref}
                    autoComplete="fullname"
                    label="Tên đăng nhập"
                    placeholder="Nhập tên đăng nhập"
                    required
                    {...fieldProps}
                  />
                )}
              />
              <ErrorMessage
                errors={authLoginFormMethods.formState.errors}
                name="username"
                render={({ message }) => (
                  <p className="p-2 text-[12px] font-medium text-red-base">{message}</p>
                )}
              />
            </div>
            <div>
              <Controller
                name="password"
                control={authLoginFormMethods.control}
                render={({ field: { ref, ...fieldProps } }) => (
                  <Input
                    ref={ref}
                    autoComplete="password"
                    label="Mật khẩu"
                    placeholder="Nhập mật khẩu"
                    type="password"
                    required
                    {...fieldProps}
                  />
                )}
              />
              <ErrorMessage
                errors={authLoginFormMethods.formState.errors}
                name="password"
                render={({ message }) => (
                  <p className="p-2 text-[12px] font-medium text-red-base">{message}</p>
                )}
              />
            </div>
          </div>

          <button
            type="submit"
            onPointerDown={createRipple}
            disabled={authLoginMutation.isLoading}
            className="relative w-full select-none rounded-md bg-primary-base p-[12px] text-white transition-all duration-100 enabled:hover:bg-primary--2 disabled:cursor-not-allowed disabled:bg-opacity-60"
          >
            {rippleContainer}
            {authLoginMutation.isLoading && (
              <div className="absolute inset-0 z-[2] flex items-center justify-center">
                <Spinner.B size={18} color="#ffffff" />
              </div>
            )}
            <p
              className={cn("relative z-[2] text-[14px] font-semibold", {
                "opacity-0": authLoginMutation.isLoading,
              })}
            >
              Đăng nhập
            </p>
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginSection;
