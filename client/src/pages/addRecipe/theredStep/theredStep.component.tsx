import { ReactElement } from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Typography } from "@mui/material";

interface Props {
  instructions: string;
  setInstructions: (value: string) => void;
}

export default function TheredStep({
  instructions,
  setInstructions,
}: Props): ReactElement | null {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography dir="rtl" variant="h5" component="div">
        הוראות הכנה:
      </Typography>
      <TextareaAutosize
        dir="auto"
        value={instructions}
        onChange={(e) => {
          setInstructions(e.target.value);
        }}
        style={{ width: "100%", marginBottom: "auto", flexGrow: 5 }}
      />
    </div>
  );
}
