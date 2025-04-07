/** @jsxImportSource @emotion/react */
"use client";
import { css } from "@emotion/react";
import React from "react";
import { Decorator } from "./decorator";
import QRCodeStyling from "qr-code-styling";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@/components/elements/icons";
import { useQueryOutletById } from "@/services/outlet/get-by-id";

const QRSection = () => {
  const searchParams = useSearchParams();

  const [targetOutletId, setTargetOutletId] = React.useState<string | null | undefined>(undefined);

  const qrCode = React.useRef<QRCodeStyling | null>(null);
  const qrContainerRef = React.useRef<HTMLDivElement>(null);

  const router = useRouter();

  const outletbyIdQuery = useQueryOutletById({
    params: { id: targetOutletId! },
    config: {
      enabled: targetOutletId !== null && targetOutletId !== undefined,
    },
  });

  React.useEffect(() => {
    console.log(outletbyIdQuery);
    if (outletbyIdQuery.error) {
      router.replace("/outlets");
    }
  }, [outletbyIdQuery.error]);

  React.useEffect(() => {
    let oParam = searchParams?.get("o");

    if (!oParam) {
      router.replace("/outlets");
    }

    setTargetOutletId(oParam);

    qrCode.current = new QRCodeStyling({
      width: 300,
      height: 300,
      data: `${process.env.NEXT_PUBLIC_CLIENT_TIGER_URL}?o=${oParam}`,
      dotsOptions: { color: "#000", type: "rounded" },
      backgroundOptions: { color: "#fff" },
    });

    if (qrContainerRef.current) {
      qrCode.current.append(qrContainerRef.current);
    }

    return () => {
      if (qrContainerRef.current) {
        qrContainerRef.current.innerHTML = "";
      }
      qrCode.current = null;
    };
  }, []);

  return (
    <section className="mx-auto h-screen max-w-[1440px] font-heineken text-white">
      <div className="relative z-[5] flex h-full items-stretch justify-center py-12">
        <div className="mx-auto my-auto grid h-full max-h-[750px] w-full max-w-[800px] grid-cols-7 px-4 md:px-12">
          <div className="col-span-7 flex flex-col items-center justify-between rounded-[20px] bg-black/20 p-5 py-12 backdrop-blur-[24px] md:col-span-5 md:items-start md:bg-transparent md:py-5 md:backdrop-blur-0">
            <h1
              className="mb-8 w-fit bg-gradient-to-r from-[#FFBC5A] via-[#FFD390] to-[#FFBB5B] bg-clip-text text-center text-3xl font-bold uppercase leading-[42px] tracking-wide text-transparent md:text-left md:text-4xl md:leading-[56px]"
              css={css`
                filter: drop-shadow(2px 2px 2px #472b0080);
              `}
            >
              Săn ngay <br />
              vật phẩm bản lĩnh
            </h1>

            <div className="mb-6">
              <h2 className="mb-4 text-center text-base font-medium text-white md:text-left md:text-xl">
                Quét mã QR để tham gia ngay
              </h2>
              <div
                ref={qrContainerRef}
                id="el--qr-container"
                className="h-fit w-fit rounded-xl bg-white p-4"
              />
              {outletbyIdQuery.data && (
                <h3 className="mt-4 px-4 text-center text-sm font-normal leading-[24px] text-white md:p-0 md:text-left md:text-base md:leading-[28px]">
                  {outletbyIdQuery.data.data.name} - {outletbyIdQuery.data.data.province.name}
                </h3>
              )}
            </div>

            <div className="flex flex-col flex-wrap items-center justify-start gap-3 overflow-hidden md:flex-row">
              <div className="flex items-center justify-start gap-2">
                <Icons.NoPregnant width={28} height={28} />
                <Icons.No18PlusAge width={28} height={28} />
                <Icons.NoCar width={28} height={28} />
              </div>
              <p className="text-xs font-normal leading-[20px] text-white">
                Người dưới 18 tuổi không được uống rượu, bia
              </p>
            </div>
          </div>
        </div>
      </div>
      <Decorator />
    </section>
  );
};

export default QRSection;
