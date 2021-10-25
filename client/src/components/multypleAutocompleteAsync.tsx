import React, { ReactElement } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

interface Props {
  tags: string[];
  setTags: (value: string[]) => void;
  url: string;
  onResCb: (res: any, setOptions: (value: string[]) => void) => void;
  label: string;
  free?: boolean;
}

export default function MultypleAutocompleteAsync({
  tags,
  setTags,
  url,
  onResCb,
  label,
  free = true,
}: Props): ReactElement | null {
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
      const res: any = await axios.get(url, {
        headers: {
          "x-auth-token": token!,
        },
      });

      if (active) {
        console.log("this is tags: ", res);
        onResCb(res.data, setOptions);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([...options]);
    }
  }, [open]);

  return (
    <Autocomplete
      multiple
      {...(free ? { freeSolo: true } : { freeSolo: false })}
      options={[...options]}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={tags}
      onChange={(_, value: string[]) => {
        setTags([...value]);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            type: "search",
          }}
        />
      )}
    />
  );
}
