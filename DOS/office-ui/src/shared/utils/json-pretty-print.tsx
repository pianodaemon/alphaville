// https://stackoverflow.com/questions/30765163/pretty-printing-json-with-react/30766309#30766309
import React from "react";
// import clsx from "clsx";
import {
  createStyles,
  makeStyles,
  // useTheme,
  Theme,
} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pre: { outline: "1px solid #ccc; padding: 5px", margin: "5px" },
    string: { color: "green" },
    number: { color: "darkorange" },
    boolean: { color: "blue" },
    null: { color: "magenta" },
    key: { color: "red" },
  })
);

function syntaxHighlight(json: string, classes) {
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    function (match) {
      var cls = classes.number;
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = classes.key;
        } else {
          cls = classes.string;
        }
      } else if (/true|false/.test(match)) {
        cls = classes.boolean;
      } else if (/null/.test(match)) {
        cls = classes.null;
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}

export function JSONPrettyPrint(json: any = {}) {
  const classes = useStyles();
  // const theme = useTheme();


  var str = JSON.stringify(json, undefined, 4);

  return (
    <div>
      <pre
        dangerouslySetInnerHTML={{ __html: syntaxHighlight(str, classes) }}
      ></pre>
    </div>
  );
}
