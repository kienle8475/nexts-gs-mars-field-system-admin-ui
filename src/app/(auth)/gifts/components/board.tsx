/** @jsxImportSource @emotion/react */
"use client";
import { IGift } from "@/types/model";
import { wildCardSearchV2 } from "@/utils/antd";
import { cn, createSelectors, reorder } from "@/utils/common";
import { css } from "@emotion/react";
import { Flex, Input, Menu, Spin, Dropdown, message } from "antd";
import EventEmitter from "eventemitter3";
import React from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { createStore, StoreApi } from "zustand";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DragStart,
  DragUpdate,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  DropResult,
} from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { EllipsisDropdown } from "@/components/shared/ellipsis-dropdown";
import { EditGiftModal } from "./edit-gift.modal";
import { createPortal } from "react-dom";
import { GiftsSetDetails } from "@/types/extend";
import { ConfigGiftModal } from "./config-gift.modal";
import { MdOutlineDelete } from "react-icons/md";

/* -------------------------------------------------------------------------------------------------
 * Config Store
 * -----------------------------------------------------------------------------------------------*/

export type BoardAffectItem = { event: "REORDER_OUTLET" | "UPDATE_GIFTS"; outletId: string };

interface ScopeStore {
  gifts: IGift[];
  displayGifts: IGift[];
  giftsSetsFreeze: GiftsSetDetails[];
  giftsSets: GiftsSetDetails[];
  onGiftsSetsChange: (e: GiftsSetDetails[]) => void;
  loadingGifts: boolean;
  loadingGiftsSets: boolean;
  boardAffects: BoardAffectItem[];
  onBoardAffectsChange: (e: BoardAffectItem[]) => void;

  drogGiftResult: DropResult | null;
}

const createScopeStore = (initStore: Omit<ScopeStore, "displayGifts" | "drogGiftResult">) => {
  return createStore<ScopeStore>((store) => ({
    displayGifts: [],
    drogGiftResult: null,
    ...initStore,
  }));
};

/* -------------------------------------------------------------------------------------------------
 * Config Context
 * -----------------------------------------------------------------------------------------------*/

enum ScopeEventName {
  NOTHING = "nothing",
  DRAG_START = "dragStart",
  DRAG_UPDATE = "dragUpdate",
  DRAG_END = "dragEnd",
  REMOVE_GIFT = "removeGift",
}

const ScopeContext = React.createContext<
  { store: StoreApi<ScopeStore>; eventBus: EventEmitter<ScopeEventName> } | undefined
>(undefined);

interface ScopeContextProviderProps {
  initStore: Omit<ScopeStore, "displayGifts" | "drogGiftResult">;
  children: React.ReactNode;
}

const ScopeContextProvider = React.memo((props: ScopeContextProviderProps) => {
  const { initStore, children } = props;

  const storeRef = React.useRef<StoreApi<ScopeStore>>(createScopeStore(initStore));
  const eventBusRef = React.useRef(new EventEmitter<ScopeEventName>());

  const storeSelectors = createSelectors(storeRef.current);

  React.useEffect(() => {
    storeSelectors.setState({
      ...initStore,
    });
  }, [initStore]);

  return (
    <ScopeContext.Provider value={{ store: storeRef.current, eventBus: eventBusRef.current }}>
      {children}
    </ScopeContext.Provider>
  );
});
ScopeContextProvider.displayName = "Widget.ScopeContextProvider";

const useScopeContext = () => {
  const context = React.useContext(ScopeContext);
  if (!context) {
    throw new Error("Missing ScopeContextProvider");
  }

  return { ...context, store: createSelectors(context.store) };
};

/* -------------------------------------------------------------------------------------------------
 * Elements
 * -----------------------------------------------------------------------------------------------*/
interface RootProps {
  gifts: ScopeStore["gifts"];
  giftsSetsFreeze: ScopeStore["giftsSetsFreeze"];
  giftsSets: ScopeStore["giftsSets"];
  onGiftsSetsChange?: ScopeStore["onGiftsSetsChange"];
  loadingGifts?: ScopeStore["loadingGifts"];
  loadingGiftsSets?: ScopeStore["loadingGiftsSets"];
  boardAffects?: ScopeStore["boardAffects"];
  onBoardAffectsChange?: ScopeStore["onBoardAffectsChange"];
}

const Root = (props: RootProps) => {
  const {
    gifts,
    giftsSetsFreeze,
    giftsSets,
    onGiftsSetsChange = () => {},
    loadingGifts = false,
    loadingGiftsSets = false,
    boardAffects = [],
    onBoardAffectsChange = () => {},
  } = props;

  return (
    <ScopeContextProvider
      initStore={{
        gifts: gifts,
        giftsSetsFreeze: giftsSetsFreeze,
        giftsSets: giftsSets,
        onGiftsSetsChange: onGiftsSetsChange,
        loadingGifts: loadingGifts,
        loadingGiftsSets: loadingGiftsSets,
        boardAffects: boardAffects,
        onBoardAffectsChange: onBoardAffectsChange,
      }}
    >
      <Entry />
    </ScopeContextProvider>
  );
};

export const Entry = () => {
  const scopeContext = useScopeContext();
  const scopeStore = scopeContext.store;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border-low-emp bg-white">
        <Board />
      </div>
    </>
  );
};

const Board = () => {
  const scopeContext = useScopeContext();
  const scopeEventBus = scopeContext.eventBus;
  const scopeStore = scopeContext.store;
  const displayGifts = scopeStore.use.displayGifts();
  const giftsSets = scopeStore.use.giftsSets();
  const giftsSetsFreeze = scopeStore.use.giftsSetsFreeze();
  const onGiftsSetsChange = scopeStore.use.onGiftsSetsChange();
  const onBoardAffectsChange = scopeStore.use.onBoardAffectsChange();
  const drogGiftResult = scopeStore.use.drogGiftResult();

  const targetDropGift = React.useMemo(() => {
    if (drogGiftResult) {
      const { source, destination } = drogGiftResult;
      if (!destination) return;
      const sourceIndex = source.index;
      return displayGifts[sourceIndex];
    }
    return null;
  }, [drogGiftResult]);

  const targetGiftsSet = React.useMemo(() => {
    if (drogGiftResult) {
      const { source, destination } = drogGiftResult;
      if (!destination) return;
      const destinationGiftsSetId = destination.droppableId;
      const destinationGiftsSetIndex = giftsSets.findIndex(
        (giftsSet) => giftsSet._id === destinationGiftsSetId,
      );
      return giftsSets[destinationGiftsSetIndex];
    }
    return null;
  }, [drogGiftResult]);

  const updateBoardAffects = (newGiftsSets: GiftsSetDetails[]) => {
    const updatedAffects: { event: "REORDER_OUTLET" | "UPDATE_GIFTS"; outletId: string }[] = [];

    newGiftsSets.forEach((newGiftsSet, index) => {
      const originalGiftsSets = giftsSetsFreeze.find((origin) => origin._id === newGiftsSet._id);

      if (!originalGiftsSets) return;

      if (newGiftsSet.order !== originalGiftsSets.order) {
        updatedAffects.push({
          event: "REORDER_OUTLET",
          outletId: newGiftsSet.outlet._id,
        });
      }

      if (newGiftsSet._id === originalGiftsSets._id) {
        const newGifts = newGiftsSet.gifts || [];
        const originalGifts = originalGiftsSets.gifts || [];

        const isMembersChanged =
          newGifts.length !== originalGifts.length ||
          newGifts.some((newGift, memberIndex) => {
            const originalMember = originalGifts[memberIndex];
            return (
              !originalMember ||
              newGift.gift._id !== originalMember.gift._id ||
              newGift.order !== originalMember.order
            );
          });

        if (isMembersChanged) {
          updatedAffects.push({
            event: "UPDATE_GIFTS",
            outletId: newGiftsSet.outlet._id,
          });
        }
      }
    });

    scopeStore.setState({ boardAffects: updatedAffects });
    onBoardAffectsChange(updatedAffects);
  };

  const handleConfigGiftComplete = (e: { quantity: number }) => {
    if (drogGiftResult) {
      const { source, destination } = drogGiftResult!;
      if (!destination) return;

      const destinationGiftsSetId = destination.droppableId;

      const sourceIndex = source.index;
      const destinationIndex = destination.index;

      if (source.droppableId === "gifts-pool") {
        const destinationGiftsSetIndex = giftsSets.findIndex(
          (giftSet) => giftSet._id === destinationGiftsSetId,
        );

        if (destinationGiftsSetIndex === -1) {
          console.warn("Target gifts set not found!");
          return;
        }

        const targetGift = displayGifts[sourceIndex];
        if (!targetGift) {
          console.warn("Target gift not found!");
          return;
        }

        const updatedGiftsSet = {
          ...giftsSets[destinationGiftsSetIndex],
          gifts: [...giftsSets[destinationGiftsSetIndex].gifts],
        };

        updatedGiftsSet.gifts.splice(destinationIndex, 0, {
          gift: targetGift,
          quantity: e.quantity,
          stock: e.quantity,
          order: updatedGiftsSet.gifts.length,
        });

        let duplicateFound = false;
        const uniqueGifts = updatedGiftsSet.gifts.reduce((acc: any, current: any) => {
          const x = acc.find((item: any) => item.gift._id === current.gift._id);
          if (!x) {
            return acc.concat([current]);
          } else {
            duplicateFound = true;
            return acc;
          }
        }, []);

        if (duplicateFound) {
          message.warning("Quà tặng đã có trong set");
        }

        updatedGiftsSet.gifts = uniqueGifts;

        const newGiftsSets = [
          ...giftsSets.slice(0, destinationGiftsSetIndex),
          updatedGiftsSet,
          ...giftsSets.slice(destinationGiftsSetIndex + 1),
        ];

        scopeStore.setState({ giftsSets: newGiftsSets });
        onGiftsSetsChange(newGiftsSets);
        updateBoardAffects(newGiftsSets);
      }

      scopeStore.setState({ drogGiftResult: null });
    }
  };

  const handleDragOutletEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    const newGiftsSets = reorder(giftsSets, sourceIndex, destinationIndex);
    scopeStore.setState({ giftsSets: newGiftsSets });
    onGiftsSetsChange(newGiftsSets);
    updateBoardAffects(newGiftsSets);
  };

  const handleDragGiftEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceOutletId = source.droppableId;
    const destinationOutletId = destination.droppableId;

    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    if (destination.droppableId === "gifts-pool") {
      return;
    }

    if (source.droppableId === "gifts-pool") {
      scopeStore.setState({ drogGiftResult: result });
    } else {
      if (sourceOutletId === destinationOutletId) {
        const newGiftsSets = giftsSets.map((giftsSet) => {
          if (giftsSet._id === sourceOutletId) {
            return {
              ...giftsSet,
              gifts: reorder(giftsSet.gifts, sourceIndex, destinationIndex),
            };
          }
          return giftsSet;
        });
        scopeStore.setState({ giftsSets: newGiftsSets });
        onGiftsSetsChange(newGiftsSets);
        updateBoardAffects(newGiftsSets);
      }
    }
  };

  const handleDragStart = (start: DragStart) => {
    scopeEventBus.emit(ScopeEventName.DRAG_START);
  };

  const handleDragUpdate = (update: DragUpdate) => {
    scopeEventBus.emit(ScopeEventName.DRAG_UPDATE);
  };

  const handleDragEnd = (result: DropResult) => {
    scopeEventBus.emit(ScopeEventName.DRAG_END);

    if (result.type === "outlets-zone") {
      handleDragOutletEnd(result);
    }

    if (result.type === "gifts-zone") {
      handleDragGiftEnd(result);
    }
  };

  const handleRemoveGift = (payload: { giftsSetId: string; giftId: string }) => {
    const giftsSetIndex = giftsSets.findIndex((giftSet) => giftSet._id === payload.giftsSetId);
    if (giftsSetIndex === -1) {
      console.warn("Gifts set not found!");
      return;
    }

    const targetGiftsSet = giftsSets[giftsSetIndex];

    const updatedGiftsSet = {
      ...targetGiftsSet,
      gifts: targetGiftsSet.gifts.filter((gift) => gift.gift._id !== payload.giftId),
    };

    const newGiftsSets = [
      ...giftsSets.slice(0, giftsSetIndex),
      updatedGiftsSet,
      ...giftsSets.slice(giftsSetIndex + 1),
    ];

    scopeStore.setState({ giftsSets: newGiftsSets });
    onGiftsSetsChange(newGiftsSets);
    updateBoardAffects(newGiftsSets);

    message.warning("Quà tặng đã được xóa khỏi set tạm thời");
  };

  React.useEffect(() => {
    scopeEventBus.on(ScopeEventName.REMOVE_GIFT, handleRemoveGift);

    return () => {
      scopeEventBus.off(ScopeEventName.REMOVE_GIFT, handleRemoveGift);
    };
  }, [giftsSets, giftsSetsFreeze]);

  React.useEffect(() => {
    scopeStore.setState({ boardAffects: [] });
  }, [giftsSetsFreeze]);

  return (
    <>
      <DragDropContext
        onDragStart={handleDragStart}
        onDragUpdate={handleDragUpdate}
        onDragEnd={handleDragEnd}
      >
        <div className="relative flex items-stretch justify-between">
          <GiftsPool />
          <Outlets />
        </div>
      </DragDropContext>

      {createPortal(
        <ConfigGiftModal
          gift={targetDropGift!}
          giftsSet={targetGiftsSet!}
          isOpen={drogGiftResult !== null && targetDropGift !== null && targetGiftsSet !== null}
          onOpenChange={() => {
            scopeStore.setState({ drogGiftResult: null });
          }}
          onComplete={(e) => {
            handleConfigGiftComplete(e);
          }}
        />,
        document.body,
      )}
    </>
  );
};

const GiftsPool = () => {
  const scopeContext = useScopeContext();
  const scopeStore = scopeContext.store;
  const gifts = scopeStore.use.gifts();
  const loadingGifts = scopeStore.use.loadingGifts();
  const displayGifts = scopeStore.use.displayGifts();

  const onSearch = (e: any) => {
    const value = e.currentTarget.value;
    const searchArray = gifts;
    const data = wildCardSearchV2(searchArray, value);
    scopeStore.setState({ displayGifts: data });
  };

  React.useEffect(() => {
    scopeStore.setState({ displayGifts: gifts });
  }, [gifts]);

  const searchJsx = () => {
    return (
      <div
        className="border-b border-border-low-emp"
        css={css`
          .ant-input-outlined:hover {
            border: none;
            outline: none;
            box-shadow: none;
            filter: none;
          }
          .ant-input-outlined:focus {
            border: none;
            outline: none;
            box-shadow: none;
            filter: none;
          }

          animation-duration: 50000s;
        `}
      >
        <Input
          placeholder="Tìm kiếm"
          prefix={<HiOutlineSearch size={16} className="mx-1 h-full stroke-text-high-emp py-2" />}
          onChange={(e) => onSearch(e)}
          className="rounded-none border-none text-[14px]"
          allowClear
        />
      </div>
    );
  };

  return (
    <div className="relative w-fit border-r border-r-border-low-emp pb-4">
      {searchJsx()}

      {loadingGifts && (
        <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center bg-neutral--8/[0.2]">
          <Spin size={"default"} />
        </div>
      )}

      <Droppable droppableId="gifts-pool" type="gifts-zone" direction="vertical">
        {(provided: DroppableProvided, dropSnapshot: DroppableStateSnapshot) => (
          <ul
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="max-h-[70vh] min-h-[600px] w-[280px] min-w-[250px] overflow-auto"
            css={css`
              & > li {
                border-bottom: 1px solid #e3e6f0;
              }
            `}
          >
            {displayGifts.map((gift, idx) => (
              <GiftCardOnPool key={gift._id} idx={idx} gift={gift} />
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );
};

interface GiftCardOnPoolProps {
  idx: number;
  gift: IGift;
}

const GiftCardOnPool = (props: GiftCardOnPoolProps) => {
  const { idx, gift } = props;

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const dropdownMenu = () => (
    <Menu>
      <Menu.Item
        onClick={(e) => {
          e.domEvent.stopPropagation();
          handleEdit();
        }}
      >
        <div className="flex items-center justify-center">
          <EditOutlined />
          <span className="ml-2">Chỉnh sửa</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Draggable draggableId={`gifts-pool:${gift._id}`} index={idx}>
        {(provided: DraggableProvided, dragSnapshot: DraggableStateSnapshot) => (
          <>
            <li
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="cursor-pointer select-none"
            >
              <div className="flex items-start justify-between gap-2 bg-white p-4 hover:bg-neutral--9">
                <div className="flex items-center justify-start gap-3">
                  <div className="shrink-0">
                    <img
                      src={gift.image_url}
                      className="aspect-square h-[42px] w-[42px] rounded-full bg-white object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1 font-semibold">{gift.label}</p>
                    <p className="line-clamp-1 text-[12px] font-normal text-text-low-emp">
                      {gift.code}
                    </p>
                  </div>
                </div>

                <EllipsisDropdown menu={dropdownMenu()} />
              </div>

              {dragSnapshot.isDragging && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="pointer-events-none absolute inset-0 z-[2] select-none bg-white"
                  css={css`
                    mask-image: linear-gradient(20deg, rgba(255, 255, 255, 1) 20%, transparent 80%);
                  `}
                />
              )}
            </li>

            {dragSnapshot.isDragging && (
              <li
                className="cursor-pointer select-none"
                css={css`
                  transform: none !important;
                `}
              >
                <div className="flex items-center justify-start gap-3 bg-white p-4 hover:bg-neutral--9">
                  <div className="shrink-0">
                    <img
                      src={gift.image_url}
                      className="aspect-square h-full w-[42px] rounded-full bg-white object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1 font-semibold">{gift.label}</p>
                    <p className="line-clamp-1 text-[12px] font-normal text-text-low-emp">
                      {gift.code}
                    </p>
                  </div>
                </div>
              </li>
            )}
          </>
        )}
      </Draggable>

      {createPortal(
        <EditGiftModal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} gift={gift} />,
        document.body,
      )}
    </>
  );
};

const Outlets = () => {
  const scopeContext = useScopeContext();
  const scopeStore = scopeContext.store;
  const giftsSets = scopeStore.use.giftsSets();
  const loadingGiftsSets = scopeStore.use.loadingGiftsSets();

  return (
    <>
      <Droppable droppableId="board" type="outlets-zone" direction="horizontal">
        {(provided: DroppableProvided, dropSnapshot: DroppableStateSnapshot) => (
          <ul
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="relative flex w-fit grow items-stretch justify-start overflow-auto p-4"
          >
            {loadingGiftsSets && (
              <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center bg-neutral--8/[0.2]">
                <Spin size={"default"} />
              </div>
            )}

            {giftsSets
              .sort((a, b) => a.order - b.order)
              .map((giftsSet, idx) => {
                return <OutletColumn key={giftsSet._id} idx={idx} giftsSet={giftsSet} />;
              })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </>
  );
};

interface OutletColumnProps {
  idx: number;
  giftsSet: ScopeStore["giftsSets"][0];
}

const OutletColumn = React.memo((props: OutletColumnProps) => {
  const { idx, giftsSet } = props;

  return (
    <>
      <Draggable draggableId={giftsSet._id} index={idx}>
        {(provided: DraggableProvided, dragSnapshot: DraggableStateSnapshot) => (
          <li
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="m-2 flex flex-col items-stretch justify-between rounded-lg border border-border-low-emp bg-[#FAFAFA]"
          >
            <div className="mb-3 space-y-3">
              <div
                {...provided.dragHandleProps}
                className={cn("p-4", { "bg-primary--8": dragSnapshot.isDragging })}
              >
                <div className="flex items-center justify-start gap-3">
                  <p className="whitespace-nowrap text-[14px] font-semibold">
                    {giftsSet.outlet.name}
                  </p>
                  <div className="flex h-fit w-fit min-w-[20px] shrink-0 items-center justify-center rounded-sm bg-white text-justify drop-shadow-gray">
                    <p className="text-[12px] font-semibold leading-[20px]">
                      {giftsSet.gifts.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Droppable droppableId={giftsSet._id} type="gifts-zone" direction="vertical">
              {(provided: DroppableProvided, dropSnapshot: DroppableStateSnapshot) => (
                <ul
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "relative max-h-[75vh] min-w-[300px] grow overflow-auto overflow-y-auto p-4 transition-colors",
                    { "bg-green--8": dropSnapshot.isDraggingOver },
                    {
                      "bg-primary--9":
                        !dropSnapshot.isDraggingOver && Boolean(dropSnapshot.draggingFromThisWith),
                    },
                  )}
                >
                  {giftsSet.gifts.map((gift, idx) => {
                    return (
                      <GiftItem key={gift.gift._id} giftsSet={giftsSet} gift={gift} idx={idx} />
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </li>
        )}
      </Draggable>
    </>
  );
});
OutletColumn.displayName = "Board.OutletColumn";

interface GiftItemProps {
  idx: number;
  giftsSet: ScopeStore["giftsSets"][0];
  gift: ScopeStore["giftsSets"][0]["gifts"][0];
}

const GiftItem = React.memo((props: GiftItemProps) => {
  const { idx, giftsSet, gift } = props;

  const scopeContext = useScopeContext();
  const scopeEventBus = scopeContext.eventBus;

  const dropdownMenu = () => (
    <Menu>
      <Menu.Item
        onClick={(e) => {
          e.domEvent.stopPropagation();
          scopeEventBus.emit(ScopeEventName.REMOVE_GIFT, {
            giftsSetId: giftsSet._id,
            giftId: gift.gift._id,
          });
        }}
      >
        <div className="flex items-center justify-center">
          <MdOutlineDelete />
          <span className="ml-2">Xóa</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Draggable draggableId={`${giftsSet._id}:${gift.gift._id}`} index={idx}>
        {(provided: DraggableProvided, dragSnapshot: DraggableStateSnapshot) => (
          <li
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={cn("relative mb-2 min-w-[300px] max-w-[300px] drop-shadow-gray")}
          >
            <div className="flex items-start justify-between gap-3 bg-white p-4 hover:bg-neutral--9">
              <div>
                <div className="flex items-center justify-start gap-3">
                  <div className="shrink-0">
                    <img
                      src={gift.gift.image_url}
                      className="aspect-square h-full w-[42px] rounded-full bg-white object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1 font-semibold">{gift.gift.label}</p>
                    <p className="line-clamp-1 text-[12px] font-normal text-text-low-emp">
                      {gift.gift.code}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-start gap-4">
                  <p className="text-sm text-text-low-emp">
                    Khởi tạo: <strong className="text-text-high-emp">{gift.quantity}</strong>
                  </p>
                  <p className="text-sm text-text-low-emp">
                    Khả dụng: <strong className="text-text-high-emp">{gift.stock}</strong>
                  </p>
                </div>
              </div>

              <EllipsisDropdown menu={dropdownMenu()} />
            </div>

            {dragSnapshot.isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="pointer-events-none absolute inset-0 z-[2] select-none bg-white"
                css={css`
                  mask-image: linear-gradient(20deg, rgba(255, 255, 255, 1) 20%, transparent 80%);
                `}
              />
            )}
          </li>
        )}
      </Draggable>
    </>
  );
});

export { Root as Board };
export type { RootProps as BoardProps };
