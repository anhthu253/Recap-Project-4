import "./ColorCard.css";

export default function ColorCard(props) {
  const { colorName, colorCode, editable, letDelete, onEdit, onEnter } = props;

  function handleEnter(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      onEnter(event);
    }
  }
  return (
    <div className="colorbox" style={{ backgroundColor: colorCode }}>
      <span className="colorbox__delete" onClick={letDelete}>
        <i className="fa fa-trash"></i>
      </span>
      <label>{colorName}</label>
      <label
        className={`colorbox__code--label${!editable ? " activ" : ""}`}
        onClick={onEdit}
      >
        {colorCode}
      </label>
      <input
        name="colorbox__code"
        className={`colorbox__code--input${editable ? " activ" : ""}`}
        onKeyDown={handleEnter}
        onBlur={onEnter}
      ></input>
    </div>
  );
}
