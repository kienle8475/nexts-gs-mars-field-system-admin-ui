"use client";

import { useMemo, useState } from "react";
import { Select, DatePicker, Button, Table, Spin, Tooltip, Tag, Modal } from "antd";
import { DownloadOutlined, EditOutlined, UserAddOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

import { Outlet, useOutlets } from "@/services/outlet/list";
import { ColumnsType } from "antd/es/table";

const staffSection = () => {

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);


  const queryParams = useMemo(() => {
    return {
      page: page - 1,
      size: pageSize,
    };
  }, [page, pageSize]);

  const { data, isLoading } = useOutlets(queryParams);


  const columns: ColumnsType<Outlet> = [
    {
      title: "Tỉnh/Thành",
      dataIndex: ["province", "name"],
      key: "province",
    },
    {
      title: "Tên địa điểm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mã địa điểm",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Địa Chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Vị trí",
      key: "location",
      render: (_, record) => {
        return <a
          href={`https://maps.google.com/?q=${record.latitude},${record.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs text-blue-600 underline mt-1"
        >
          Xem bản đồ
        </a>
      },
    },

    {
      title: "Sale Rep",
      key: "saleRep",
      render: (_, record) => record.saleRep?.fullName || "",
    },
    {
      title: "Supervisor",
      key: "saleSupervisor",
      render: (_, record) => record.saleSupervisor?.fullName || "",
    },
    {
      title: "Key Account Manager",
      key: "keyAccountManager",
      render: (_, record) => record.keyAccountManager?.fullName || "",
    },
  ]

  return (
    <section>
      <div className="flex items-center gap-4 border-b border-b-border-low-emp bg-white px-6 py-6">
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
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
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
    </section>
  );
};

export default staffSection;