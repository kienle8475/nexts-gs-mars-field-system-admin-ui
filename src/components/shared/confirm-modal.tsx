import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import React from "react";
import { useControllableState } from "@/hooks/use-controllable-state";

interface ConfirmModalProps {
  title?: string;
  content?: string;
  okText?: string;
  cancelText?: string;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (e: boolean) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const ConfirmModal = (props: ConfirmModalProps) => {
  const {
    title,
    content,
    okText,
    cancelText,
    defaultOpen: defaultOpenProp = false,
    isOpen: isOpenProp,
    onOpenChange: onOpenChangeProp,
    onConfirm,
    onCancel,
  } = props;

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    defaultProp: defaultOpenProp,
    prop: isOpenProp,
    onChange: onOpenChangeProp,
  });

  const handleOk = () => {
    if (onConfirm) onConfirm();
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    setIsOpen(false);
  };

  return (
    <Modal
      title={
        <span>
          <ExclamationCircleOutlined className="mr-2" />
          {title}
        </span>
      }
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={okText}
      cancelText={cancelText}
      centered
    >
      {content}
    </Modal>
  );
};
