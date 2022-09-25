import "./ColorCards.css";
import ColorCard from "../../components/colorCard/ColorCard";
import { useState, useEffect } from "react";

function hashtagColor(colorcode) {
  if (!colorcode.startsWith("#")) colorcode = "#" + colorcode;
  return colorcode;
}

function isColorCodeValid(colorcode) {
  const RegExp = /^#[0-9A-F]{6}$/i;
  return RegExp.test(colorcode);
}
const rootURL = "https://www.thecolorapi.com/id?hex=";

export default function ColorCards(props) {
  const {
    groupid,
    groupname,
    groupnameEditable,
    onEditGroupName,
    onNewGroupName,
    colorcards,
    onAddColor,
    onUpdateColor,
    setHexCodeURL,
  } = props;

  const [newcolor, setNewColor] = useState([]);

  function deleteColor(id) {
    onUpdateColor(colorcards.filter((color) => color.id !== id));
  }

  function switch2Editor(id) {
    onUpdateColor(
      colorcards.map((color) => {
        return color.id === id
          ? { ...color, editable: true }
          : { ...color, editable: false };
      })
    );
  }

  function editColor(event, id) {
    const colorcodeentered = event.target.value;
    if (!isColorCodeValid(hashtagColor(colorcodeentered))) {
      onUpdateColor(
        colorcards.map((color) =>
          color.id === id ? { ...color, editable: false } : color
        )
      );
      return;
    }
    onUpdateColor(
      colorcards.map((color) =>
        color.id === id
          ? {
              ...color,
              editable: false,
              colorCode: hashtagColor(colorcodeentered),
            }
          : color
      )
    );

    setHexCodeURL({
      groupID: groupid,
      cardID: id,
      url: rootURL + colorcodeentered.replace("#", ""),
    });
  }

  useEffect(() => {
    localStorage.setItem("colors", JSON.stringify(colorcards));
  }, [colorcards]);

  function handleEnter(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      onNewGroupName(event);
    }
  }
  return (
    <div className="colorboard">
      <h2
        className={`colorboard__groupname${!groupnameEditable ? " activ" : ""}`}
        onClick={onEditGroupName}
      >
        {groupname}
      </h2>
      <input
        name="groupname"
        className={`colorboard__groupname-input${
          groupnameEditable ? " activ" : ""
        }`}
        onKeyDown={handleEnter}
        onBlur={onNewGroupName}
      ></input>
      <form className="colorboard__form" onSubmit={onAddColor}>
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
        {colorcards.map((color, index) => (
          <ColorCard
            key={color.id}
            colorName={color.colorName}
            colorCode={color.colorCode}
            editable={color.editable}
            letDelete={() => deleteColor(color.id)}
            onEdit={() => switch2Editor(color.id)}
            onEnter={(event) => editColor(event, color.id)}
          />
        ))}
      </section>
    </div>
  );
}
