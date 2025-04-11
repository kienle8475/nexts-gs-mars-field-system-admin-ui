"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Modal, Pagination, Select, Spin, Table, Tag, Tooltip, Form, Input, Space, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { OutletOption, useOutletsByProvince } from "@/services/outlet/list-option";
import { ProvinceOption, useAllProvincesOptions } from "@/services/province/list-option";
import { ColumnsType, ColumnType } from "antd/es/table";
import { useStaffLeaveReport } from "@/services/staff-leave/list";
import { useWorkingShifts, WorkingShiftItem } from "@/services/working-shift/list";
import { updateWorkingShift } from "@/services/working-shift/update";
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "text" | "datetime";
  record: WorkingShiftItem;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === "datetime" ? (
      <DatePicker showTime format="YYYY-MM-DD HH:mm" />
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Vui lòng nhập ${title}` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const WorkingShiftSection = () => {

  const [selectedProvinceId, setSelectedProvinceId] = useState<string>();
  const [selectedOutletId, setSelectedOutletId] = useState<string>();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [data, setData] = useState<WorkingShiftItem[]>([]);
  const [editingKey, setEditingKey] = useState<number | null>(null);

  const queryParams = useMemo(() => {
    return {
      ...(selectedOutletId !== undefined && { outletId: selectedOutletId }),
      ...(selectedProvinceId !== undefined && { provinceId: selectedProvinceId }),
      date: selectedDate?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD"),
    };
  }, [selectedProvinceId, selectedOutletId, selectedDate]);
  const { data: workingShifts, isFetching, refetch } = useWorkingShifts(queryParams);
  // === Gọi API outlet dựa vào selectedProvince ===
  const { data: outletOptions = [], isLoading: outletLoading } = useOutletsByProvince(Number(selectedProvinceId));
  const { data: provinceOptions = [], isLoading: provinceLoading } = useAllProvincesOptions();

  useEffect(() => {
    if (workingShifts) {
      setData([...workingShifts]);
    }
  }, [workingShifts]);

  const [form] = Form.useForm();


  const isEditing = (record: WorkingShiftItem) => record.id === editingKey;

  const edit = (record: WorkingShiftItem) => {
    form.setFieldsValue({
      name: record.name,
      startTime: dayjs(record.startTime),
      endTime: dayjs(record.endTime),
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey(null);
  };

  const save = async (id: number) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => item.id === id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
          startTime: row.startTime.toISOString(),
          endTime: row.endTime.toISOString(),
        });
        setData(newData);
        setEditingKey(null);
        updateWorkingShift(id, {
          name: row.name,
          startTime: row.startTime.toISOString(),
          endTime: row.endTime.toISOString(),
        });
        message.success("Cập nhật thành công");
        refetch();
      }
    } catch (errInfo) {
      message.success("Lỗi khi cập nhật ca làm");
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date.startOf("day"));
    }
  };

  const columns: (ColumnType<WorkingShiftItem> & { editable?: boolean })[] = [
    {
      title: "Tên điểm bán",
      dataIndex: ["outlet", "name"],
    },
    {
      title: "Tên ca",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "Bắt đầu",
      dataIndex: "startTime",
      render: (text) => dayjs(text).format("HH:mm DD/MM/YYYY"),
      editable: true,
    },
    {
      title: "Kết thúc",
      dataIndex: "endTime",
      render: (text) => dayjs(text).format("HH:mm DD/MM/YYYY"),
      editable: true,
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button onClick={() => save(record.id)} type="link">
              Lưu
            </Button>
            <Button onClick={cancel} type="link">
              Hủy
            </Button>
          </Space>
        ) : (
          <><Button
            icon={<EditOutlined />}
            type="link"
            disabled={editingKey !== null || record.checkedIn}
            onClick={() => edit(record)}
          >
            Sửa
          </Button><Tooltip title={record.checkedIn ? "Ca đã được check in" : ""}><InfoCircleOutlined /></Tooltip></>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) =>
    col.editable
      ? {
        ...col,
        onCell: (record: WorkingShiftItem) => ({
          record,
          inputType: col.dataIndex === "name" ? "text" : "datetime",
          dataIndex: col.dataIndex!,
          title: col.title as string,
          editing: isEditing(record),
        }),
      }
      : col
  );

  return (
    <section>
      <div className="flex items-center gap-4 border-b border-b-border-low-emp bg-white px-6 py-6">
        {/* Select Province */}
        <Select
          showSearch
          className="w-full md:w-1/3"
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
          className="w-full md:w-1/3"
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
          className="w-full md:w-1/3"
          value={selectedDate}
          onChange={handleDateChange}
          defaultValue={dayjs()}
        />
      </div>

      <div className="p-6">
        <Spin spinning={isFetching}>
          <Form form={form} component={false}>
            <Table
              dataSource={data}
              rowKey="id"
              columns={mergedColumns as ColumnsType<any>}
              components={{ body: { cell: EditableCell } }}
              pagination={false}
              scroll={{ x: true }}
            />
          </Form>
        </Spin>
      </div>
    </section>
  );
};

export default WorkingShiftSection;
