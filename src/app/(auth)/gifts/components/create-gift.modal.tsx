"use client";
import { useAuthContext } from "@/contexts/auth.context";
import { useControllableState } from "@/hooks/use-controllable-state";
import { useMutationGiftCreate } from "@/services/gift/create";
import { Button, Form, Input, Modal, notification } from "antd";
import Upload, { RcFile, UploadChangeParam } from "antd/es/upload";
import { useQueryClient } from "react-query";
import { MdOutlineCloudUpload } from "react-icons/md";

interface CreateGiftModalProps {
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (e: boolean) => void;
}

export const CreateGiftModal = (props: CreateGiftModalProps) => {
  const authContext = useAuthContext();
  const token = authContext.use.token();

  const {
    defaultOpen: defaultOpenProp = false,
    isOpen: isOpenProp,
    onOpenChange: onOpenChangeProp,
  } = props;

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    defaultProp: defaultOpenProp,
    prop: isOpenProp,
    onChange: onOpenChangeProp,
  });

  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  const giftCreateMutation = useMutationGiftCreate({
    config: {
      onSuccess(data, variables, context) {
        notification.success({
          message: "Tạo quà tặng thành công!",
          description: variables.label,
        });
        setIsOpen(false);
        form.resetFields();
        queryClient.refetchQueries({ queryKey: ["query/gift/list"] });
      },
      onError(error, variables, context) {
        notification.error({
          message: "Tạo quà tặng thất bại!",
          description: (error.response?.data as any)?.message || "Network error",
        });
      },
    },
  });

  const handleOk = () => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await form.validateFields();
        form.submit();
        resolve();
      } catch (error) {
        reject(error);
      }
    }).catch(() => {});
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  const onApproveFormFinish = (values: any) => {
    const imageFile = values["image"]?.[0]?.originFileObj;

    if (!imageFile) {
      notification.error({
        message: "Vui lòng chọn hình ảnh hợp lệ!",
      });
      return;
    }

    giftCreateMutation.mutate({
      token: token,
      code: values["code"],
      label: values["label"],
      image: imageFile,
    });
  };

  const onApproveFormFinishFailed = (errorInfo: any) => {};

  return (
    <Modal
      title="Tạo mới Gift"
      okText="Hoàn thành"
      cancelText="Hủy bỏ"
      centered
      confirmLoading={giftCreateMutation.isLoading}
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          provinceId: "",
          name: "",
          address: "",
          gps: { lat: 0, lng: 0, radius: 0 },
        }}
        className="my-5"
        onFinish={onApproveFormFinish}
        onFinishFailed={onApproveFormFinishFailed}
      >
        <Form.Item
          name="code"
          label="Mã quà tặng"
          rules={[{ required: true, message: "Vui lòng nhập mã quà tặng!" }]}
        >
          <Input placeholder="Nhập mã quà tặng" className="uppercase placeholder:normal-case" />
        </Form.Item>
        <Form.Item
          name="label"
          label="Tên quà tặng"
          rules={[{ required: true, message: "Vui lòng nhập tên quà tặng!" }]}
        >
          <Input placeholder="Nhập tên quà tặng" />
        </Form.Item>
        <Form.Item
          name="image"
          label="Hình ảnh quà tặng"
          valuePropName="fileList"
          getValueFromEvent={(e: UploadChangeParam) => e?.fileList}
          rules={[{ required: true, message: "Vui lòng tải lên hình ảnh!" }]}
        >
          <Upload
            listType="picture"
            beforeUpload={(file: RcFile) => {
              const isSupportedType = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
              if (!isSupportedType) {
                notification.error({
                  message: "Chỉ hỗ trợ file JPG/PNG/WebP!",
                });
              }
              return isSupportedType || Upload.LIST_IGNORE;
            }}
            maxCount={1}
          >
            <Button icon={<MdOutlineCloudUpload />}>Chọn hình ảnh</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
