export const getImageSrc = (photo) => {
  if (!photo) return "/default.jpg";

  if (photo.data) {
    const base64 = btoa(
      new Uint8Array(photo.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    return `data:image/jpeg;base64,${base64}`;
  }

  return `data:image/jpeg;base64,${photo}`;
};
