import React, { ReactElement } from "react";

interface Props {
  image: string | undefined;
  setImage: (value: string) => void;
}

export default function FourthStep({
  image,
  setImage,
}: Props): ReactElement | null {
  const [fileInputState, setFileInputState] = React.useState("");

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    previewFile(file);
    setFileInputState(e.target.value);
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (reader.result) {
          setImage(reader.result as string);
        }
      };
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        value={fileInputState}
      />
      {image && <img src={image} alt="chosen" style={{ height: "300px" }} />}
    </div>
  );
}
