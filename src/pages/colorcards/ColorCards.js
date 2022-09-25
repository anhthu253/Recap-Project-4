import "./ColorCards.css";
import ColorCard from "../../components/colorCard/ColorCard";
import { useState, useEffect } from "react";

const colorsets = [
  {
    id: "343",
    colorCode: "#21AD32",
    colorName: "Slimy Green",
    editable: false,
  },
  {
    id: "093",
    colorCode: "#8885B4",
    colorName: "Wild Blue Yonder",
    editable: false,
  },
  {
    id: "3098",
    colorCode: "#217AAD",
    colorName: "Matisse",
    editable: false,
  },
];

const rootURL = "https://www.thecolorapi.com/id?hex=";

export default function ColorCards() {
  const [colors, setColors] = useState(
    () => JSON.parse(localStorage.getItem("colors")) ?? colorsets
  );
  const [newcolor, setNewColor] = useState([]);
  const [hexCodeURL, setHexCodeURL] = useState({});

  function isColorCodeValid(colorcode) {
    const RegExp = /^#[0-9A-F]{6}$/i;
    return RegExp.test(colorcode);
  }

  function hashtagColor(colorcode) {
    if (!colorcode.startsWith("#")) colorcode = "#" + colorcode;
    return colorcode;
  }

  function updateColorCode(id, colorcode) {
    setColors(() => {
      if (JSON.stringify(colors).includes(id))
        return colors.map((color) =>
          id === color.id
            ? { ...color, colorCode: hashtagColor(colorcode), editable: false }
            : color
        );

      return [
        ...colors,
        {
          id: id,
          colorCode: hashtagColor(colorcode),
          colorName: "",
          editable: false,
        },
      ];
    });
  }

  function updateHexCodeUrl(id, colorcode) {
    setHexCodeURL({
      id: id,
      url: rootURL + colorcode.replace("#", ""),
    });
  }

  async function fetchColorName() {
    const response = await fetch(hexCodeURL.url);
    const results = await response.json();
    setColors(() =>
      colors.map((color) =>
        color.id === hexCodeURL.id
          ? { ...color, colorName: results.name.value }
          : color
      )
    );
  }

  function addColor(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    let { colorcode } = Object.fromEntries(formData);

    const id = Math.random().toString(36).substring(2);
    if (!isColorCodeValid(hashtagColor(colorcode))) return;
    updateColorCode(id, colorcode);
    updateHexCodeUrl(id, colorcode);
  }

  function deleteColor(id) {
    setColors(() => colors.filter((color) => color.id !== id));
  }

  function toggleEditor(id) {
    setColors(() =>
      colors.map((color) => {
        return color.id === id
          ? { ...color, editable: true }
          : { ...color, editable: false };
      })
    );
  }

  function editColor(event, id) {
    const colorcodeentered = event.target.value;
    setColors(() =>
      colors.map((color) =>
        color.id === id ? { ...color, editable: false } : color
      )
    );
    if (!isColorCodeValid(hashtagColor(colorcodeentered))) return;
    updateColorCode(id, colorcodeentered);
    updateHexCodeUrl(id, colorcodeentered);
  }

  useEffect(() => {
    localStorage.setItem("colors", JSON.stringify(colors));
  }, [colors]);

  useEffect(() => {
    fetchColorName();
  }, [hexCodeURL]);

  return (
    <div className="colorboard">
      <form className="colorboard__form" onSubmit={addColor}>
        <input
          className="colorboard__colorcode-input"
          type="text"
          name="colorcode"
          id="colorcode"
          onChange={(event) => setNewColor(event.target.value)}
        />
        <label htmlFor="colorcode" className="colorboard__colorcode-label">
          {newcolor}
        </label>
        <button className="colorboard__submit-button" type="submit">
          ADD
        </button>
      </form>
      <section className="colorboard__colorcards">
        {colors.map((color, index) => (
          <ColorCard
            key={color.id}
            colorName={color.colorName}
            colorCode={color.colorCode}
            editable={color.editable}
            letDelete={() => deleteColor(color.id)}
            onEdit={() => toggleEditor(color.id)}
            onEnter={(event) => editColor(event, color.id)}
          />
        ))}
      </section>
    </div>
  );
}
