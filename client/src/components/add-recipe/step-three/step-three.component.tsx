import React from "react";
import Compress from "compress.js";
import { Button, Form } from "react-bootstrap";
import classes from "./step-three.module.scss";

export interface AddImageProps {
  image: any | undefined;
  setImage: (image: any | undefined) => void;
  submit: () => void;
}

const AddImage: React.SFC<AddImageProps> = ({
  image,
  setImage,
  submit,
}: AddImageProps) => {
  const onDrop = async (files: File[]) => {
    if (files[0]) {
      const compress = new Compress();

      await compress
        .compress([files[files.length - 1]], {
          size: 0.19, // the max size in MB, defaults to 2MB
          quality: 0.95, // the quality of the image, max is 1,
          maxWidth: 250, // the max width of the output image, defaults to 1920px
          maxHeight: 300, // the max height of the output image, defaults to 1920px
          resize: true, // defaults to true, set false if you do not want to resize the image width and height
        })
        .then((data) => {
          const file = Compress.convertBase64ToFile(data[0].data, data[0].ext);
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            setImage(reader.result!);
          });
          reader.readAsDataURL(file);
        });
    }
  };

  return (
    <div className={classes.FormPart}>
      <span className={classes.SubHeadline}>הוספת תמונה (אופציונלי)</span>
      <div className={classes.Inputs}>
        <Form.File
          onChange={async (e: any) => onDrop(e.target.files)}
          accept="image/*"
        />
      </div>
      {image ? <img src={image!} alt="" /> : null}
      <Button
        className={classes.SubmitButton}
        variant="outline-success"
        onClick={() => {
          submit();
        }}
      >
        שמור
      </Button>
    </div>
  );
};

export default AddImage;
