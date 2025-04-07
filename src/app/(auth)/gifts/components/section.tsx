"use client";
import { cn } from "@/utils/common";
import { Button, message, Modal, notification } from "antd";
import React from "react";
import { PiPlusBold } from "react-icons/pi";
import { CreateGiftModal } from "./create-gift.modal";
import { Board, BoardAffectItem } from "./board";
import { useQueryGiftsList } from "@/services/gift/list";
import { useQueryClient } from "react-query";
import { useAuthContext } from "@/contexts/auth.context";
import { useQueryGiftsSetListDetails } from "@/services/gifts-set/list-details";
import { GiftsSetDetails } from "@/types/extend";
import { ExclamationCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutationOutletGiftsSetUpdateGifts } from "@/services/gifts-set/update-gifts";
import { GrPowerReset } from "react-icons/gr";

const GiftSection = () => {
  const authContext = useAuthContext();
  const token = authContext.use.token();

  const queryClient = useQueryClient();

  const giftsListQuery = useQueryGiftsList({
    params: {
      token: token,
    },
  });

  const giftsSetListDetailsQuery = useQueryGiftsSetListDetails({
    params: {
      token: token,
    },
  });

  const [showCreateGiftForm, setShowCreateGiftForm] = React.useState(false);

  const [freezeGiftsSets, setFreezeGiftsSets] = React.useState<GiftsSetDetails[]>(
    giftsSetListDetailsQuery.data?.data || [],
  );
  const [updateGiftsSets, setUpdateGiftsSets] = React.useState<GiftsSetDetails[]>(
    giftsSetListDetailsQuery.data?.data || [],
  );
  const [boardAffects, setBoardAffects] = React.useState<BoardAffectItem[]>([]);

  const outletGiftsSetUpdateGiftsMutation = useMutationOutletGiftsSetUpdateGifts({
    config: {
      onSuccess(data, variables, context) {
        notification.success({
          message: "Lưu thay đổi thành công!",
          description: "Cập nhật phân bổ quà tặng",
        });
        queryClient.refetchQueries({ queryKey: ["query/gifts-set/list-details"] });
        setBoardAffects([]);
      },
      onError(error, variables, context) {
        notification.error({
          message: "Lưu thay đổi thất bại!",
          description: (error.response?.data as any)?.message || "Network error",
        });
      },
    },
  });

  const handleClickCreateGift = () => {
    setShowCreateGiftForm(true);
  };

  const handleConfirm = async () => {
    const updateGiftsAffects = boardAffects.filter((item) => item.event === "UPDATE_GIFTS");
    if (updateGiftsAffects.length > 0) {
      const outlets: {
        outlet: string;
        gifts: { gift: string; quantity: number; order: number }[];
      }[] = [];

      updateGiftsAffects.forEach((affectItem) => {
        const giftsSet = updateGiftsSets.find(
          (giftsSet) => giftsSet.outlet._id === affectItem.outletId,
        );
        if (giftsSet) {
          outlets.push({
            outlet: giftsSet.outlet._id,
            gifts: giftsSet.gifts.map((giftConfig) => ({
              gift: giftConfig.gift._id,
              quantity: giftConfig.quantity,
              order: giftConfig.order,
            })),
          });
        }
      });

      try {
        await outletGiftsSetUpdateGiftsMutation.mutateAsync({
          token: token,
          outlets: outlets,
        });
      } catch (error) { }
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Xác nhận lưu những thay đổi?",
      icon: <ExclamationCircleOutlined className="stroke-primary-base" />,
      content: "Dữ liệu cũ sẽ không được khôi phục!",
      centered: true,
      okCancel: true,
      okText: "Đồng ý",
      cancelText: "Hủy bỏ",
      onOk() {
        return new Promise((resolve, reject) => {
          handleConfirm().then(resolve).catch(reject);
        }).catch(() => { });
      },
      onCancel() { },
    });
  };

  React.useEffect(() => {
    if (giftsSetListDetailsQuery.data) {
      setUpdateGiftsSets(giftsSetListDetailsQuery.data.data);
      setFreezeGiftsSets(giftsSetListDetailsQuery.data.data);
    }
  }, [giftsSetListDetailsQuery.data]);

  React.useEffect(() => {
    console.log(boardAffects);
  }, [boardAffects]);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-b-border-low-emp bg-white px-6 py-6">
        <p className="text-[20px] font-semibold text-text-medium-emp">Phân bổ quà tặng</p>
        <div className="flex items-center justify-center gap-4">
          <Button
            type="primary"
            size="middle"
            icon={<PiPlusBold />}
            onClick={handleClickCreateGift}
          >
            <p className="text-[14px]">Tạo mới</p>
          </Button>
          <Button
            type="primary"
            size="middle"
            icon={<GrPowerReset />}
            onClick={() => {
              setUpdateGiftsSets(freezeGiftsSets);
              setBoardAffects([]);
              message.info("Reset dữ liệu thành công!");
            }}
            className={cn({
              "pointer-events-none cursor-not-allowed opacity-50": boardAffects.length === 0,
            })}
          >
            <p className="text-[14px]">Reset</p>
          </Button>
          <Button
            type="primary"
            size="middle"
            icon={<SaveOutlined />}
            onClick={showConfirm}
            className={cn({
              "pointer-events-none cursor-not-allowed opacity-50": boardAffects.length === 0,
            })}
          >
            <p className="text-[14px]">Lưu</p>
          </Button>
        </div>

        <CreateGiftModal isOpen={showCreateGiftForm} onOpenChange={setShowCreateGiftForm} />
      </div>

      <div className="mx-auto mb-12 mt-6 max-w-[1920px] px-4 lg:px-6">
        <Board
          gifts={giftsListQuery.data?.data || []}
          giftsSetsFreeze={freezeGiftsSets}
          giftsSets={updateGiftsSets}
          onGiftsSetsChange={setUpdateGiftsSets}
          loadingGifts={giftsListQuery.isLoading || giftsListQuery.isFetching}
          loadingGiftsSets={
            giftsSetListDetailsQuery.isLoading || giftsSetListDetailsQuery.isFetching
          }
          boardAffects={boardAffects}
          onBoardAffectsChange={setBoardAffects}
        />
      </div>
    </section>
  );
};

export default GiftSection;
