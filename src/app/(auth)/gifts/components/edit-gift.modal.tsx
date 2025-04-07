"use client";
import { useAuthContext } from "@/contexts/auth.context";
import { useControllableState } from "@/hooks/use-controllable-state";
import { useMutationGiftUpdate } from "@/services/gift/update";
import { IGift } from "@/types/model";
import { Button, Form, Input, Modal, notification } from "antd";
import Upload, { RcFile, UploadChangeParam } from "antd/es/upload";
import { MdOutlineCloudUpload } from "react-icons/md";
import { useQueryClient } from "react-query";

interface EditGiftModalProps {
  gift: IGift;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (e: boolean) => void;
}

export const EditGiftModal = (props: EditGiftModalProps) => {
  const authContext = useAuthContext();
  const token = authContext.use.token();

  const {
    gift,
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

  const giftUpdateMutation = useMutationGiftUpdate({
    config: {
      onSuccess(data, variables, context) {
        notification.success({
          message: "Cập nhật quà tặng thành công!",
          description: variables.label,
        });
        setIsOpen(false);
        form.resetFields();
        queryClient.refetchQueries({ queryKey: ["query/gift/list"] });
      },
      onError(error, variables, context) {
        notification.error({
          message: "Cập nhật quà tặng thất bại!",
          description: (error.response?.data as any)?.message || "Network error",
        });
      },
    },
  });

  const handleOk = async () => {
    try {
      await form.validateFields();
      form.submit();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  const onApproveFormFinish = (values: any) => {
    const updatedData: any = {
      token: token,
      giftId: gift._id,
      code: values["code"],
      label: values["label"],
    };

    const uploadedFile = values["image"]?.[0];
    if (uploadedFile && uploadedFile.originFileObj) {
      updatedData.image = uploadedFile.originFileObj;
    }

    giftUpdateMutation.mutate(updatedData);
  };

  const onApproveFormFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      title="Chỉnh sửa Gift"
      okText="Cập nhật"
      cancelText="Hủy bỏ"
      centered
      confirmLoading={giftUpdateMutation.isLoading}
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          code: gift?.code || "",
          label: gift?.label || "",
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
            defaultFileList={
              gift?.image_url
                ? [
                    {
                      uid: "-1",
                      name: "current_image",
                      status: "done",
                      url: gift.image_url,
                    },
                  ]
                : []
            }
            maxCount={1}
          >
            <Button icon={<MdOutlineCloudUpload />}>Chọn hình ảnh</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
