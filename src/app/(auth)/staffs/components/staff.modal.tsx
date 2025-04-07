"use client";

import { Modal, Form, Input, DatePicker, Upload, message, Button, UploadFile, UploadProps } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { registerStaff } from "@/services/staff/create";
import ImgCrop from "antd-img-crop";
import { RcFile } from "antd/es/upload";
import { StaffProfile } from "@/services/staff/list";
import { updateStaff } from "@/services/staff/update";

interface StaffModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialValues?: StaffProfile | null;
}

const StaffModal = ({ open, onClose, onSuccess, initialValues }: StaffModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [croppedFileList, setCroppedFileList] = useState<UploadFile[]>([]);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          username: initialValues.account.username,
          password: "",
          trainingDate: dayjs(initialValues.trainingDate),
          startDate: dayjs(initialValues.startDate),
          passProbationDate: initialValues.passProbationDate ? dayjs(initialValues.passProbationDate) : undefined,
        });
      } else {
        form.resetFields();
        setCroppedFileList([]);
        setOriginalFile(null);
      }
    }
  }, [initialValues, form, open]);


  const handleBeforeUpload = (file: File) => {
    setOriginalFile(file);
    return false;
  };

  const handleImageChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setCroppedFileList(fileList);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const croppedFile = croppedFileList?.[0]?.originFileObj;
      const files = [croppedFile, originalFile].filter((file): file is File => file !== null && file !== undefined);
      const payload = {
        username: values.username,
        password: values.password,
        staffCode: values.staffCode,
        fullName: values.fullName,
        trainingDate: values.trainingDate.format("YYYY-MM-DD"),
        startDate: values.startDate.format("YYYY-MM-DD"),
        passProbationDate: values.passProbationDate?.format("YYYY-MM-DD"),
        profileImage: "", // if server auto-generates path from file
        files: files,
      };

      if (initialValues) {
        // Call update API
        await updateStaff(initialValues.id, payload);
        message.success("Cập nhật nhân viên thành công");
      } else {
        // Call register API
        await registerStaff(payload);
        message.success("Tạo nhân viên thành công");
      }
      form.resetFields();
      onClose();
      onSuccess();
    } catch (error: any) {
      message.error(error.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };


  return (

    <Modal
      title={initialValues ? "Chỉnh sửa nhân viên" : "Tạo nhân viên mới"}
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleOk}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={loading}
    >
      <div className="max-h-[70vh] overflow-y-auto pr-4">
        <Form layout="vertical" form={form}>
          <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="username" label="Tên tài khoản" rules={[{ required: true }]}>
            <Input disabled={!!initialValues} />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: !initialValues }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="staffCode" label="Mã nhân viên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="trainingDate" label="Ngày đào tạo" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="passProbationDate" label="Ngày thử việc">
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="profileImage" label="Hình Đại Diện"
            valuePropName="fileList"
          >
            <ImgCrop rotationSlider>
              <Upload listType="picture-card" onChange={handleImageChange} beforeUpload={handleBeforeUpload}>
                <button
                  style={{ color: 'inherit', cursor: 'inherit', border: 0, background: 'none' }}
                  type="button"
                >
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </button>
              </Upload>
            </ImgCrop>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default StaffModal;