import { Handle, Position } from "reactflow";
import PropTypes from "prop-types";
import MessageIcon from "../../assets/icons/messenger.png";
import WhatsAppIcon from "../../assets/icons/whatsapp.png";
import "./MessageNode.css";
import CustomHandle from "../CustomHandle";

// This is a custom designed node for meeting the requirements of the assignment provided
function MessageNode({ data }) {
  return (
    <>
      {/* Custom Handle is needed to apply the connection limit */}
      <CustomHandle type="target" position={Position.Left} isConnectable={1} />
      <div className="message-node-wrapper">
        <div className="message-node-header">
          <img src={MessageIcon} alt="" />
          <span>Send Message</span>
          <img src={WhatsAppIcon} alt="" />
        </div>
        <div className="message-node-main">
          <p>{data.label}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="a" />
    </>
  );
}

export default MessageNode;

MessageNode.propTypes = {
  data: PropTypes.object,
};
