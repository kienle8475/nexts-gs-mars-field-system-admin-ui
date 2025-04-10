"use client";
import { useMemo, useState } from "react";
import { Select, DatePicker, Button, Table, Spin, Tooltip, Tag, Modal, TabsProps, Tabs } from "antd";
import { DownloadOutlined, EditOutlined, UserAddOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { ColumnsType } from "antd/es/table";
import { ReportItem } from "@/services/report-item/list";
import { useReportItems } from "@/services/report-item/list";


const ReportItemSection = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // const handleOpenModal = (selectedStaffProfile?: StaffProfile) => {
  //   setSelectedStaffProfile(selectedStaffProfile || null);
  //   setIsModalOpen(true);
  // };
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSuccess = () => {
    // Refetch staff list hoặc làm gì đó sau khi tạo thành công
    console.log("Staff created");
  };

  const { data, isLoading } = useReportItems();
  const reportTypes = [{ "key": "SALES", "label": "Báo Cáo Bán Hàng" }, { "key": "OOS", "label": "Báo Cáo OOS" }, { "key": "SAMPLING", "label": "Báo Cáo Sampling" }];


  const columns: ColumnsType<ReportItem> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "SKU Code",
      dataIndex: "skuCode",
      key: "skuCode",
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Nhóm",
      dataIndex: "brand",
      key: "brand",
    },
  ];

  const tabItems: TabsProps['items'] = reportTypes?.map((type) => ({
    key: type.key,
    label: type.label,
    children: (
      <Table
        dataSource={data?.filter((item) => item.reportTypes.includes(type.key))}
        columns={columns}
        rowKey="id"
        pagination={false}
        scroll={{ x: "max-content" }}
      />
    ),
  }));

  return (
    <section>
      <div className="flex items-center gap-4 border-b border-b-border-low-emp bg-white px-6 py-6" >
        <Button icon={<PlusOutlined />} type="default" onClick={() => { }}>
          Tạo danh mục báo cáo
        </Button>
      </div>
      < div className="p-6" >
        <Spin spinning={isLoading}>
          <Tabs items={tabItems} />
        </Spin>
      </div>

      {/* < CreateReportItemModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        initialValues={selectedReportItem}
      /> */}
    </section>
  );
};


export default ReportItemSection;
