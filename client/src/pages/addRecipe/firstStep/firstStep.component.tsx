import React, { ReactElement } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { AuthContext } from "../../../context/auth.context";

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
  //const [tempTag, setTempTag] = React.useState<string>("");
  const [options, setOptions] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const loading = open && Object.keys(options).length === 0;
  const { token } = React.useContext(AuthContext);

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const res: any = await axios.get("/api/tags", {
        headers: {
          "x-auth-token": token!,
        },
      });

      if (active) {
        console.log("this is tags: ", res);
        setOptions(Object.values(res.data).map((value: any) => value.name));
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions(options);
    }
  }, [open]);

  return (
    <div>
      <TextField
        label={"שם המתכון"}
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
        }
      />
      <Autocomplete
        multiple
        freeSolo
        options={options}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onChange={(_, value: string[]) => {
          setTags([...value]);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search input"
            InputProps={{
              ...params.InputProps,
              type: "search",
            }}
          />
        )}
      />
    </div>
  );
}
