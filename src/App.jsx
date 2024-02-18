import "./App.css";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  addEdge,
  getConnectedEdges,
  useEdgesState,
  useNodesState,
  useOnSelectionChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCallback, useRef, useState, useEffect, useMemo } from "react";
import NodesPanel from "./components/NodesPanel/NodesPanel";
import SettingsPanel from "./components/SettingsPanel/SettingsPanel";
import MessageNode from "./components/MessageNode/MessageNode";

let id = 0;
const getId = () => `messageNode_${id++}`;

function App() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [nodeText, setNodeText] = useState("");

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      setSelectedNodes(nodes.map((node) => node.id));
      setNodeText(nodes[0]?.data.label);
    },
  });

  // define what happens upon connecting one node to another
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            // adding custom id to the edge
            id: `e${params.source}-${params.target}`,
            // making connecting edges to have an arrow at the end
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        )
      ),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      // get the type of the node being dragged
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // get the positional coordinates to drop the new node at coordinates same as cursor irrespective of zoomin or zoomout
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: "Message" },
      };

      // updating the nodes state array appending the new node
      setNodes((existingNodes) => existingNodes.concat(newNode));
    },
    [reactFlowInstance]
  );

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodes?.[0]) {
          node.data = {
            ...node.data,
            label: nodeText,
          };
        }

        return node;
      })
    );
  }, [nodeText, setNodes]);

  // defining the nodeTypes to be feeded to the ReactFlow component
  const nodeTypes = useMemo(() => ({ messageNode: MessageNode }), []);

  const handleSave = () => {
    // get the array of all the edges connected between the nodes present
    const connectedEdges = getConnectedEdges(nodes, edges);

    // get the array of IDs of all the nodes present
    const nodesIdArray = nodes.map((node) => node.id);

    // get the array of Target property of all the connectedEdges array
    const edgesTargetArray = connectedEdges.map((edge) => edge.target);

    let emptyTargetCount = 0;
    // traverse through the nodesIdArray and check if there are more than one nodes with empty target handle
    for (let i = 0; i < nodesIdArray.length; i++) {
      // increment emptyTargeCount if the ID of the node is present in the edgesTargetArray
      // (this checks if the target handle of the node is empty)
      if (!edgesTargetArray.includes(nodesIdArray[i])) {
        emptyTargetCount++;
      }
      // show an alert as soon as more than one node are found with empty target handle and exit the loop
      if (emptyTargetCount == 2) {
        return window.alert("Can't save changes");
      }
    }

    // show "Changes saved successfully" if only one node has empty target handle
    if (emptyTargetCount == 1) {
      window.alert("Changes saved successfullly.");
    }
  };

  return (
    <div className="app-main" ref={reactFlowWrapper}>
      {/* 
          Top bar including the Save Changes button. Written here only for the purpose of this assignment
          Can be broken into separate component easily if needed
       */}
      <div className="top-bar">
        <div className="save-btn-wrapper">
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
      {/* Area containing the flow diagram */}
      <div className="react-flow-wrapper">
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
      {/* Wrapper div for the NodesPanel & Settings Panel */}
      <div className="side-panel-wrapper">
        {/* Show the NodesPanel only if no. of selected nodes is either 0 or more than one */}
        {selectedNodes.length !== 1 && <NodesPanel />}
        {/* 
          Show the settings panel when only one node is selected.
          Support for editing more than one nodes can also be added if needed.
        */}
        {selectedNodes.length == 1 && (
          <SettingsPanel
            nodeText={nodeText}
            setNodeText={setNodeText}
            setSelectedNodes={setSelectedNodes}
          />
        )}
      </div>
    </div>
  );
}

export default App;
