"use client";
import { useAuthContext } from "@/contexts/auth.context";
import { Dropdown, Flex, Menu } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { MdLogout } from "react-icons/md";

const UserNavigation = () => {
  const authContext = useAuthContext();
  const user = authContext.use.user();

  const dropdownMenu = () => (
    <Menu>
      <Menu.Item
        onClick={(e) => {
          e.domEvent.stopPropagation();
          authContext.setState({
            authenticated: false,
            token: undefined,
            user: undefined,
          });
        }}
      >
        <Flex className="items-center justify-center">
          <MdLogout />
          <span className="ml-2">Logout</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  if (!user) {
    return <></>;
  }

  return (
    <div className="flex h-full cursor-pointer items-center justify-between gap-4 px-4 py-2">
      <Dropdown trigger={["click"]} overlay={dropdownMenu()} placement="bottomRight">
        <p className="text-[12px] text-text-low-emp">{user.username}</p>
      </Dropdown>
    </div>
  );
};

export const Header = () => {
  const router = useRouter();

  return (
    <div className="fixed left-0 right-0 top-0 z-[999] flex h-[60px] items-center justify-between bg-white shadow-sm">
      <button
        className="flex h-full w-[250px] items-center justify-start px-6 py-2"
        onClick={() => {
          router.push("/dashboard");
        }}
      >
        <Image
          src={"/admin/images/vinamilk-logo.jpg"}
          alt="vinamilk-logo"
          width={500}
          height={150}
          className="h-full w-auto object-contain"
        />
      </button>

      <div className="mr-5 h-full">
        <UserNavigation />
      </div>
    </div>
  );
};
