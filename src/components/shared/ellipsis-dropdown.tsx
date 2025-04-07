"use client";
import React from "react";
import { Dropdown, DropdownProps, Menu } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

interface EllipsisDropdownProps {
  trigger?: DropdownProps["trigger"];
  placement?: DropdownProps["placement"];
  menu?: React.ReactElement;
}

export const EllipsisDropdown = (props: EllipsisDropdownProps) => {
  const { trigger = ["click"], placement = "bottomRight", menu = <Menu /> } = props;

  return (
    <Dropdown overlay={menu} placement={placement} trigger={trigger}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex aspect-square h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full transition-all duration-100 hover:bg-neutral--8 active:bg-neutral--7"
      >
        <EllipsisOutlined />
      </div>
    </Dropdown>
  );
};
