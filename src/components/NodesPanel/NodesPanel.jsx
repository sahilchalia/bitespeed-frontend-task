import ChatIcon from "../../assets/icons/messenger.png";
import "./NodesPanel.css";

export default function NodesPanel() {
  // define what happens when the user starts dragging the node from the nodes panel
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="nodes-panel-main">
      {/* render all the nodes present int he newNodesArray in the nodes panel  */}
      {newNodesArray.map(({ type, label, icon }, index) => (
        <div
          key={index}
          className="new-node message"
          onDragStart={(event) => onDragStart(event, type)}
          draggable
        >
          <img className="chat-icon" src={icon} alt="Chat Icon" />
          <span>{label}</span>
        </div>
      ))}
    </aside>
  );
}

const newNodesArray = [
  {
    type: "messageNode",
    label: "Message",
    icon: ChatIcon,
  },
  // new nodes can be added here in future and these will be rendered automatically in the nodes panel
];
