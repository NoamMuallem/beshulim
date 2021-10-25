import React, { ReactElement } from "react";
import TextField from "@mui/material/TextField";
import MultypleAutocompleteAsync from "../../../components/multypleAutocompleteAsync";

interface Props {
  name: string;
  setName: (value: string) => void;
  tags: string[];
  setTags: (value: string[]) => void;
}

export default function FirstStep({
  name,
  setName,
  tags,
  setTags,
}: Props): ReactElement | null {
  return (
    <div
      style={{
        width: "100%",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <TextField
        label={"שם המתכון"}
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
        }
        inputProps={{ dir: "auto" }}
        style={{ width: "100%" }}
      />
      <div style={{ width: "100%" }}>
        <MultypleAutocompleteAsync
          tags={tags}
          setTags={setTags}
          url={"/api/tags"}
          label="תגיות"
          onResCb={(data, setOptions) => {
            setOptions([
              ...Object.values(data).map((value: any) => value.name),
            ]);
          }}
          free={true}
        />
      </div>
    </div>
  );
}
