"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Image from "next/image";

const ImageUploadSchema = z.object({
  images: z.any().optional(),
});

type ImageUploadFormData = z.infer<typeof ImageUploadSchema>;

const ImageUpload: React.FC = () => {
  const form = useForm<ImageUploadFormData>({
    resolver: zodResolver(ImageUploadSchema),
  });
  const [files, setFiles] = useState<File[]>([]);

  const { errors } = form.formState;

  const validFiles = (files: File[]) => {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/svg+xml",
    ];
    // validate file types
    const isValid = files.every((file) => allowedTypes.includes(file.type));
    if (!isValid) {
      const inValidFileIndexes = files.reduce((acc, file, index) => {
        if (!allowedTypes.includes(file.type)) {
          if (!acc.includes(index)) {
            acc.push(index);
          }
        }
        return acc;
      }, [] as number[]);
      toast.error(
        `Invalid file type${inValidFileIndexes.length ? "(s) " : ""}. ${inValidFileIndexes.length ? inValidFileIndexes.join(", ") : ""}`
      );
    }
    return isValid;
  };

  const filesUnderLimit = (files: File[]) => {
    const maxSize = 1024 * 1024 * 2; // 2MB in bytes
    const largeFiles = files.filter((file) => file.size > maxSize);
    if (!!largeFiles.length) {
      const fileNames = largeFiles.map((file) => file.name).join(", ");
      toast.error(
        `${fileNames} exceed the maximum size of ${maxSize / (1024 * 1024)}MB. Please select smaller files.`
      );
    }
    return !!largeFiles.length; // files are too large
  }

  const handleFiles = (files: File[]) => {
    if (!!files?.length && validFiles(files) && filesUnderLimit(files)) {
      setFiles((prev) => [...prev, ...files]);
      toast.success(`Image ${files.length > 1 ? "(s)" : ""} found.`);
    } else {
      return toast.error("An error occured while uploading:change");
    }
  }

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement> | undefined
  ) => {
     handleFiles(event?.target.files
      ? Array.from(event.target.files)
      : [])
  };

  const handleFileDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault(); // Prevent default behavior
    if (!event.dataTransfer) {
      return toast.error("An error occured while uploading");
    }
    handleFiles(Array.from(event.dataTransfer.files))
  };

  const onSubmit = async (data: ImageUploadFormData) => {
    try {
      if (!!Object.keys(data).length) {
        toast.success("Success. " + JSON.stringify(data));
      } else {
        throw new Error("Error incurred while uploading");
      }
    } catch (error) {
      toast.error(
        "There was an error uploading your image(s). Please try again."
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      onDragOver={(event) => event.preventDefault()} // Prevent default behavior
                      onDrop={handleFileDrop}
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          aria-hidden="true"
                          className="w-10 h-10 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF (MAX. 2MB.)
                        </p>
                      </div>
                      <input
                        id="dropzone-image"
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/png, image/jpeg, image/gif, image/svg+xml"
                        {...field}
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <FormMessage className="mt-2" />
                  {files.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="relative w-full h-32 overflow-hidden rounded-lg"
                        >
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className="object-cover w-full h-full"
                            fill
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 p-2 bg-gray-800 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                            aria-label="Remove image"
                            onClick={(e) => {
                              e.preventDefault();
                              setFiles((prevFiles) => prevFiles.filter((_, fileIndex) => fileIndex !== index));
                            }}
                          >
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4">
          Upload
        </Button>
      </form>
    </Form>
  );
};

export default ImageUpload;
