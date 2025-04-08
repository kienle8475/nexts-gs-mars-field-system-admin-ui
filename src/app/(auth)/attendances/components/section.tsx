"use client";
import { useMemo, useState } from "react";
import { Button, DatePicker, Modal, Pagination, Select, Spin, Table, Tag, Tooltip } from "antd";
import { CheckCircleTwoTone, DownloadOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { OutletOption, useOutletsByProvince } from "@/services/outlet/list-option";
import { ProfileOption, useStaffProfileOptions } from "@/services/profile/list-staff-option";
import { useAttendanceReport } from "@/services/attendance/list";
import { ProvinceOption, useAllProvincesOptions } from "@/services/province/list-option";
import { useAutoPingPong } from "@/hooks/use-auto-ping-pong";
import { exportAttendanceExcel } from "@/services/export/attendance.export";
import { generatePptxExport, watchExportJob } from "@/services/export/pptx.export";
const IMAGE_HOST = process.env.NEXT_PUBLIC_IMAGE_HOST;

const AttendanceSection = () => {
  useAutoPingPong(5000); // auto ping pong every 5 seconds

  const [outletType] = useState<string>("BOTH");
  const [selectedOutletId, setSelectedOutletId] = useState<string>();
  const [selectedStaffId, setSelectedStaffId] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [jobId, setJobId] = useState<number | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'DONE' | 'FAILED'>('IDLE');
  const [showPopup, setShowPopup] = useState(false);

  // === Gọi API outlet dựa vào selectedProvince ===
  const { data: outletOptions = [], isLoading: outletLoading } = useOutletsByProvince(
    Number(selectedProvinceId),
  );
  const { data: provinceOptions = [], isLoading: provinceLoading } = useAllProvincesOptions();
  const { data: staffProfileOptions = [], isLoading: staffProfileLoading } =
    useStaffProfileOptions();
  const queryParams = useMemo(() => {
    return {
      ...(selectedProvinceId !== undefined && { provinceId: selectedProvinceId }),
      ...(selectedOutletId !== undefined && { outletId: selectedOutletId }),
      ...(selectedStaffId !== undefined && { staffId: selectedStaffId }),
      date: selectedDate?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD"),
      page: page - 1,
      size: pageSize,
    };
  }, [selectedProvinceId, selectedOutletId, selectedStaffId, selectedDate, page, pageSize]);

  const { data, isFetching } = useAttendanceReport(queryParams);

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date.startOf("day"));
      setPage(1);
    }
  };

  const handleExportExcel = async () => {
    try {
      await exportAttendanceExcel({
        staffId: Number(selectedStaffId),
        outletId: Number(selectedOutletId),
        provinceId: Number(selectedProvinceId),
        date: selectedDate?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD"),
      });
    } catch (error) {
      console.error('Export failed', error);
      console.log(error);
      alert('Export failed');
    }
  };

  const handleExportPPTX = async () => {
    try {
      setStatus('PROCESSING');
      setShowPopup(true);
      const id = await generatePptxExport({
        staffId: Number(selectedStaffId),
        outletId: Number(selectedOutletId),
        provinceId: Number(selectedProvinceId),
        date: selectedDate?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD"),
      });

      setJobId(id);

      const stopWatch = watchExportJob(
        id,
        () => {
          setStatus('DONE');
          setShowPopup(false);
        },
        () => {
          setStatus('FAILED');
          setShowPopup(false);
          alert('Xuất file thất bại.');
        }
      );

      return () => stopWatch();
    } catch (err) {
      console.error('Lỗi khi gửi yêu cầu xuất PowerPoint:', err);
      setStatus('FAILED');
      setShowPopup(false);
    }
  };

  const columns = [
    {
      title: "Outlet",
      render: (_: any, record: { outlet: { name: string; province: string } }) => (
        <div>
          <div>
            <b>{record.outlet.name}</b>
          </div>
          <div className="text-sm text-gray-500">{record.outlet.province}</div>
        </div>
      ),
    },
    {
      title: "Thời Gian",
      render: (_: any, record: { startTime: string; endTime: string }) => (
        <div>
          <div>
            <b>Bắt đầu:</b>{" "}
            {record.startTime ? dayjs(record.startTime).format("HH:mm DD/MM/YYYY") : ""}
          </div>
          <div>
            <b>Kết thúc:</b>{" "}
            {record.endTime ? dayjs(record.endTime).format("HH:mm DD/MM/YYYY") : ""}
          </div>
        </div>
      ),
    },
    {
      title: "Ca",
      dataIndex: "shiftName",
    },
    {
      title: "Trạng thái",
      dataIndex: "attendances",
      render: (att: any) => {
        const hasAttendance = att.length > 0;
        return (
          <Tag color={hasAttendance ? "green" : "red"}>
            {hasAttendance ? "Đã Check-in" : "Chưa Check-in"}
          </Tag>
        );
      },
    },
    {
      title: "Chi tiết",
      render: (_: any, record: { attendances: any }) => (
        <div className="flex flex-wrap gap-3">
          {(record.attendances || []).map((att: any) => (
            <div key={att.id} className="rounded-md border bg-gray-50 p-2 shadow-sm">
              <div className="text-sm font-semibold">{att.staff?.fullName}</div>
              <div className="text-xs text-gray-500">
                🕘 {att.checkinTime ? dayjs(att.checkinTime).format("HH:mm DD/MM") : ""} →{" "}
                {att.checkoutTime ? dayjs(att.checkoutTime).format("HH:mm DD/MM") : " - "}
              </div>
              <div className="mt-1 flex gap-2">
                {att.checkinImage && (
                  <img
                    src={`${IMAGE_HOST}${att.checkinImage}`}
                    alt="checkin"
                    className="h-10 w-10 cursor-pointer rounded bg-white object-cover"
                    onClick={() => {
                      setImageLoading(true);
                      setPreviewImage(`${IMAGE_HOST}${att.checkinImage}`);
                    }}
                  />
                )}
                {att.checkoutImage && (
                  <img
                    src={`${IMAGE_HOST}${att.checkoutImage}`}
                    alt="checkout"
                    className="h-10 w-10 cursor-pointer rounded bg-white object-cover"
                    onClick={() => {
                      setImageLoading(true);
                      setPreviewImage(`${IMAGE_HOST}${att.checkoutImage}`);
                    }}
                  />
                )}
              </div>
              <a
                href={`https://maps.google.com/?q=${att.checkinLocation.lat},${att.checkinLocation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-xs text-blue-600 underline"
              >
                View Map
              </a>
              <div className="mt-1 flex gap-1">
                <Tooltip title="Sale Report">
                  <CheckCircleTwoTone twoToneColor={att.saleReport ? "#52c41a" : "#d9d9d9"} />
                </Tooltip>
                <Tooltip title="OOS Report">
                  <CheckCircleTwoTone twoToneColor={att.oosReport ? "#1890ff" : "#d9d9d9"} />
                </Tooltip>
                <Tooltip title="Sampling Report">
                  <CheckCircleTwoTone twoToneColor={att.samplingReport ? "#fa8c16" : "#d9d9d9"} />
                </Tooltip>
                <Tooltip title="Out-of-position count">
                  <Tag color={att.staffLeaves?.length > 0 ? "red" : "green"}>
                    {att.staffLeaves?.length || 0}x
                  </Tag>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];


  return (
    <section>
      <div>
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
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
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
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
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
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />

          <DatePicker
            className="w-full md:w-1/4"
            value={selectedDate}
            onChange={handleDateChange}
            defaultValue={dayjs()}
          />

          <Button
            type="default"
            variant="outlined"
            icon={<DownloadOutlined />}
            onClick={handleExportExcel}
          >
            Export Excel
          </Button>
          <Button
            type="default"
            danger
            variant="outlined"
            disabled={status === 'PROCESSING'}
            icon={<DownloadOutlined />}
            onClick={handleExportPPTX}
          >
            {status === 'PROCESSING' ? 'Đang xử lý...' : 'Export PowerPoint'}
          </Button>
        </div>
        <div className="p-6">
          <Spin spinning={isFetching}>
            <Table
              dataSource={data?.content || []}
              rowKey={(record) => record.shiftId}
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
              src={previewImage || ""}
              alt="Preview"
              className="h-auto w-full object-contain"
              onLoad={() => setImageLoading(false)}
            />
          </Spin>
        </Modal>
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
              <div className="flex justify-center mb-4">
                <svg className="animate-spin h-6 w-6 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              </div>
              <p className="text-lg font-medium mb-2">Đang tạo file PowerPoint...</p>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-600 animate-pulse w-1/2"></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Vui lòng đợi trong giây lát.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AttendanceSection;
