"use client";

import { useMemo, useState } from "react";
import { Button, DatePicker, Modal, Pagination, Select, Spin, Table, Tag, Tooltip } from "antd";
import { CheckCircleTwoTone, DownloadOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { OutletOption, useOutletsByProvince } from "@/services/outlet/list-option";
import { ProfileOption, useStaffProfileOptions } from "@/services/profile/list-staff-option";
import { useAttendanceReport } from "@/services/attendance/list";
import { ProvinceOption } from "@/services/province/list-option";
import { ColumnType } from "antd/es/table";
import { useStaffLeaveReport } from "@/services/staff-leave/list";


const LeaveSection = () => {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>();
  const [selectedOutletId, setSelectedOutletId] = useState<string>();
  const [selectedStaffId, setSelectedStaffId] = useState<string>();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentlyLeaving, setCurrentlyLeaving] = useState<boolean | null>(null);
  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date.startOf("day"));
      setPage(1);
    }
  };

  const leaveTypes = [
    { value: "LUNCH_BREAK", label: "Đi ăn trưa/tối" },
    { value: "RESTROOM", label: "Đi vệ sinh" },
    { value: "BREAK_TIME", label: "Giải lao" },
    { value: "GET_SUPPLIES", label: "Lấy hàng/vật dụng" },
    { value: "PRIVATE_TASK", label: "Công việc riêng" },
    { value: "QUICK_MEETING", label: "Họp nhanh với quản lý" },
    { value: "PHONE_CALL", label: "Nghe điện thoại khẩn" },
    { value: "OTHER_REASON", label: "Lý do khác" },
  ];

  // === Gọi API outlet dựa vào selectedProvince ===
  const { data: outletOptions = [], isLoading: outletLoading } = useOutletsByProvince(Number(selectedProvinceId));
  const { data: staffProfileOptions = [], isLoading: staffProfileLoading } = useStaffProfileOptions();

  const queryParams = useMemo(() => {
    return {
      ...(currentlyLeaving !== null && { currentlyLeaving: currentlyLeaving }),
      ...(selectedOutletId !== undefined && { outletId: selectedOutletId }),
      ...(selectedStaffId !== undefined && { staffId: selectedStaffId }),
      date: selectedDate?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD"),
      page: page - 1,
      size: pageSize,
    };
  }, [currentlyLeaving, selectedOutletId, selectedStaffId, selectedDate, page, pageSize]);

  const { data, isFetching } = useStaffLeaveReport(queryParams);

  const columns = [
    {
      title: "Nhân viên",
      dataIndex: "staffName",
      key: "staffName",
    },
    {
      title: "Outlet",
      dataIndex: "outletName",
      key: "outletName",
    },
    {
      title: "Ca làm việc",
      dataIndex: "shiftName",
      key: "shiftName",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "startTime",
      render: (text: string) => dayjs(text).format("HH:mm DD/MM/YYYY"),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "endTime",
      render: (text: string) => {
        return text !== null ? dayjs(text).format("HH:mm DD/MM/YYYY") : <Tag color="red">Đang rời vị trí</Tag>;
      }
    },
    {
      title: "Lý do",
      dataIndex: "leaveType",
      render: (type: string) => {
        const found = leaveTypes.find((t) => t.value === type);
        return <Tag color="orange">{found?.label || type}</Tag>;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
    }
  ];

  return (
    <section>
      <div className="flex items-center gap-4 border-b border-b-border-low-emp bg-white px-6 py-6">
        {/* Select Staff */}
        <Select
          showSearch
          className="w-full md:w-1/4"
          placeholder="Select PS"
          value={currentlyLeaving}
          onChange={setCurrentlyLeaving}
          allowClear
          options={[
            { label: "Tất cả", value: null },
            { label: "Đang rời vị trí", value: true },
            { label: "Đã về", value: false },
          ]}
        />


        {/* Select Staff */}
        <Select
          showSearch
          className="w-full md:w-1/4"
          placeholder="Select PS"
          value={selectedStaffId}
          onChange={setSelectedStaffId}
          allowClear
          loading={staffProfileLoading}
          options={staffProfileOptions.map((o: ProfileOption) => ({
            label: o.name,
            value: o.id,
          }))}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />

        {/* Select Outlet */}
        <Select
          showSearch
          className="w-full md:w-1/4"
          placeholder="Select Outlet"
          value={selectedOutletId}
          onChange={setSelectedOutletId}
          allowClear
          loading={outletLoading}
          options={outletOptions.map((o: OutletOption) => ({
            label: o.name,
            value: o.id,
          }))}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />

        <DatePicker
          className="w-full md:w-1/4"
          value={selectedDate}
          onChange={handleDateChange}
          defaultValue={dayjs()}
        />
      </div>

      <div className="p-6">
        <Spin spinning={isFetching}>
          <Table
            dataSource={data?.content || []}
            rowKey={(record) => record.id}
            rowClassName={(record) =>
              record.endTime !== null ? "" : "bg-red-50"
            }
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
            scroll={{ x: true }}
            columns={columns}
          />
        </Spin>
      </div>
    </section>
  );
};

export default LeaveSection;
