/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import { Icons } from "./icons";
import { useRipple } from "@/hooks/use-ripple";
import { useControllableState } from "@/hooks/use-controllable-state";
import { FileObj } from "@/types";
import { useDropzone } from "react-dropzone";
import { nanoid } from "@/utils/common";
import { Spinner } from "./spinner";

interface AvatarUpload {
  onUploaded?: (file: File) => void;
}

export const AvatarUpload = (props: AvatarUpload) => {
  const { onUploaded } = props;

  const { rippleContainer, createRipple } = useRipple({ center: true, duration: 800 });

  const [imageObj, setImageObj] = useControllableState<FileObj | null>({});

  const handleOnImageDrop = React.useCallback(
    (acceptedFiles: any) => {
      acceptedFiles.forEach((file: any) => {
        const tempObj = { uuid: nanoid(), file, uploading: true, url: null };

        const reader = new FileReader();
        reader.onabort = () => console.error("file reading was aborted");
        reader.onerror = () => console.error("file reading has failed");

        reader.onloadstart = () => {
          setImageObj(tempObj);
        };

        reader.onload = async () => {
          const url = reader.result as string;
          setTimeout(() => {
            setImageObj({ ...tempObj, uploading: false, url: url } as FileObj);
            onUploaded && onUploaded(file);
          }, 500);
        };

        reader.readAsDataURL(file);
      });
    },
    [onUploaded],
  );

  const imageDropzone = useDropzone({
    onDrop: handleOnImageDrop,
    maxFiles: 1,
    accept: { "image/jpeg": [".jpeg", ".png", ".heic"] },
  });

  const isManyFiles = React.useMemo(() => {
    return imageDropzone.fileRejections.length > 0;
  }, [imageDropzone.fileRejections]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-start gap-5">
        {(!imageObj || imageObj.uploading) && (
          <div className="aspect-square w-fit rounded-full bg-neutral--8 p-5">
            <Icons.User width={32} height={32} className="fill-neutral--5" />
          </div>
        )}
        {imageObj && !imageObj.uploading && imageObj.url && (
          <img
            src={imageObj.url || ""}
            alt="preview"
            className="block h-[72px] w-[72px] rounded-full object-cover"
          />
        )}
        <button
          {...imageDropzone.getRootProps()}
          type="button"
          onPointerDown={createRipple}
          className="relative flex items-center justify-center gap-3 rounded-md bg-primary-base px-3 py-2 transition-all duration-100 hover:bg-primary--2"
        >
          {rippleContainer}
          <input {...imageDropzone.getInputProps()} />
          {imageObj && imageObj.uploading && <Spinner.B color="white" speed={0.3} size={16} />}
          {!imageObj?.uploading && (
            <Icons.Upload width={16} height={16} className="shrink-0 stroke-white stroke-2" />
          )}
          <p className="relative z-[2] text-[14px] font-medium text-white">Tải lên ảnh đại diện</p>
        </button>
      </div>

      {isManyFiles && (
        <div className="rounded-[8px] bg-red--8 px-3 py-2">
          <p className="text-center text-[14px] font-normal text-red-base">
            Many files upload, maxium 1 image.
          </p>
        </div>
      )}
    </div>
  );
};
