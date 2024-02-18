import PropTypes from "prop-types";
import NavigateBackIcon from "../../assets/icons/navigate-back.png";
import "./SettingsPanel.css";

function SettingsPanel({ nodeText, setNodeText, setSelectedNodes }) {
  return (
    <div className="settings-panel-wrapper">
      <div className="settings-panel-header">
        {/* Arrow icon to go back to the nodes panel from settings panel */}
        <img
          src={NavigateBackIcon}
          alt="Back"
          title="Back"
          className="navigate-back-icon"
          // setting selected nodes to empty array
          onClick={() => setSelectedNodes([])}
        />
        <span>Message</span>
      </div>
      <div className="settings-panel-main">
        <label htmlFor="nodeText">Text</label>
        <textarea
          name="nodeText"
          id="nodeText"
          rows="5"
          value={nodeText}
          // updating the text of the current selected node as the user types
          onChange={(event) => {
            setNodeText(event.target.value);
          }}
        ></textarea>
      </div>
    </div>
  );
}

SettingsPanel.propTypes = {
  nodeText: PropTypes.string,
  setNodeText: PropTypes.func,
  setSelectedNodes: PropTypes.func,
};

export default SettingsPanel;
