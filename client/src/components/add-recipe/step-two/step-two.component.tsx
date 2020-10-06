import React, { useState, useEffect } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import classes from "./step-two.module.scss";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectTags } from "../../../redux/selectors/recipe.selectors";
import { IUserTags } from "../../../types/interfaces";

export interface TagsProps {
  tagsArray: Array<string>;
  setTagsArray: (tags: Array<string>) => void;
  newTag: string;
  userTags: IUserTags;
  setNewTag: (tag: string) => void;
}

const maxTagLength = 15;
const maxTagsNum = 10;

const Tags: React.SFC<TagsProps> = ({
  tagsArray,
  setTagsArray,
  newTag,
  setNewTag,
  userTags,
}: TagsProps) => {
  const [selectedTag, setSelectedTag] = useState<string>("");

  useEffect(() => {
    if (userTags.length > 0) {
      setSelectedTag(userTags[0]);
    }
  }, [userTags]);

  const removeTag = (tag: string) => {
    const oldTags = tagsArray;
    const newTags = oldTags.filter((oldTag) => oldTag !== tag);
    setTagsArray(newTags);
  };

  return (
    <div className={classes.FormPart}>
      <span className={classes.SubHeadline}>תגיות</span>
      <Alert style={{ marginTop: "0px" }} variant={"info"}>{`
            כדי להקל על חיפוש ומציאת המתכון ניתן להוסיף עד ${maxTagsNum} תגיות חדשות או ישנות
            (לדוגמא: שבת, צמחוני, זול, חריף, ללא סוכר, אפיה, מרק וכו...) ניתן בכל
            שלב ללחוץ על תגית כדי למחוק אותה
      `}</Alert>
      <div className={classes.Inputs}>
        <div style={{ margin: "auto 0px", width: "40%" }}>
          <Button
            disabled={tagsArray.length === 10 ? true : false}
            style={{ width: "100%", marginBottom: "1rem" }}
            variant="outline-success"
            onClick={() => {
              tagsArray.includes(selectedTag)
                ? alert("תגית כבר קיימת")
                : setTagsArray([...tagsArray, selectedTag]);
            }}
          >
            תגית קיימת
          </Button>
          <Form.Control
            value={selectedTag}
            autoComplete="off"
            as="select"
            name="selectTag"
            custom
            onChange={(e) => {
              setSelectedTag(e.target.value);
            }}
          >
            {userTags.map((tag) => (
              <option
                disabled={tagsArray.includes(tag) ? true : false}
                key={`${tag}select`}
              >
                {tag}
              </option>
            ))}
          </Form.Control>
        </div>
        <div style={{ margin: "auto 0px", width: "auto" }}>
          <h3>או</h3>
        </div>
        <div style={{ margin: "auto 0px", width: "40%" }}>
          <Button
            disabled={tagsArray.length === 10 ? true : false}
            style={{
              marginBottom: "1rem",
              width: "100%",
            }}
            onClick={() => {
              tagsArray.includes(newTag)
                ? alert("תגית כבר קיימת")
                : setTagsArray([...tagsArray, newTag]);
              setNewTag("");
            }}
          >
            תגית חדשה
          </Button>
          <Form.Control
            autoComplete="off"
            as="input"
            type="text"
            maxLength={maxTagLength}
            name="newTag"
            value={newTag}
            onChange={(e) => {
              setNewTag(e.target.value);
            }}
          />
        </div>
      </div>
      <div className={classes.Tags}>
        {tagsArray.map((tag) => (
          <Alert
            className={classes.Tag}
            key={`${tag}tags`}
            variant="dark"
            onClose={() => removeTag(tag)}
            dismissible
          >
            {tag}
          </Alert>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  userTags: selectTags,
});

export default connect(mapStateToProps)(Tags);
