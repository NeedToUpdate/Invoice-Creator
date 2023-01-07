import React, { useEffect, useRef, useState } from "react";
import { useDrag } from "../utils/hooks";
import Button from "./button";
import TrashIcon from "./icons/trash";

const max_size = 200;

interface props {
  onFileInput: Function;
  errors?: string[];
}

export default function ImageDropper(props: props) {
  const [hasImage, setHasImage] = useState(false);
  const [isDragginOver, onDragProps] = useDrag();
  const input = useRef<HTMLInputElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [supportsDragAndDrop, setSupportsDragAndDrop] = useState(false);
  useEffect(() => {
    if (props.errors) {
      setErrors(props.errors);
    }
  }, [props.errors]);
  const [lastFile, setLastFile] = useState<Blob | null>(null);
  const [imageToUpload, setImageToUpload] = useState<HTMLImageElement | null>(null);
  const hasPreview = () => {
    return !navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/) && window.FileReader && !!window.CanvasRenderingContext2D;
  };
  const supportsDragAndDropCheck = () => {
    const div = document.createElement("div");
    return "draggable" in div || ("ondragstart" in div && "ondrop" in div);
  };
  useEffect(() => {
    setSupportsDragAndDrop(supportsDragAndDropCheck());
  }, []);
  const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    onDragProps.onDragExit();
    handleFileChange(ev.dataTransfer.files);
    return false;
  };

  const loadImage = (file: Blob) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = () => {
        // Resize the image
        let newHeight = image.height;
        let newWidth = image.width;
        if (newHeight > max_size || newWidth > max_size) {
          //if either height or width is larger than the specified max pixels, we need to shrink it down
          let ratio = newHeight / newWidth;
          if (newHeight > newWidth) {
            newHeight = max_size;
            newWidth = max_size / ratio;
          } else {
            newWidth = max_size;
            newHeight = max_size * ratio;
          }
        }
        if (canvas && canvas.current) {
          canvas.current.width = newWidth;
          canvas.current.height = newHeight;
          canvas!.current!.getContext("2d")!.drawImage(image, 0, 0, newWidth, newHeight);
          let dataUrl = canvas.current.toDataURL("image/webp");
          setImageToUpload(image);
          if (props.onFileInput) {
            props.onFileInput(dataUrl);
          }
          return dataUrl;
        }
      };
      image.src = readerEvent!.target!.result!.toString();
    };
    reader.readAsDataURL(file);
  };
  const handleFileChange = (files: FileList | null) => {
    let errors: string[] = [];
    if (files && files[0] === lastFile) {
      return;
    }
    setErrors(errors);
    if (!files) {
      errors.push("Please add a logo.");
    } else {
      if (files.length > 1) {
        errors.push("Please only add one logo.");
      }
      if (files[0].size < 0) {
        errors.push("This file has a negative file size?!");
      }
      if (files[0].size > 3 * 1024 * 1024) {
        errors.push("This file is too large.");
      }
      if (!files[0].type.startsWith("image")) {
        errors.push("Please only submit logos.");
      }
    }
    if (errors.length) {
      setErrors(errors);
      return;
    }
    setHasImage(true);
    loadImage(files![0]);
  };

  return (
    <div className="h-fit relative flex flex-col justify-center items-center ">
      {hasImage ? (
        <>
          {hasPreview() ? (
            <>
              <canvas className="border-[1px]  border-primary-1100 dark:border-white rounded-lg w-full h-full m-1 " width={100} height={100} ref={canvas}></canvas>
            </>
          ) : (
            <>
              <div className="border-2 border-green-300 text-green-200 duration-200 ease-out rounded-lg w-full h-full flex flex-col justify-center items-center max-h-[300px]  max-w-[300px] m-1 p-5 cursor-pointer aspect-square">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 stroke-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>

                <p className="text-center select-none">Image submitted.</p>
              </div>
            </>
          )}
          <div
            className="absolute bottom-2 right-2 flex justify-center gap-3 bg-gray-200/90 cursor-pointer hover:bg-white dark:hover:bg-black hover:scale-105 duration-200 dark:bg-gray-700/90 p-2 rounded-lg"
            onClick={() => {
              setHasImage(false);
              setLastFile(null);
            }}
          >
            <TrashIcon className="w-5 h-5 text-red-500 dark:text-red-300"></TrashIcon>
          </div>
        </>
      ) : (
        <>
          <div
            {...onDragProps}
            onDrop={(ev) => {
              handleDrop(ev);
            }}
            onClick={(ev) => {
              if (input && input.current) {
                input.current.click();
                ev.stopPropagation();
                ev.preventDefault();
              }
            }}
            className={
              `border-[1px] bg-gray-50 dark:bg-gray-700 duration-200 ease-out rounded-lg w-full h-full flex flex-col justify-center items-center m-1 p-5 cursor-pointer aspect-square
              hover:border-primary-1200 hover:text-primary-1200   dark:hover:border-gray-300 dark:hover:text-gray-300 
        ` + (isDragginOver ? " border-primary-700 dark:border-primary-200 text-primary-700  dark:text-primary-200 shadow-[0_0_2px_2px] shadow-primary-500" : " border-gray-300 text-black dark:border-gray-500  dark:text-gray-400")
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 stroke-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-center text-xs select-none">{supportsDragAndDrop ? "Drag a logo or click here" : "Tap here to select a logo."}</p>
            <form>
              <input
                type="file"
                className="hidden"
                onClick={(ev) => {
                  ev.stopPropagation();
                  return true;
                }}
                onInput={(ev) => {
                  const target = ev.target as HTMLInputElement;
                  handleFileChange(target.files);
                }}
                name="fileinput"
                id="fileinput"
                accept="image/*"
                ref={input}
              />
            </form>
          </div>
        </>
      )}
      {errors.length ? (
        <div className="errors text-red-500 w-full flex justify-center flex-col items-center">
          {errors.map((err, i) => {
            return (
              <p key={i} className="font-thin text-center before:content-['_•_'] px-2 w-fit">
                {err.trim() === "" ? "Something went wrong. Please try again later." : err}
              </p>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
