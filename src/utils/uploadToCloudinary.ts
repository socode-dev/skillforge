export const uploadToCloudinary = async (
  file: File
): Promise<string | null> => {
  const cloudName = "dtetjsdfz";
  const uploadPresetName = "profile_pictures";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPresetName);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();

    return data.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return null;
  }
};
