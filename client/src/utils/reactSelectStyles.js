export const customStyles = {
  control: (base, state) => ({
    ...base,
    background: "#fff",
    border: state.isFocused ? "0.2rem solid #55c57a" : "0.2rem solid #eee",
    boxShadow: state.isFocused ? null : null,
    "&:hover": {
      background: "#f7f7f7",
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 0,
    hyphens: "auto",
    marginTop: 0,
    textAlign: "left",
    wordWrap: "break-word",
  }),
};

export const filterStyles = {
  control: (base, state) => ({
    ...base,
    background: "#eee",
    border: state.isFocused ? 0 : 0,
    boxShadow: state.isFocused ? null : null,
    "&:hover": {
      background: "#f7f7f7",
    },
  }),
  menu: (base) => ({
    ...base,
    background: "#eee",
    borderRadius: 0,
    hyphens: "auto",
    marginTop: 0,
    textAlign: "left",
    wordWrap: "break-word",
  }),
};
