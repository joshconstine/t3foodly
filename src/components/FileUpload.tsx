"use client";

import React, { ChangeEvent, SyntheticEvent, useState } from "react";

import { api } from "../utils/api";
import axios from "axios";
const FileUplod = ({ restaurantId }: { restaurantId: string }) => {
  const [file, setFile] = useState<any>();

  const createPhoto = api.photo.createPhoto.useMutation();
  const storeFile = (e: ChangeEvent<HTMLInputElement>): void => {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const uploadedFile = input.files[0];
    setFile(uploadedFile);
  };

  const uploadPhoto = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      let { data } = await axios.post("/api/s3/upload-url", {
        name: file.name,
        type: file.type,
      });
      const url = data.url;

      let res = await axios.put(url, file, {
        headers: {
          "Content-type": file.type,
          "Access-Control-Allow-Origin": "*",
        },
      });
      setFile(null);
      if (res.status === 200) {
        createPhoto.mutate({
          restaurantId: restaurantId,
          photoUrl: `https://foodly-bucket.s3.us-west-1.amazonaws.com/${file.name}`,
        });
      } else {
        console.error("Upload failed.");
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <p>Upload file:</p>
      <input type="file" onChange={(e) => storeFile(e)} />
      <button onClick={uploadPhoto} className="bg-green-200">
        send
      </button>
    </>
  );
};

export default FileUplod;
