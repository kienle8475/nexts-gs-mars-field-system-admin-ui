/** @jsxImportSource @emotion/react */
"use client";
import { cn, nanoid } from "@/utils/common";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { IconBaseProps } from "react-icons/lib";
import {
  MdLocationOn,
  MdAccountCircle,
  MdOutlineCalendarToday,
  MdShoppingCart,
  MdInventory,
  MdOutlineInventory2,
  MdOutlineShoppingCart,
  MdOutlineLocationOff,
  MdOutlineAccountCircle,
  MdOutlineStore,
  MdOutlineReport,
  MdOutlineAir,
  MdContentPaste,
} from "react-icons/md";
import { useControllableState } from "@/hooks/use-controllable-state";
import { motion, AnimatePresence } from "framer-motion";
import { css } from "@emotion/react";
import { Icons } from "../elements/icons";
import { IoMdGift, IoMdTabletLandscape, IoMdTabletPortrait } from "react-icons/io";

type MenuItem = {
  id: string;
  name: string;
  slug?: string;
  icon: (props: IconBaseProps) => JSX.Element | any;
  subitems: {
    id: string;
    name: string;
    slug: string;
  }[];
};

type MenuGroup = {
  name: string;
  items: MenuItem[];
};

export const Navbar = () => {
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);

  const routers = React.useMemo<MenuGroup[]>(() => {
    return [
      {
        name: "Báo cáo",
        items: [
          {
            id: nanoid(),
            name: "Chấm công",
            slug: "/attendances",
            icon: IoMdTabletPortrait,
            subitems: [],
          },
          {
            id: nanoid(),
            name: "Bán Hàng",
            slug: "/sales",
            icon: MdOutlineShoppingCart,
            subitems: [],
          },
          {
            id: nanoid(),
            name: "OOS",
            slug: "/oos",
            icon: MdOutlineInventory2,
            subitems: [],
          },
          {
            id: nanoid(),
            name: "Sampling",
            slug: "/sampling",
            icon: IoMdGift,
            subitems: [],
          },
          {
            id: nanoid(),
            name: "Rời vị trí",
            slug: "/leave",
            icon: MdOutlineLocationOff,
            subitems: [],
          },
        ],
      },
      {
        name: "Quản lý",
        items: [
          {
            id: nanoid(),
            name: "Nhân viên",
            slug: "/staffs",
            icon: MdOutlineAccountCircle,
            subitems: [],
          },
          {
            id: nanoid(),
            name: "Địa điểm",
            slug: "/outlets",
            icon: MdOutlineStore,
            subitems: [],
          },
          {
            id: nanoid(),
            name: "Ca làm việc",
            slug: "/working-shift",
            icon: MdOutlineCalendarToday,
            subitems: [],
          },
          {
            id: nanoid(),
            name: "Danh mục báo cáo",
            slug: "/report-item",
            icon: MdContentPaste,
            subitems: [],
          },
        ],
      },
    ];
  }, []);

  const pathname = usePathname();

  const handleClickItem = (id: string) => {
    setSelectedItemId(id);
  };

  React.useEffect(() => {
    const foundItem = routers
      .flatMap((router) => router.items)
      .find((item) => item.slug === pathname);

    if (foundItem) {
      setSelectedItemId(foundItem.id);
    }
  }, [pathname, routers]);

  return (
    <div>
      <ul>
        {routers.map((group, idx) => {
          return (
            <li key={idx} className="mt-4">
              <p className="py-3 pl-6 pr-3 text-[12px] font-semibold uppercase text-text-low-emp">
                {group.name}
              </p>
              <ul>
                {group.items.map((item, idx2) => {
                  if (item.subitems.length > 0) {
                    return (
                      <MenuAccordion
                        key={idx2}
                        idx={idx2}
                        item={item}
                        selectedItemId={selectedItemId}
                        onSelectedItemIdChange={setSelectedItemId}
                      />
                    );
                  }

                  return (
                    <li
                      key={idx2}
                      className={cn(
                        "group/item relative my-1 flex h-[40px] items-center justify-start bg-white active:bg-primary--8",
                        {
                          "border-r-[2px] border-r-primary-base bg-primary--8":
                            item.id === selectedItemId,
                        },
                      )}
                      css={css`
                        position: relative;
                        z-index: ${idx2 + 1};
                      `}
                      onClick={() => handleClickItem(item.id)}
                    >
                      {item.slug && (
                        <Link
                          href={item.slug}
                          className="flex grow items-center justify-start gap-3 py-2 pl-6 pr-3"
                        >
                          {React.createElement(item.icon, {
                            className: cn(
                              "fill-text-medium-emp shirk-0 w-[20px] h-[20px] transition-all duration-100 group-hover/item:fill-primary-base",
                              { "fill-primary-base": item.id === selectedItemId },
                            ),
                          })}
                          <p
                            className={cn(
                              "text-[14px] font-semibold text-text-medium-emp transition-all duration-100 group-hover/item:text-primary-base",
                              { "text-primary-base": item.id === selectedItemId },
                            )}
                          >
                            {item.name}
                          </p>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

interface MenuAccordionProps {
  idx: number;
  item: MenuItem;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (e: boolean) => void;
  defaultSelectedItemId?: string | null;
  selectedItemId?: string | null;
  onSelectedItemIdChange?: (e: string | null) => void;
}

const MenuAccordion = (props: MenuAccordionProps) => {
  const {
    idx,
    item,
    defaultExpanded: defaultExpandedProp,
    expanded: expandedProp,
    onExpandedChange: onExpandedChangeProp,
    defaultSelectedItemId: defaultSelectedItemIdProp,
    selectedItemId: selectedItemIdProp,
    onSelectedItemIdChange: onSelectedItemIdChangeProp,
  } = props;

  const [isExpand, setIsExpand] = useControllableState<boolean>({
    defaultProp: defaultExpandedProp,
    prop: expandedProp,
    onChange: onExpandedChangeProp,
  });
  const [selectedItemId, setSelectedItemId] = useControllableState<string | null>({
    defaultProp: defaultSelectedItemIdProp,
    prop: selectedItemIdProp,
    onChange: onSelectedItemIdChangeProp,
  });

  const isSelfHasSelected = React.useMemo(() => {
    const foundItem = item.subitems.find((item) => item.id === selectedItemId);
    return !!foundItem;
  }, [selectedItemId]);

  const pathname = usePathname();

  const handleToggleExpand = () => {
    setIsExpand(!isExpand);
  };

  const handleOnItemSelectedChange = (id: string) => {
    setSelectedItemId(id);
  };

  React.useEffect(() => {
    const foundItem = item.subitems.find((item) => item.slug === pathname);

    if (foundItem) {
      setSelectedItemId(foundItem.id);
      setIsExpand(true);
    }
  }, [pathname, item]);

  React.useEffect(() => {
    if (!isSelfHasSelected) {
      setIsExpand(false);
    }
    if (isSelfHasSelected) {
      setIsExpand(true);
    }
  }, [isSelfHasSelected]);

  return (
    <li
      className={cn("my-1")}
      css={css`
        position: relative;
        z-index: ${idx + 1};
      `}
    >
      <button
        className="group/item flex h-[40px] w-full grow items-center justify-between gap-4 bg-white py-2 pl-6 pr-3 active:bg-primary--8"
        onClick={handleToggleExpand}
      >
        <div className="flex items-center justify-start gap-3">
          {React.createElement(item.icon, {
            className: cn(
              "fill-text-medium-emp shirk-0 w-[20px] h-[20px] transition-all duration-100 group-hover/item:fill-primary-base",
              { "fill-primary-base": isSelfHasSelected },
            ),
          })}
          <p
            className={cn(
              "text-[14px] font-semibold text-text-medium-emp transition-all duration-100 group-hover/item:text-primary-base",
              { "text-primary-base": isSelfHasSelected },
            )}
          >
            {item.name}
          </p>
        </div>

        {(() => {
          if (isExpand) {
            return (
              <Icons.Collapse
                width={18}
                height={18}
                className={cn(
                  "stroke-text-medium-emp stroke-[5px] transition-all duration-100 group-hover/item:stroke-primary-base",
                  {
                    "stroke-primary-base": isSelfHasSelected,
                  },
                )}
              />
            );
          }
          if (!isExpand) {
            return (
              <Icons.Expand
                width={18}
                height={18}
                className={cn(
                  "stroke-text-medium-emp stroke-[5px] transition-all duration-100 group-hover/item:stroke-primary-base",
                  {
                    "stroke-primary-base": isSelfHasSelected,
                  },
                )}
              />
            );
          }

          return <></>;
        })()}
      </button>

      {item.subitems.length > 0 && (
        <AnimatePresence initial={false}>
          {isExpand && (
            <ul>
              {item.subitems.map((subitem, idx) => {
                const isSelfSelected = subitem.id === selectedItemId;

                return (
                  <motion.li
                    key={idx}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={{
                      expanded: { opacity: 1, height: "auto" },
                      collapsed: { opacity: 0, height: 0 },
                    }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <Link
                      href={subitem.slug}
                      className="group/item block py-1"
                      onClick={() => {
                        handleOnItemSelectedChange(subitem.id);
                      }}
                    >
                      <div
                        className={cn(
                          "flex h-[40px] items-center justify-start active:bg-primary--8",
                          {
                            "border-r-[2px] border-r-primary-base bg-primary--8": isSelfSelected,
                          },
                        )}
                      >
                        <div className="group/subitem flex grow items-center justify-start gap-2 py-2 pl-12 pr-3">
                          <p
                            className={cn(
                              "text-[14px] font-semibold text-text-medium-emp transition-all duration-100 group-hover/subitem:text-primary-base",
                              { "text-primary-base": isSelfSelected },
                            )}
                          >
                            {subitem.name}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </AnimatePresence>
      )}
    </li>
  );
};
