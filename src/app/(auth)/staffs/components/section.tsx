"use client";

import { useMemo, useState } from "react";
import { Select, DatePicker, Button, Table, Spin, Tooltip, Tag, Modal } from "antd";
import { DownloadOutlined, EditOutlined, UserAddOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

import { StaffProfile, useStaffProfiles } from "@/services/staff/list";
import CreateStaffModal from "./staff.modal";

const IMAGE_HOST = process.env.NEXT_PUBLIC_IMAGE_HOST;

const staffSection = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedStaffProfile, setSelectedStaffProfile] = useState<StaffProfile | null>(null);

  const handleOpenModal = (selectedStaffProfile?: StaffProfile) => {
    setSelectedStaffProfile(selectedStaffProfile || null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSuccess = () => {
    // Refetch staff list hoặc làm gì đó sau khi tạo thành công
    console.log("Staff created");
  };
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  const queryParams = useMemo(() => {
    return {
      page: page - 1,
      size: pageSize,
    };
  }, [page, pageSize]);

  const { data, isLoading } = useStaffProfiles(queryParams);
  const columns = [
    {
      title: "Mã nhân viên",
      dataIndex: "staffCode",
      key: "staffCode",
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Tài khoản",
      dataIndex: ["account", "username"],
      key: "username",
    }, {
      title: "Ảnh Profile",
      dataIndex: "profileImage",
      render: (url: string) => (
        <div className="flex items-center gap-2">
          <img
            src={`${IMAGE_HOST}${url}`}
            alt="Ảnh profile"
            className="w-10 h-10 rounded-full cursor-pointer bg-white"
            onClick={() => {
              setPreviewImage(`${IMAGE_HOST}${url}`);
              setImageLoading(true);
            }}
            onError={(e) => {
              e.currentTarget.src = "/images/default-avatar.png";
              e.currentTarget.style.backgroundColor = "white";
            }}
          />
        </div>
      ),
    },
    {
      title: "Ngày đào tạo",
      dataIndex: "trainingDate",
      render: (trainingDate: string) => trainingDate ? dayjs(trainingDate).format("DD/MM/YYYY") : "",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      render: (startDate: string) => startDate ? dayjs(startDate).format("DD/MM/YYYY") : "",
    },
    {
      title: "Ngày thử việc",
      dataIndex: "passProbationDate",
      render: (passProbationDate: string) => passProbationDate ? dayjs(passProbationDate).format("DD/MM/YYYY") : "",
    },
    {
      title: "Edit",
      key: "edit",
      render: (_: any, record: StaffProfile) => (
        <Tooltip title="Edit">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <section>
      <div className="flex items-center gap-4 border-b border-b-border-low-emp bg-white px-6 py-6">
        <Button icon={<UserAddOutlined />} type="default" onClick={() => handleOpenModal()}>
          Tạo tài khoản
        </Button>
      </div>
      <div className="p-6">
        <Spin spinning={isLoading}>
          <Table
            dataSource={data?.content || []}
            rowKey={(record) => record.id}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: data?.totalElements || 0,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              showSizeChanger: true,
              onChange: (p, ps) => {
                setPage(p);
                setPageSize(ps);
              },
            }}
            columns={columns}
            scroll={{ x: "max-content" }}
          />
        </Spin>
      </div>
      <Modal
        open={!!previewImage}
        onCancel={() => setPreviewImage(null)}
        footer={null}
        centered
        width={600}
      >
        <Spin spinning={imageLoading}>
          <img
            src={previewImage || ''}
            alt="Preview"
            className="w-full h-auto object-contain"
            onLoad={() => setImageLoading(false)}
          />
        </Spin>
      </Modal>
      <CreateStaffModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        initialValues={selectedStaffProfile}
      />
    </section>
  );
};

export default staffSection;