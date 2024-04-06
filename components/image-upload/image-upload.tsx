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
  picture: z.any().optional(),
});

type ImageUploadFormData = z.infer<typeof ImageUploadSchema>;

const ImageUpload: React.FC = () => {
  const form = useForm<ImageUploadFormData>({
    resolver: zodResolver(ImageUploadSchema),
  });
  const [files, setFiles] = useState<File[]>([]);

  const { errors } = form.formState;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const _files = Array.from(event.target.files);
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/svg+xml",
      ];
      // validate file types
      const isValid = _files.every((file) => allowedTypes.includes(file.type));
      if (!isValid) {
        const inValidFileIndexes = _files.reduce((acc, file, index) => {
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
        return;
      }
      setFiles((prev) => [...prev, ..._files]);
      toast.success(`Image ${_files.length > 1 ? "(s)" : ""} found.`);
    }
  };

  const onSubmit = async (data: ImageUploadFormData) => {
    try {
      toast.success("Success.");
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
          name="picture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
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
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
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
                              ></path>
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
        ></FormField>
        <Button type="submit" className="mt-4">
          Upload
        </Button>
      </form>
    </Form>
  );
};

export default ImageUpload;
