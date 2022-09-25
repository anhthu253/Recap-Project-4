import "./ColorGroups.css";
import ColorCards from "../colorcards/ColorCards";
import { useState, useEffect } from "react";

const groupDB = [
  {
    id: "00867",
    groupName: "group1",
    groupNameEditable: false,
    colorCards: [
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
        id: "308",
        colorCode: "#217AAD",
        colorName: "Matisse",
        editable: false,
      },
    ],
  },
  {
    id: "03267",
    groupName: "group2",
    groupNameEditable: false,
    colorCards: [
      {
        id: "356",
        colorCode: "#FF0000",
        colorName: "Red",
        editable: false,
      },
      {
        id: "878",
        colorCode: "#B22222",
        colorName: "FireBrick",
        editable: false,
      },
      {
        id: "098",
        colorCode: "#FF6347",
        colorName: "Tomato",
        editable: false,
      },
    ],
  },
];

function hashtagColor(colorcode) {
  if (!colorcode.startsWith("#")) colorcode = "#" + colorcode;
  return colorcode;
}

function isColorCodeValid(colorcode) {
  const RegExp = /^#[0-9A-F]{6}$/i;
  return RegExp.test(colorcode);
}

const rootURL = "https://www.thecolorapi.com/id?hex=";

export default function ColorGroups() {
  const [colorGroups, setColorGroups] = useState(
    JSON.parse(localStorage.getItem("colorgroups")) ?? groupDB
  );
  const [fetchHexCodeURL, setFetchHexCodeURL] = useState({});

  function addGroup() {
    const newgroup = {
      id: Math.random().toString(36).substring(2),
      groupName: "group name",
      groupNameEditable: false,
      colorCards: [],
    };
    setColorGroups([...colorGroups, newgroup]);
  }

  async function fetchColorName() {
    const response = await fetch(fetchHexCodeURL.url);
    const results = await response.json();
    setColorGroups(() =>
      colorGroups.map((group) => {
        const newcards = group.colorCards.map((card) =>
          card.id === fetchHexCodeURL.cardID
            ? { ...card, colorName: results.name.value }
            : card
        );
        return { ...group, colorCards: newcards };
      })
    );
  }

  function addColor(event, groupId) {
    event.preventDefault();
    const formData = new FormData(event.target);
    let { colorcode } = Object.fromEntries(formData);
    if (!isColorCodeValid(hashtagColor(colorcode))) return;
    const cardId = Math.random().toString(36).substring(2);
    setColorGroups(() =>
      colorGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              colorCards: [
                ...group.colorCards,
                {
                  id: cardId,
                  colorCode: hashtagColor(colorcode),
                  colorName: "",
                  editable: false,
                },
              ],
            }
          : group
      )
    );
    updateHexCodeUrl(groupId, cardId, colorcode);
  }

  function updateHexCodeUrl(groupid, cardid, colorcode) {
    setFetchHexCodeURL({
      groupID: groupid,
      cardID: cardid,
      url: rootURL + colorcode.replace("#", ""),
    });
  }

  function updateGroupName(event, groupid) {
    const newgroupname = event.target.value;

    setColorGroups(() =>
      colorGroups.map((group) => {
        if (groupid === group.id) {
          if (newgroupname === "" || newgroupname === null)
            return { ...group, groupNameEditable: false };
          return {
            ...group,
            groupName: newgroupname,
            groupNameEditable: false,
          };
        }
        return group;
      })
    );
  }

  function updateColor(groupId, colorcards) {
    setColorGroups(() =>
      colorGroups.map((group) =>
        group.id === groupId ? { ...group, colorCards: colorcards } : group
      )
    );
  }
  function switch2GroupNameEditor(groupid) {
    setColorGroups(() =>
      colorGroups.map((group) =>
        group.id === groupid
          ? { ...group, groupNameEditable: true }
          : { ...group, groupNameEditable: false }
      )
    );
  }
  useEffect(() => {
    localStorage.setItem("colorgroups", JSON.stringify(colorGroups));
  }, [colorGroups]);

  useEffect(() => {
    fetchColorName();
  }, [fetchHexCodeURL]);
  return (
    <div className="colorgroups">
      <button className="colorgroups__button--add" onClick={addGroup}>
        ADD GROUP
      </button>
      {colorGroups.map((colorGroup) => {
        return (
          <ColorCards
            key={colorGroup.id}
            groupid={colorGroup.id}
            groupname={colorGroup.groupName}
            groupnameEditable={colorGroup.groupNameEditable}
            colorcards={colorGroup.colorCards}
            onAddColor={(event) => addColor(event, colorGroup.id)}
            onUpdateColor={(colorcards) =>
              updateColor(colorGroup.id, colorcards)
            }
            setHexCodeURL={setFetchHexCodeURL}
            onEditGroupName={() => switch2GroupNameEditor(colorGroup.id)}
            onNewGroupName={(event) => updateGroupName(event, colorGroup.id)}
          />
        );
      })}
    </div>
  );
}
