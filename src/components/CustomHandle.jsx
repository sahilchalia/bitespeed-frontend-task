import { useMemo } from "react";
import { getConnectedEdges, Handle, useNodeId, useStore } from "reactflow";
import PropTypes from "prop-types";

const selector = (s) => ({
  nodeInternals: s.nodeInternals,
  edges: s.edges,
});

const CustomHandle = (props) => {
  const { nodeInternals, edges } = useStore(selector);
  // get the id the of current node
  const nodeId = useNodeId();

  const isHandleConnectable = useMemo(() => {
    // check if value passed in isConnectable props is of type function
    if (typeof props.isConnectable === "function") {
      // get the current node from the array of all nodes
      const node = nodeInternals.get(nodeId);

      // get all the edges connecting to the current node
      const connectedEdges = getConnectedEdges([node], edges);

      return props.isConnectable({ node, connectedEdges });
    }

    // check if value passed in isConnectable props is of type number
    if (typeof props.isConnectable === "number") {
      // get the current node from the array of all nodes
      const node = nodeInternals.get(nodeId);
      console.log("NODEID:", node);

      // get all the edges connecting to the current node
      const connectedEdges = getConnectedEdges([node], edges);

      // return true if the no. of edges connected to the current node is less than the number passes as prop
      return connectedEdges.length < props.isConnectable;
    }

    return props.isConnectable;
  }, [nodeInternals, edges, nodeId, props.isConnectable]);

  return <Handle {...props} isConnectable={isHandleConnectable}></Handle>;
};

CustomHandle.propTypes = {
  isConnectable: PropTypes.node,
};

export default CustomHandle;
