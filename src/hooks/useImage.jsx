import React from "react";
import { useState, useEffect } from "react";
import useFetch from "./useFetch";
function useImage() {
  const { handleData, data, loading, response, error } = useFetch();
  const [imageUrl, setImageUrl] = useState("");

  //When the post has been made we expose the url given back from the api request.
  //We can then use the url and save it as the images' url in the database.
  useEffect(() => {
    if (data !== null) {
      setImageUrl(data.data.url);
    }
  }, [data]);

  //Transform file to formdata and set it up as the imgbb-endpoint needs to have it.
  function createFormData(file) {
    const formData = new FormData();
    formData.append("image", file);
    return formData;
  }

  //Save image in online storage.
  async function saveImage(file) {
    const formData = createFormData(file);
    await handleData(
      "https://api.imgbb.com/1/upload?key=97f81df3cc81a176ff696a8be56250aa",
      "POST",
      formData
    );
  }

  return { saveImage, imageUrl, loading, response, error };
}

export default useImage;
