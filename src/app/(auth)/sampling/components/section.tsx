"use client";

import { useMemo, useState } from "react";
import { Button, DatePicker, Modal, Pagination, Select, Spin, Table, Tag, Tooltip } from "antd";
import { CheckCircleTwoTone, DownloadOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { OutletOption, useOutletsByProvince } from "@/services/outlet/list-option";
import { ProfileOption, useStaffProfileOptions } from "@/services/profile/list-staff-option";
import { useAttendanceReport } from "@/services/attendance/list";
import { ProvinceOption, useAllProvincesOptions } from "@/services/province/list-option";
import { useReportItems } from "@/services/report-item/list-by-type";
import { ColumnType } from "antd/es/table";
import { exportSamplingExcel } from "@/services/export/sampling.export";

const { RangePicker } = DatePicker;

const SamplingSection = () => {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>();
  const [selectedOutletId, setSelectedOutletId] = useState<string>();
  const [selectedStaffId, setSelectedStaffId] = useState<string>();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([dayjs(), dayjs()]);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Handler for when the date range changes
  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      const newRange: [Dayjs, Dayjs] = [dates[0].startOf('day'), dates[1].endOf('day')];
      setDateRange(newRange);
      setPage(1);
    } else {
      const today = dayjs();
      const resetRange: [Dayjs, Dayjs] = [today.startOf('day'), today.endOf('day')];
      setDateRange(resetRange);
      setPage(1);
      setRefreshKey((prev) => prev + 1)
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportSamplingExcel({
        staffId: Number(selectedStaffId),
        outletId: Number(selectedOutletId),
        provinceId: Number(selectedProvinceId),
        startDate: dateRange[0]?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD"),
        endDate: dateRange[1]?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD"),
      });
    } catch (error) {
      console.error('Export failed', error);
      console.log(error);
      alert('Export failed');
    }
  };


  // === Gọi API outlet dựa vào selectedProvince ===
  const { data: outletOptions = [], isLoading: outletLoading } = useOutletsByProvince(Number(selectedProvinceId));
  const { data: provinceOptions = [], isLoading: provinceLoading } = useAllProvincesOptions();
  const { data: staffProfileOptions = [], isLoading: staffProfileLoading } = useStaffProfileOptions();
  const { data: reportItems = [], isLoading: reportItemsLoading } = useReportItems("SAMPLING");
  const queryParams = useMemo(() => {
    return {
      ...(selectedProvinceId && { provinceId: selectedProvinceId }),
      ...(selectedOutletId && { outletId: selectedOutletId }),
      ...(selectedStaffId && { staffId: selectedStaffId }),
      startDate: dateRange[0]?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD"),
      endDate: dateRange[1]?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD"),
      page: page - 1,
      size: pageSize,
      refreshKey, // ép hook refetch
    };
  }, [selectedProvinceId, selectedOutletId, selectedStaffId, dateRange, page, pageSize, refreshKey]);

  const { data, isFetching } = useAttendanceReport(queryParams);

  const baseColumns = [
    {
      title: "Outlet",
      fixed: "left",
      width: 200,
      render: (_: any, record: any) => (
        <div>
          <div><b>{record.outlet.name}</b></div>
          <div className="text-gray-500 text-sm">{record.outlet.province}</div>
        </div>
      )
    },
    {
      title: "Ngày",
      fixed: "left",
      width: 200,
      render: (_: any, record: any) => (
        <div>
          <div><b>{record.startTime ? dayjs(record.startTime).format("DD/MM/YYYY") : ""}</b></div>
        </div>
      )
    },
    {
      title: "Ca",
      fixed: "left",
      dataIndex: "shiftName",
      width: 100,
      align: "center"
    },
    {
      title: "Nhân viên",
      fixed: "left",
      width: 200,
      render: (_: any, record: any) => {
        const staff = record.attendances?.[0]?.staff;
        return staff ? (
          <div>
            <div>{staff.fullName}</div>
            <div className="text-xs text-gray-500">{staff.account.username}</div>
          </div>
        ) : "-";
      }
    },

  ];

  const brandGroups: Record<string, any[]> = {};
  if (Array.isArray(reportItems)) {
    reportItems.forEach((item: { brand: string }) => {
      if (!brandGroups[item.brand]) brandGroups[item.brand] = [];
      brandGroups[item.brand].push(item);
    });
  }

  const skuGroupedColumns = Object.entries(brandGroups).map(([brand, items]) => ({
    title: brand,
    children: items.map((item) => ({
      title: item.name,
      dataIndex: item.skuCode,
      render: (_: any, record: any) => {
        const samplingData = record.attendances?.[0]?.samplingReport?.data || [];
        const found = samplingData.find((d: any) => d.sku === item.skuCode);
        return found ? `${found.pcs}` : "-";
      },
    }))

  }));
  const columns = [...baseColumns, ...skuGroupedColumns];

  return (
    <section>
      <div className="flex items-center gap-4 border-b border-b-border-low-emp bg-white px-6 py-6">
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
        {/* Select Province */}
        <Select
          showSearch
          className="w-full md:w-1/4"
          placeholder="Select Province"
          value={selectedProvinceId}
          onChange={setSelectedProvinceId}
          allowClear
          loading={provinceLoading}
          options={provinceOptions.map((o: ProvinceOption) => ({
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
        <RangePicker
          className="w-full md:w-2/5" // Adjust width as per your design
          onChange={handleDateRangeChange} // Update the state on change
          defaultValue={[dayjs(), dayjs()]} // Default date range is today
          showTime={false} // Hide time selection
          value={dateRange} // Controlled input using state
        />
        <Button icon={<DownloadOutlined />} type="primary" onClick={handleExportExcel}>
          Export Excel
        </Button>
      </div>

      <div className="p-6">
        <Spin spinning={isFetching || reportItemsLoading}>
          <Table
            dataSource={data?.content || []}
            rowKey={(record) => record.shiftId}
            rowClassName={(record) =>
              record.attendances?.[0]?.samplingReport?.data?.length > 0 ? "bg-green-50" : "bg-red-50"
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
            columns={columns as ColumnType<any>[]}
            scroll={{ x: true }}
          />
        </Spin>
      </div>
    </section>
  );
};

export default SamplingSection;
