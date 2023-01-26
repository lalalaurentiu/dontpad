let themes = [
  {
    name: "3024-day",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/3024-day.min.css",
    background: "#f7f7f7",
    color: "#807d7c",
    border: "none",
  },
  {
    name: "3024-night",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/3024-night.min.css",
    background: "#090300",
    color: "#807d7c",
    border: "none",
  },
  {
    name: "abcdef",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/abcdef.min.css",
    background: "#555",
    color: "#fff",
    border: "2px solid #314151",
  },
  {
    name: "ambiance-mobile",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/ambiance-mobile.min.css",
    background: "#f8f8f8",
    color: "#999",
    border: "1px solid #ddd",
  },
  {
    name: "ambiance",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/ambiance.min.css",
    background: "#3d3d3d",
    color: "#111",
    border: "1px solid #4d4d4d",
  },
  {
    name: "ayu-dark",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/ayu-dark.min.css",
    background: "#0a0e14",
    color: "#3d424d",
    border: "none",
  },
  {
    name: "ayu-mirage",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/ayu-mirage.min.css",
    background: "#1f2430",
    color: "#3d424d",
    border: "none",
  },
  {
    name: "base16-dark",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/base16-dark.min.css",
    background: "#151515",
    color: "#505050",
    border: "none",
  },
  {
    name: "base16-light",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/base16-light.min.css",
    background: "#f5f5f5",
    color: "#b0b0b0",
    border: "none",
  },
  {
    name: "bespin",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/bespin.min.css",
    background: "#28211c",
    color: "#666",
    border: "none",
  },
  {
    name: "blackboard",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/blackboard.min.css",
    background: "#0c1021",
    color: "#888",
    border: "none",
  },
  {
    name: "cobalt",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/cobalt.min.css",
    background: "#002240",
    color: "#d0d0d0",
    border: "1px solid #aaa",
  },
  {
    name: "colorforth",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/colorforth.min.css",
    background: "#0a001f",
    color: "#bababa",
    border: "1px solid #aaa",
  },
  {
    name: "darcula",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/darcula.min.css",
    background: "#313335",
    color: "#999",
    border: "none",
  },
  {
    name: "dracula",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/dracula.min.css",
    background: "#282a36",
    color: "#6d8a88",
    border: "none",
  },
  {
    name: "duotone-dark",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/duotone-dark.min.css",
    background: "#2a2734",
    color: "#545167",
    border: "none",
  },
  {
    name: "duotone-light",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/duotone-light.min.css",
    background: "#faf8f5",
    color: "#cdc4b1",
    border: "none",
  },
  {
    name: "eclipse",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/eclipse.min.css",
    background: "#f7f7f7",
    color: "#999",
    border: "1px solid #ddd",
  },
  {
    name: "elegant",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/elegant.min.css",
    background: "#f7f7f7",
    color: "#999",
    border: "1px solid #ddd",
  },
  {
    name: "erlang-dark",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/erlang-dark.min.css",
    background: "#002240",
    color: "#d0d0d0",
    border: "1px solid #aaa",
  },
  {
    name: "gruvbox-dark",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/gruvbox-dark.min.css",
    background: "#282828",
    color: "#7c6f64",
    border: "none",
  },
  {
    name: "hopscotch",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/hopscotch.min.css",
    background: "#322931",
    color: "#797379",
    border: "none",
  },
  {
    name: "icecoder",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/icecoder.min.css",
    background: "#1d1d1b",
    color: "#555",
    border: "none",
  },
  {
    name: "idea",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/idea.min.css",
    background: "#f7f7f7",
    color: "#999",
    border: "1px solid #ddd",
  },
  {
    name: "isotope",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/isotope.min.css",
    background: "#000",
    color: "grey",
    border: "none",
  },
  {
    name: "lesser-dark",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/lesser-dark.min.css",
    background: "#262626",
    color: "#777",
    border: "1px solid #aaa",
  },
  {
    name: "liquibyte",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/liquibyte.min.css",
    background: "#262626",
    color: "#606060",
    border: "1px solid #505050",
  },
  {
    name: "lucario",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/lucario.min.css",
    background: "#2b3e50",
    color: "#f8f8f2",
    border: "none",
  },
  {
    name: "material-darker",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/material-darker.min.css",
    background: "#212121",
    color: "#545454",
    border: "none",
  },
  {
    name: "material-ocean",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/material-ocean.min.css",
    background: "#0f111a",
    color: "#464b5d",
    border: "none",
  },
  {
    name: "material-palenight",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/material-palenight.min.css",
    background: "#292d3e",
    color: "#676e9",
    border: "none",
  },
  {
    name: "material",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/material.min.css",
    background: "#263238",
    color: "#546e7a",
    border: "none",
  },
  {
    name: "mbo",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/mbo.min.css",
    background: "#4e4e4e",
    color: "#dadada",
    border: "none",
  },
  {
    name: "mdn-like",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/mdn-like.min.css",
    background: "#f8f8f8",
    color: "#aaa",
    border: "1px solid #ddd",
  },
  {
    name: "midnight",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/midnight.min.css",
    background: "#0f192a",
    color: "#d0d0d0",
    border: "1px solid #d0d0d0",
  },
  {
    name: "monokai",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/monokai.min.css",
    background: "#272822",
    color: "#d0d0d0",
    border: "none",
  },
  {
    name: "moxer",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/moxer.min.css",
    background: "#090a0f",
    color: "#35394b",
    border: "none",
  },
  {
    name: "panda-syntax",
    url: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/panda-syntax.min.css",
    background: "#292a2b",
    color: "#e6e6e6",
    border: "1px solid rgba(255,255,255,.1)",
  },
];

let navbar_dropdown_content = document.querySelector(
  ".navbar-dropdown-content"
);
let HEADE = document.getElementsByTagName("head")[0];
let LINK = document.createElement("link");
LINK.rel = "stylesheet";
HEADE.appendChild(LINK);

let headerRunButtonCode = document.querySelector(".run");

const cookie = document.cookie.split(";")[0].split(",");
cookie.forEach((item) => {
  if (item.split("=")[0] === "theme") {
    let theme = themes.find((theme) => theme.name === item.split("=")[1]);
    LINK.href = theme.url;
    editor.setOption("theme", theme.name);
    document.querySelector(".navbar").style.background = theme.background;
    document.querySelector(".navbar").style.borderBottom = theme.border;
    document.querySelector(".navbar a").style.color = theme.color;
    document.querySelector(".dropbtn").style.color = theme.color;
    document.querySelector(".versioning-container").style.background =
      theme.background;
    document.querySelector(".versioning-container").style.color = theme.color;
    document.querySelector(".contextMenu").style.borderColor = theme.color;
    document.querySelector(".contextMenu").style.background = theme.background;
    document.querySelector(".contextMenu").style.color = theme.color;

    headerRunButtonCode.style.color = theme.color;

    document.querySelector(".console").style.background = theme.background;
    document.querySelector(".console").style.color = theme.color;
    document.querySelector(".console").style.borderColor = theme.color;

    try {
      sentCode.style.background = theme.background;
      sentCode.style.color = theme.color;
      sentCode.style.borderColor = theme.color;

      screenRecorder.style.background = theme.background;
      screenRecorder.style.color = theme.color;
      screenRecorder.style.borderColor = theme.color;

      document.querySelector(".codeRecorder").style.background =
        theme.background;
      document.querySelector(".codeRecorder").style.color = theme.color;
      document.querySelector(".codeRecorder").style.borderColor = theme.color;
    } catch (error) {}

    differencesButton.style.background = theme.background;
    differencesButton.style.color = theme.color;
    differencesButton.style.borderColor = theme.color;
    document.querySelector("form").style.background = theme.background;
    document.querySelector("form").style.color = theme.color;
    document.querySelector("form").style.borderColor = theme.color;

    document.querySelector("#messageBtn").style.background = theme.background;
    document.querySelector("#messageBtn").style.color = theme.color;
    document.querySelector("#messageBtn").style.borderColor = theme.color;
  }
});

themes.forEach((theme) => {
  let a = document.createElement("a");
  a.setAttribute("value", theme.name);
  a.innerText = theme.name;
  navbar_dropdown_content.appendChild(a);
});

navbar_dropdown_content.addEventListener("click", (e) => {
  let theme = themes.find(
    (theme) => theme.name === e.target.getAttribute("value")
  );
  LINK.href = theme.url;
  document.cookie = `theme=${theme.name}, background=${theme.background}, color=${theme.color}, border=${theme.border}`;

  editor.setOption("theme", e.target.getAttribute("value"));
  document.querySelector(".navbar").style.background = theme.background;
  document.querySelector(".navbar").style.borderBottom = theme.border;
  document.querySelector(".navbar a").style.color = theme.color;
  document.querySelector(".dropbtn").style.color = theme.color;
  document.querySelector(".versioning-container").style.background =
    theme.background;
  document.querySelector(".versioning-container").style.color = theme.color;
  document.querySelector(".contextMenu").style.borderColor = theme.color;
  document.querySelector(".contextMenu").style.background = theme.background;
  document.querySelector(".contextMenu").style.color = theme.color;

  headerRunButtonCode.style.color = theme.color;

  document.querySelector(".console").style.background = theme.background;
  document.querySelector(".console").style.color = theme.color;
  document.querySelector(".console").style.borderColor = theme.color;

  try {
    sentCode.style.background = theme.background;
    sentCode.style.color = theme.color;
    sentCode.style.borderColor = theme.color;

    screenRecorder.style.background = theme.background;
    screenRecorder.style.color = theme.color;
    screenRecorder.style.borderColor = theme.color;

    document.querySelector(".codeRecorder").style.background = theme.background;
    document.querySelector(".codeRecorder").style.color = theme.color;
    document.querySelector(".codeRecorder").style.borderColor = theme.color;
  } catch (error) {}

  differencesButton.style.background = theme.background;
  differencesButton.style.color = theme.color;
  differencesButton.style.borderColor = theme.color;
  document.querySelector("form").style.background = theme.background;
  document.querySelector("form").style.color = theme.color;
  document.querySelector("form").style.borderColor = theme.color;

  document.querySelector("#messageBtn").style.background = theme.background;
  document.querySelector("#messageBtn").style.color = theme.color;
  document.querySelector("#messageBtn").style.borderColor = theme.color;
});

// runCode(headerRunButtonCode)
