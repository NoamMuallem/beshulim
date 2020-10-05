import * as React from "react";
import classes from "./step-one.module.scss";
import { Form } from "react-bootstrap";

export interface DescriptionProps {
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  name: string;
  description: string;
}

const Description: React.SFC<DescriptionProps> = ({
  name,
  description,
  setName,
  setDescription,
}: DescriptionProps) => {
  return (
    <div className={classes.FormPart}>
      <span className={classes.SubHeadline}>שם המתכון</span>
      <Form.Control
        className={classes.Name}
        autoComplete="off"
        value={name}
        as="input"
        name="name"
        type="text"
        onChange={(e) => setName(e.target.value)}
      />
      <span className={classes.SubHeadline}>הוראות הכנה</span>
      <Form.Control
        className={classes.Description}
        autoComplete="off"
        value={description}
        name="directions"
        onChange={(e) => setDescription(e.target.value)}
        as="textarea"
      />
    </div>
  );
};

export default Description;
