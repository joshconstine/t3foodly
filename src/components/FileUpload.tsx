"use client";

import React, { ChangeEvent, useState } from "react";
// import aws from "../../../pages/api/creatingAws";

const FileUplod = ({ restaurantId }: { restaurantId: Number }) => {
  const [messege, setMessege] = useState<string>("");
  const [file, setFile] = useState<any>();

  const storeFile = (e: ChangeEvent<HTMLInputElement>): void => {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const uploadedFile = input.files[0];
    setFile(uploadedFile);
  };

  const uploadPhoto = async (e: React.SyntheticEvent) => {
    const filename = encodeURIComponent(file.name);
    const fileType = encodeURIComponent(file.type);

    try {
      const res = await fetch(
        `/api/s3/upload-url?file=${filename}&fileType=${fileType}`,
        { mode: "no-cors" }
      );
      const { url, fields } = await res.json();
      const formData = new FormData();
      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      const uniqueUrl = `restaurants/${restaurantId}/${Math.round(
        Math.random() * 100
      )}.jpeg`;
      const postURL = `${url}/${uniqueUrl}`;

      const upload = await fetch(postURL, {
        method: "PUT",
        body: formData,
        headers: {
          "Content-type": "image",
        },
      });

      if (upload.ok) {
        const postData = async () => {
          const data = {
            user_id: 0,
            restaurant_id: restaurantId,
            url: uniqueUrl,
          };

          const response = await fetch("/api/photos", {
            method: "POST",
            body: JSON.stringify(data),
          });
          return response.json();
        };
        postData().then((data) => {
          console.log("linked to restaurant");
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
      <input type="button" onClick={uploadPhoto} defaultValue="send" />
    </>
  );
};

export default FileUplod;
