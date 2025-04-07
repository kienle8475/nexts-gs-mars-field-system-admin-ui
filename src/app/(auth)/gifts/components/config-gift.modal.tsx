"use client";
import { useControllableState } from "@/hooks/use-controllable-state";
import { GiftsSetDetails } from "@/types/extend";
import { IGift } from "@/types/model";
import { Form, Input, InputNumber, Modal } from "antd";

interface ConfigGiftModalProps {
  gift: IGift;
  giftsSet: GiftsSetDetails;
  onComplete?: (e: { quantity: number }) => void;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (e: boolean) => void;
}

export const ConfigGiftModal = (props: ConfigGiftModalProps) => {
  const {
    gift,
    giftsSet,
    onComplete,
    defaultOpen: defaultOpenProp = false,
    isOpen: isOpenProp,
    onOpenChange: onOpenChangeProp,
  } = props;

  const [isOpen, setIsOpen] = useControllableState<boolean>({
    defaultProp: defaultOpenProp,
    prop: isOpenProp,
    onChange: onOpenChangeProp,
  });

  const [form] = Form.useForm();

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
    onComplete && onComplete({ quantity: values["quantity"] });
    setIsOpen(false);
    setTimeout(() => {
      form.resetFields();
    }, 1000);
  };

  const onApproveFormFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Modal
        title={`Cấu hình Gift (${giftsSet?.outlet?.name})`}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
        centered
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="flex items-center justify-start gap-3 bg-neutral--9 p-4">
          <div className="shrink-0">
            <img
              src={gift?.image_url}
              className="aspect-square h-full w-[42px] rounded-full bg-white object-cover"
            />
          </div>
          <div className="space-y-1">
            <p className="line-clamp-1 font-semibold">{gift?.label}</p>
            <p className="line-clamp-1 text-[12px] font-normal text-text-low-emp">{gift?.code}</p>
          </div>
        </div>

        <Form
          layout="vertical"
          form={form}
          initialValues={{
            quantity: 0,
          }}
          className="my-5"
          onFinish={onApproveFormFinish}
          onFinishFailed={onApproveFormFinishFailed}
        >
          <Form.Item
            name="quantity"
            label="Số lượng khởi tạo"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng!" },
              {
                validator: (_, value) =>
                  value > 0
                    ? Promise.resolve()
                    : Promise.reject(new Error("Số lượng phải lớn hơn 0!")),
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập số lượng quà khởi tạo"
              className="uppercase placeholder:normal-case"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
